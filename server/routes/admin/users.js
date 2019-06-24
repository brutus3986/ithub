/*
 * 사용자설정 관련 라우팅 함수 정의
 *
 * @date 2018-09-11
 * @author threeon
 */
var crypto = require('crypto');
var config = require('../../config/config');
var Promise = require("bluebird");
var async = require('async');


//사용자설정 메뉴의 고객사 리스트 가져오기
var userList = function(req, res) {
    console.log('/admin/userList 패스 요청됨.');
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var options = {
            "perPage": req.query.perPage,
            "curPage": req.query.curPage,
            "seloption": req.query.seloption,
            "searchinfo": req.query.searchinfo
        };
        var stmt = mapper.getStatement('userInfo', 'countAllUser', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(rows => {
                var startPage = req.query.perPage  * (req.query.curPage -1) ;
                var userCnt = rows[0][0]['userCnt'] ;
                console.log("userCnt" + userCnt);
                if(userCnt > 0) {
                    var options = {
                        "perPage": req.query.perPage,
                        "curPage": req.query.curPage,
                        "seloption": req.query.seloption,
                        "searchinfo": req.query.searchinfo,
                        "startPage" : startPage,
                        "limitPage" : req.query.perPage
                    };
                    try {
                        var stmt = mapper.getStatement('userInfo', 'getUserList', options, {language:'sql', indent: '  '});
                        console.log(stmt);
                        Promise.using(pool.connect(), conn => {
                            conn.queryAsync(stmt).then(results => {
                                     var totalPage = Math.ceil(userCnt / req.query.perPage);
                                    console.log(" totalPage : " + totalPage) ;
                                    var pageInfo = {
                                        "totalPage" : totalPage,
                                        "perPage"   : req.query.perPage,
                                        "curPage"   : req.query.curPage,
                                     };
                                     var resBody = { "pageInfo": pageInfo, "userslist": results[0] };
                                    res.json(resBody);
                                    res.end();
                            }).catch(err => {
                                console.log("getUserList.. FAIL");
                                res.json({ success: false, message: "No Data" });
                                res.end();
                            });
                        });
                    } catch(exception) {
                        console.log("getUserList....... FAIL");
                        res.json({ success: false, message: "FAIL" });
                        res.end();
                    }//회원
                }else {
                     res.json({ success: false, message: "No Data" });
                     res.end();
                }                
            }).catch(err => {
            res.json({ success: false, message: err });
            res.end();
            });
        });

    } catch(exception) {
        console.log("userList " + err);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};

//신규사용자 중복확인
var useridCheck = function(req, res) {
    console.log('/admin/useridCheck 패스 요청됨 ');
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
         var options = {
            "userid": req.body.userid,
        };
        var stmt = mapper.getStatement('userInfo', 'getUserId', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(user => {
                console.log("user:::::" +  (user[0]));
                if (user[0]== null || user[0] == '') {
                    console.log("사용가능한 ID..1");
                    res.json({ success: false, message: "No ID" });
                    res.end();
                } else {
                    console.log("존재하는 ID..");
                    res.json({ success: true, message: "HAS ID" });
                    res.end();
                }                
             }).catch(err => {
                console.dir(err);
                res.json({ success: false, message: err });
                res.end();
            });
        });
    } catch(exception) {
        console.log("useridCheck " + err);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
}

//비밀번호 초기화
var pwdInit = function(req, res) {
    console.log('/admin/pwdInit 패스 요청됨');
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
         var options = {
            "userid": req.body.userid,
        };
        var hashed_password = crypto.createHash('sha256', config.pwd_salt).update(config.pwd_default).digest('base64');
        console.log("hash : " + hashed_password);
        var options = {"userid": userid , "hashed_password": hashed_password };

        var stmt = mapper.getStatement('userInfo', 'getUserId', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(result => {
                console.dir("pwdInit.... OK : " + result);
                res.json({ success: true, message: "OK" });
                res.end();
             }).catch(err => {
                console.log("pwdInit.... Initialize ERROR " + err);
                res.json({ success: false, message: "Initialize ERROR !!" });
                res.end();
            });
        });
   } catch(exception) {
        console.log("pwdInit " + err);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};



