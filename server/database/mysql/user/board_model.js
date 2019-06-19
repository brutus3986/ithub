/*
 * 설정
 *
 * @date 2019-02-01
 * @author ThreeOn
 * /database/mysql/user/board_model.js
 */
var model = {};

model.getBbsInfo = function(options) {
	console.log('getBbsInfo');

    var stmt = 'select  * from boards where 1=1';
    
    if(options.criteria.bbs_id != null) {
        stmt += ` AND bbs_id = \'${options.criteria.bbs_id}\'`;
    }
    return stmt;
},
model.getMaxStoryId = function(options) {
	console.log('getMaxStoryId');

    var stmt = 'select  max(story_id) story_id from boards ';
    
    return stmt;
},
model.insertStory = function(options) {
	console.log('insertStory  ' );
    //PreparedStatement: pstmt = null ;

    var stmt  = 'insert into boards( bbs_id,contents,created_at,display,notice,story_id,title,view,writer) ' ;
        stmt += 'values(?,?, now(),?, ?,?,?,?,?)';
    
    return stmt;
},



module.exports = model;
