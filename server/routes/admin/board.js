/*
 * 공지사항을 위한 라우팅 함수 정의
 *
 * @date 2018-04-05
 * @author shjinji
 */

//공지사항 리스트 
var listStory = function(req, res) {
    console.log('/board/liststory 패스 요청됨.');

    var mydb = req.app.get('mydb');
 
    if(req.query.bbs_id == undefined) {
        console.log("F5 TEST..........................");
    }

    // 데이터베이스 객체가 초기화된 경우
    if (mydb.db) {
         var options = {
            "criteria": { "bbs_id": req.query.bbs_id },
            "perPage": req.query.perPage,
            "curPage": req.query.curPage
        };
        if(req.query.searchinfo != '') {
            var sinfo = '.*' + req.query.searchinfo + '*.';
            if(req.query.seloption == 'title') {
                options.criteria = { $and: [ { title : {$regex : sinfo, $options:"i" }}, ] };
            }else if(req.query.seloption == 'writer') {
                options.criteria = { $and: [ { writer : {$regex : sinfo, $options:"i" }}, ] };
            }else {
                options.criteria = { $and: [ { contents : {$regex : sinfo, $options:"i" }}, ] };
            }
        }
        console.log("option : " + JSON.stringify(options)); 
        var stmt = mydb.Board.getBbsInfo(options);
        mydb.db.query(stmt, function(err, results) {
             if (err) {
                console.log("findByBbsId " + err);
            } else {
                console.log("findByBbsId.... SUCCESS ");
            }
            if(results.length == 0) {
                res.json({ success: false, message: "No Data" });
                res.end();
            }else {
                var totalPage = Math.ceil(results.length / req.query.perPage);
                var pageInfo = {
                    "totalPage": totalPage,
                    "perPage": req.query.perPage,
                    "curPage": req.query.curPage
                };
                var resBody = { "pageInfo": pageInfo, "stories": results, "count": results.length };
                res.json(resBody);
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};

//공지사항 신규등록
var insertStory = function(req, res) {
    console.log('/board/insertstory 패스 요청됨.');

    var mydb = req.app.get('mydb');

    // 데이터베이스 객체가 초기화된 경우
    if (mydb.db) {

        var bbs_id = req.body.bbs_id;
        var storyInfo = req.body.storyinfo;
        var options = { "criteria": { "bbs_id": bbs_id }, "storyinfo": storyInfo };
        var stmt = mydb.Board.getMaxStoryId(options);
        mydb.db.query(stmt, function(err, result) {
             if (err) {
                res.json({ success: false, message: err });
                res.end();
            }else if(result === null || result ){
                if(result === null){
                    var maxStoryId = 1;
                }else{
                    var maxStoryId = result.story_id + 1;
                }
                options.storyinfo.story_id = maxStoryId;
                storyInfo.story_id = maxStoryId;
                //var tModel = new mydb.Board(options.storyinfo);
                var stmt = mydb.Board.insertStory(options);
                console.log("storyInfo" + JSON.stringify(storyInfo));
                console.log(stmt);
                mydb.db.query(stmt,[storyInfo.bbs_id,storyInfo.contents,storyInfo.display,storyInfo.notice,storyInfo.story_id ,storyInfo.title,storyInfo.view,storyInfo.writer], function(err, results) {
                     if (err) {
                        console.log("Insert.... FAIL");
                        res.json({ success: false, message: "FAIL" });
                        res.end();
                    } else {
                        console.log("Insert.... OK");
                        res.json({ success: true, message: "OK" });
                        res.end();
                    }
                });
            }else {
                res.json({ success: false, message: "No Data" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};

//공지사항 게시글 수정
var updateStory = function(req, res) {
    console.log('/board/updatestory 패스 요청됨.');

    var mydb = req.app.get('mydb');

    // 데이터베이스 객체가 초기화된 경우
    if (mydb.db) {
        var bbs_id = req.body.bbs_id;
        var storyInfo = req.body.storyinfo;
        var options = { "criteria": { "bbs_id": bbs_id, "story_id": storyInfo.story_id }, "storyinfo": storyInfo };

        mydb.Board.updateStory(options, function(err) {
            if (err) {
                console.log("Update.... FAIL " + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            } else {
                console.dir("Update.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};

// 조회수 업데이트
var updateViewCount = function(req, res) {
    console.log('updateViewCount 요청됨.');

    var mydb = req.app.get('mydb');

    // 데이터베이스 객체가 초기화된 경우
    if (mydb.db) {

        var bbs_id = req.body.bbs_id;
        var story_id = req.body.story_id;
        var options = { "criteria": { "bbs_id": bbs_id, "story_id": story_id }};

        mydb.Board.updateViewCount(options, function(err) {
            if (err) {
                console.log("updateViewCount Update.... FAIL " + err);
                res.json({ success: false, message: "FAIL" });
                res.end();
            } else {
                console.dir("updateViewCount Update.... OK ");
                res.json({ success: true, message: "OK" });
                res.end();
            }
        });
    } else {
        res.json({ success: false, message: "DB connection Error" });
        res.end();
    }

};

//공지사항 게시글 삭제
var deleteStory = function(req, res) {
    console.log('/board/deletestory 패스 요청됨.');

    var mydb = req.app.get('mydb');

    if (mydb.db) {

        var bbs_id = req.body.bbs_id;
        var storyInfo = req.body.storyinfo;
        var options = { "criteria": { "bbs_id": bbs_id, "story_id": storyInfo.story_id }, "storyinfo": storyInfo };

        mydb.Board.deleteStory(options, function(err) {
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

module.exports.listStory = listStory;
module.exports.insertStory = insertStory;
module.exports.updateStory = updateStory;
module.exports.updateViewCount = updateViewCount;
module.exports.deleteStory = deleteStory;