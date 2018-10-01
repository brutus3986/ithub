/*
 * 회원사명에 대한 정의
 *
 * @date 2018-09-03
 * @author threeon
 */

var Schema = {};

Schema.createSchema = function(mongoose) {

    // 스키마 정의
    var CompInfoSchema = mongoose.Schema({
        comp_no: { type: Number, trim: true, 'default': 0}, // 회원사번호
        comp_name: { type: String, trim: true, 'default': '-'}, // 회원사명
        created_at: { type: Date, 'default': Date.now },
        updated_at: { type: Date, 'default': Date.now }
    });

    // 모델 객체에서 사용할 수 있는 메소드 정의
    CompInfoSchema.statics = {
        //userid로 조회 (사용사 설정 수정/삭제 시 비밀번호 확인)  
        findByCompNo: function(options, callback) {
            return this.find(options.criteria).exec(callback);
        },
        findAll: function(callback) {
            return this.find().exec(callback);
        },
    };

    CompInfoSchema.methods = {

    }

    console.log('CompInfoSchema 정의함.');
    return CompInfoSchema;
};

// module.exports에 CompInfoSchema 객체 직접 할당
module.exports = Schema;