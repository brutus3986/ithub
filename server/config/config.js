/*
 * 설정
 *
 * @date 2018-08-31
 * @author ThreeOn
 */

module.exports = {
    runenv: "dev",
    // runenv: "prod",
    server_port: 8021,
    // base_url: "http://127.0.0.1:8021",
    // base_url: "http://ithubtest.koscom.co.kr",
    base_url: "https://ithub.koscom.co.kr",
    db_url: "mongodb://127.0.0.1:27017/ithub",
    pwd_salt: "11aabb..",
    pwd_default: "11aabb..",
    db_schemas: [
        { file: './user_schema', collection: 'users', schemaName: 'UserSchema', modelName: 'UserModel' },
        { file: './board_schema', collection: 'boards', schemaName: 'BoardSchema', modelName: 'BoardModel' },
    ],
    route_info: [
        // 로그인
        { file: './admin/login', path: '/login', method: 'checkLogin', session: 'uncheck', type: 'post' },
        //공지사항
        { file: './admin/board', path: '/board/liststory', method: 'listStory',  session: 'check', type: 'get' },
        { file: './admin/board', path: '/board/insertstory', method: 'insertStory',  session: 'check', type: 'post' },
        { file: './admin/board', path: '/board/updatestory', method: 'updateStory',  session: 'check', type: 'post' },
        { file: './admin/board', path: '/board/deletestory', method: 'deleteStory',  session: 'check', type: 'post' },
        { file: './admin/board', path: '/board/updateviewcount', method: 'updateViewCount',  session: 'check', type: 'post' },
        //관리자 리포트
        { file: './admin/chart', path: '/admin/chart/chartlistterm', method: 'getUserChartListTerm',  session: 'check', type: 'post' },
        { file: './admin/chart', path: '/admin/chart/downloadfileterm', method: 'downloadFileTerm',  session: 'check', type: 'post' },
        { file: './admin/chart', path: '/admin/chart/chartlistmonth', method: 'getUserChartListMonth',  session: 'check', type: 'post' },
        { file: './admin/chart', path: '/admin/chart/downloadfilemonth', method: 'downloadFileMonth',  session: 'check', type: 'post' },
        //사용자설정
        { file: './admin/users', path: '/admin/userlist', method: 'userList',  session: 'check', type: 'get' },
        { file: './admin/users', path: '/admin/insertinfo', method: 'insertInfo',  session: 'check', type: 'post' },
        { file: './admin/users', path: '/admin/updateinfo', method: 'updateInfo',  session: 'check', type: 'post' },
        { file: './admin/users', path: '/admin/deleteinfo', method: 'deleteInfo',  session: 'check', type: 'post' },
        { file: './admin/users', path: '/admin/useridcheck', method: 'useridCheck',  session: 'check', type: 'post' },
        { file: './admin/users', path: '/admin/pwdinit', method: 'pwdInit',  session: 'check', type: 'post' },
        { file: './admin/users', path: '/admin/pwdchange', method: 'pwdChange',  session: 'check', type: 'post' },
        //일반고객 특이사항
        { file: './user/specinfo', path: '/user/getuserspecinfo', method: 'getUserSpecInfo', session: 'check', type: 'get' },
        //일반고객 리포트
        { file: './user/chart', path: '/user/chart/chartlistterm', method: 'getUserChartListTerm', session: 'check', type: 'post' },
        { file: './user/chart', path: '/user/chart/downloadfileterm', method: 'downloadFileTerm',  session: 'check', type: 'post' },
        { file: './user/chart', path: '/user/chart/chartlistmonth', method: 'getUserChartListMonth',  session: 'check', type: 'post' },
        { file: './user/chart', path: '/user/chart/downloadfilemonth', method: 'downloadFileMonth',  session: 'check', type: 'post' },
        //일반고객 회원정보죄회
        { file: './user/users', path: '/user/getuserinfo', method: 'getUserInfo', session: 'check', type: 'post' },
        { file: './user/users', path: '/user/updateuserinfo', method: 'updateUserInfo', session: 'check', type: 'post' },
    ]
}