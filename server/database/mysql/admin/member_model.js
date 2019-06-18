/*
 * 설정
 *
 * @date 2019-02-01
 * @author ThreeOn
 * /database/mysql/user/member_model.js
 */
var model = {};

model.loginByUser = function(options) {
	console.log('loginByUser');

    var stmt = 'SELECT * from users WHERE 1=1';
    
    if(options.id != null) {
        stmt += ` AND userid = \'${options.id}\'`;
    }
    return stmt;
}
model.updateInfo = function(options) {
	console.log('updateInfo' + JSON.stringify(options));

    var stmt = 'update users set total_visit = total_visit + 1 , today_visit = today_visit + 1 , last_visitday = curdate()  WHERE 1=1';
    
    if(options.id != null) {
        stmt += ` AND userid = \'${options.id}\'`;
    }
    return stmt;
}
module.exports = model;
