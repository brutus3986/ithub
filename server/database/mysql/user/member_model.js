/*
 * 설정
 *
 * @date 2019-02-01
 * @author ThreeOn
 * /database/mysql/user/member_model.js
 */
var model = {};

model.getUserInfo = function(options) {
	console.log('getUserInfo');

    var stmt = 'SELECT * from users WHERE 1=1';
    
    if(options.id != null) {
        stmt += ` AND userid = \'${options.id}\'`;
    }
    return stmt;
},

model.updateUserInfo = function(options) {
	console.log('updateUserInfo');

    var stmt = 'SELECT * from users WHERE 1=1';
    
    if(options.id != null) {
        stmt += ` AND userid = \'${options.id}\'`;
    }
    return stmt;
}

module.exports = model;
