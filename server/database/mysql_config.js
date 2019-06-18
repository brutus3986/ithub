/*
 * 설정
 *
 * @date 2019-02-01
 * @author ThreeOn
 */

module.exports = {
    host: "211.255.203.126",
    port: 7999,
    user: "kc_ithub",
    password: "kc_ithub",
    database: "kc_ithub",
    db_model: [
        { file: './mysql/admin/member_model', modelName: 'AdminUserMember' },
        { file: './mysql/user/board_model', modelName: 'Board' },
        { file: './mysql/user/compinfo_model', modelName: 'CompInfo' },
        { file: './mysql/user/member_model', modelName: 'UserMember' },
    ],
}