/*
 * 사용자설정 데이터베이스 스키마를 정의하는 모듈
 *
 * @date 2018-04-05
 * @author shinji
 */
var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose) {
    // 스키마 정의
    var UserSchema = mongoose.Schema({
        userid: { type: String, unique: true, required: true, trim: true }, // 사용자계정
        password: { type: String, 'default': '' }, // 비밀번호
        hashed_password: { type: String, 'default': '' },
        user_level: { type: String, 'default': 'normal' }, // 관리자 혹은 일반사용자
        name: { type: String, index: 'hashed', trim: true, 'default': '-' }, // 고객명
        comp_no: { type: Number, 'default': 0 }, // 회원사 번호
        comp_name: { type: String, index: 'hashed', trim: true, 'default': '-' }, // 회원사명
        phonenumber: { type: String, index: 'hashed', trim: true, 'default': '-' }, // 핸드폰 나머지 번호
        email: { type: String, index: 'hashed', trim: true, 'default': '-' }, // EMAIL
        ipaddr: { type: String, trim: true, 'default': '-' }, // IPADDR
        starttime: { type: Number, 'default': 00 }, // 접속시간  to 
        endtime: { type: Number, 'default': 00 }, // 접속시간 from 
        today_visit: { type: Number, 'default': 0 }, // Today visit
        total_visit: { type: Number, 'default': 0 }, // Total visit
        created_at: { type: Date, index: { unique: false }, 'default': Date.now },
        updated_at: { type: Date, index: { unique: false }, 'default': Date.now },
        last_visitday: { type: Date, index: { unique: false }, 'default': Date.now }, // 마지막 방문 날짜
    });

    // 내부 공통함수 정의
    var validatePresenceOf = function(value) {
        return value && value.length;
    };
    var makeSalt = function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    }

    var encryptPassword = function(plainText, inSalt) {
        if (inSalt) {
            return crypto.createHash('sha256', inSalt).update(plainText).digest('base64');
        } else {
            return crypto.createHash('sha256', this.salt).update(plainText).digest('base64');
        }
    }

    // 주석풀어야함. password를 사용하려고 주석처리

    // password를 virtual 메소드로 정의 : MongoDB에 저장되지 않는 편리한 속성임. 특정 속성을 지정하고 set, get 메소드를 정의함
    // UserSchema
    //   .virtual('password')
    //   .set(function(password) {
    //     this._password = password;
    //     this.salt = makeSalt();
    //     this.hashed_password = encryptPassword(password, this.salt);
    //     console.log('virtual password 호출됨 : ' + this.hashed_password);
    //   })
    //   .get(function() { return this._password });


    // 입력된 칼럼의 값이 있는지 확인
    UserSchema.path('userid').validate(function(userid) {
        return userid.length;
    }, 'userid 칼럼의 값이 없습니다.');

    // 모델 객체에서 사용할 수 있는 메소드 정의
    UserSchema.statics = {

        //로그인 (ID체크) login.js에서 사용
        loginByUser: function(options, callback) {
            console.log(options.criteria);
            return this.find(options.criteria).exec(callback);
        },
        //전체 사용자수 조회
        countAllUser: function(callback) {
            return this.find().count().exec(callback);
        },
        //userid로 조회 (사용사 설정 수정/삭제 시 비밀번호 확인)  
        findByUserId: function(userid, callback) {
            return this.find({ userid }).exec(callback);
        },
        //사용자 가져오기
        findByOptions: function(options, callback) {
            return this.find(options.criteria)
                // .sort({'userid': -1})
                .sort({ 'updated_at': -1 })
                .skip(Number(options.perPage) * (Number(options.curPage) - 1))
                .limit(Number(options.perPage))
                .exec(callback);
        },
        //사용자정보 수정
        updateInfo: function(options, callback) {
            return this.findOneAndUpdate(options.criteria, options.userinfo, true).exec(callback);
        },
        //사용자정보 삭제
        deleteInfo: function(options, callback) {
            return this.findOneAndRemove(options.criteria, options.userinfo).exec(callback);
        },
        //기존 비밀번호 확인
        getOrginPwd: function(options, callback) {
            return this.find(options.criteria).exec(callback);
        },
        // 비밀번호 초기화
        pwdChange: function(options, callback) {
            return this.findOneAndUpdate(options.criteria, options.pwdInfo).exec(callback);
        },
        //일반사용자 비밀번호 변경
        changePwd: function(options, callback) {
            return this.findOneAndUpdate(options.criteria, options.pwdInfo).exec(callback);
        },
        // 당일 방문수 초기화(cronjob)
        initTodayVisit: function(callback) {
            return this.update({}, {$set : {today_visit:0}}, {multi:true}).exec(callback);
        },
        //로그인 시 방문 업데이트 login.js에서 사용
        updateCount: function(options, callback) {
            return this.update(options.criteria, options.userview).exec(callback);
        },
        getUserByGubun: function(options, callback) {
            return this.find(options, { _id: false, userid: true, name: true, cable_name: true }).exec(callback);
        },
        //어떻게 사용하지..
        authenticate: function(plainText, inSalt, hashed_password) {
            if (inSalt) {
                console.log('inSalt authenticate 호출됨 : %s -> %s : %s', plainText, encryptPassword(plainText, inSalt), hashed_password);
                return encryptPassword(plainText, inSalt) === hashed_password;
            } else {
                console.log('authenticate 호출됨 : %s -> %s : %s', plainText, encryptPassword(plainText), this.hashed_password);
                return encryptPassword(plainText) === this.hashed_password;
            }
        }
    };

    UserSchema.methods = {
        insertInfo: function(callback) {
            return this.save(callback);
        },
    }
    console.log('UserSchema 정의함.');
    return UserSchema;
};

// module.exports에 UserSchema 객체 직접 할당
module.exports = Schema;