//비밀번호 수정
var pwdChange = function(req, res) {
    console.log('/admin/pwdChange 패스 요청됨');
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var userid = req.body.userid;
        var oldPwd = req.body.oldPwd;
        var newPwd = req.body.newPwd;

        var options = {};
        var old_hashed_password = crypto.createHash('sha256', config.pwd_salt).update(oldPwd).digest('base64');
        options.userid = userid;
        options.hashed_password = old_hashed_password;
     
        var stmt = mapper.getStatement('userInfo', 'getUserIdPassword', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(result => {
                if (result[0]== null || result[0] == '') {
                    console.log(" pwdChange PASSWORD Error.......: ");
                    res.json({ success: false, message: "패스워드가 틀렸습니다." });
                    res.end();
                }else{
                    var new_hashed_password = crypto.createHash('sha256', config.pwd_salt).update(newPwd).digest('base64');
                    console.log("hash : " + new_hashed_password);
                    var options1 = {"userid": userid , "hashed_password": new_hashed_password} ;
                    var stmt = mapper.getStatement('userInfo', 'pwdUpdate', options1, {language:'sql', indent: '  '});
                    console.log(stmt);
                    Promise.using(pool.connect(), conn => {
                        conn.queryAsync(stmt).then(result => {
                            console.dir("pwdChange.... OK : " + result);
                            res.json({ success: true, message: "OK" });
                            res.end();
                        }).catch(err => {
                            console.log("pwdChange.... Initialize ERROR " + err);
                            res.json({ success: false, message: "Initialize ERROR !!" });
                            res.end();
                        });
                    });
 
                }    
             }).catch(err => {
                console.log(" pwdChange DB Error.......: " + err);
                res.json({ success: false, message: err });
                res.end();
            });
        });        

   } catch(exception) {
        console.log("pwdInit " + err);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};
여기까지
====================================================>
//신규사용자 등록


var insertInfo = function(req, res) {
    console.log('/users/insertinfo 패스 요청됨 ');

    var mydb = req.app.get('mydb');
    var hashed_password = crypto.createHash('sha256', config.pwd_salt).update(config.pwd_default).digest('base64');

    // 데이터베이스 객체가 초기화된 경우
    if (mydb.db) {

        var userinfo = req.body.userinfo;
        userinfo.hashed_password = hashed_password;

        var options = { "criteria": {}, "userinfo": userinfo };

        var UM = new mydb.UserModel(options.userinfo);
        UM.insertInfo(function(err, result) {
            if (err) {
                console.log("Insert.... FAIL");
                res.json({ success: false, message: "FAIL" });
                res.end();
            } else {
                console.log("Insert.... OK");
                console.log(result);
                res.json({ success: true, message: "OK" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};


//사용자정보 수정
var updateInfo = function(req, res) {
    console.log('/users/updateinfo 패스 요청됨');

    var mydb = req.app.get('mydb');

    // 데이터베이스 객체가 초기화된 경우
    if (mydb.db) {
        var userinfo = req.body.userinfo;
        var options = { "criteria": {"userid": userinfo.userid}, "userinfo": userinfo };

        mydb.UserModel.updateInfo(options, function(err) {
            if (err) {
                console.log("Update.... FAIL " + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            } else {
                console.log("Update.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};

//사용자 삭제
var deleteInfo = function(req, res) {
    console.log('/users/deleteinfo 패스 요청됨.');

    var mydb = req.app.get('mydb');
    if (mydb.db) {
        var bbs_id = req.body.bbs_id;
        var userinfo = req.body.userinfo;
        var options = { "criteria": {"userid": userinfo.userid }, "userinfo": userinfo };

        mydb.UserModel.deleteInfo(options, function(err) {
            if (err) {
                console.log("Delete.... FAIL " + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            } else {
                console.dir("Delete.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};

module.exports.userList = userList;
module.exports.useridCheck = useridCheck;
module.exports.pwdInit= pwdInit;
module.exports.pwdChange= pwdChange;
module.exports.insertInfo = insertInfo;
module.exports.updateInfo = updateInfo;
module.exports.deleteInfo = deleteInfo;
