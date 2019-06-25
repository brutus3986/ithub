/*
 * 사용자 보안관제 특이사항
 *
 * @date 2018-09-19
 * @author ThreeOn
 */
var config = require('../../config/config');
var Promise = require("bluebird");
var async = require('async');

// 사용사 특이사항 정보 조회
var getUserSpecInfo = function(req, res) {
    console.log('/user/getUserSpecInfo 패스 요청됨.');
    console.log(req.body);
    try {
        var pool = req.app.get("pool");
        var mapper = req.app.get("mapper");

        var options = {
            "bbs_id": req.query.bbs_id, 
            "comp_no": req.query.comp_no,
            "notice": req.query.notice,
        }
        console.log("option:::::" +  JSON.stringify(options));
        var stmt = mapper.getStatement('board', 'getUserSpecInfo', options, {language:'sql', indent: '  '});
        console.log(stmt);
        Promise.using(pool.connect(), conn => {
            conn.queryAsync(stmt).then(results => {
                console.log("results:::::" +  JSON.stringify(results[0]));
                if (results[0]== null || results[0] == '') {
                    res.json({ success: false, message: "No Data" });
                    res.end();
                } else {
                    var resBody = {"specinfo": results[0]};
                    res.json(resBody);
                    res.end();
                }                
             }).catch(err => {
                console.dir(err);
                res.json({ success: false, message: err });
                res.end();
            });
        });
     } catch(exception) {
        console.log("getUserSpecInfo " + err);
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }
};

module.exports.getUserSpecInfo = getUserSpecInfo;
