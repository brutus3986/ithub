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

// 사용사 정보 조회
var getUserInfo = function(req, res) {
    console.log('/users/getUserInfo 패스 요청됨.');
    console.log(req.body);
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");
        var userid = req.body.userid || req.query.userid;
        console.log("getUserInfo : " + req.body.userid);
        console.log("getUserInfo : " + req.query.userid);
        var options = {
            "userid": userid,
        };
        
        var stmt = mapper.getStatement('userInfo', 'getUserId', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(user => {
                 if (user[0]== null || user[0] == '') {
                    res.json({ success: false, message: "No Data" });
                    res.end();
                } else {
                    res.json({ success: true, message: "OK", userinfo: user[0]});
                    res.end();
                }                
             }).catch(err => {
                console.dir(err);
                res.json({ success: false, message: err });
                res.end();
            });
        });
    } catch(exception) {
        console.log("getUserInfo " + err);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};

//사용자정보 수정
var updateUserInfo = function(req, res) {
    console.log('/users/updateUserInfo 패스 요청됨');
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var userinfo = req.body.userinfo;
        var options = { "userid": userinfo.userid, "userinfo": userinfo };
        var stmt = mapper.getStatement('userInfo', 'updateInfo', options, {language:'sql', indent: '  '});
    
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(user => {
                console.dir("Update.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();               
             }).catch(err => {
                console.log("Update.... FAIL " + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            });
        });
    } catch(exception) {
        console.log("updateUserInfo " + err);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};

module.exports.getUserInfo = getUserInfo;
module.exports.updateUserInfo = updateUserInfo;
