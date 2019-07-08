<template>
    <main>
        <div class="container">
            <br>
            <div class="form">   
                <div class="search">     <!-- 고객사명으로 검색  -->
                    <div class="form-group">
                        <select v-model="seloption" class="form-control">
                            <option v-for="option in options" :key="option.index" :value="option.value">
                                {{option.text}}
                            </option>    
                        </select>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control" v-model.trim="searchinfo" v-on:keyup.enter="fetchUsersList"/>
                    </div>    
                </div>       
            </div>
            <UsersTable :userslist="userslist"></UsersTable>
            <div class="paging-row">
                <div class="pginnerdiv">
                    <ul class="pagination">
                        <li class="page-item"><a class="page-link"  @click="prevInfo"> &laquo; </a></li>
                        <li v-for="curPage in totalPage" v-bind:key="curPage.index">
                            <a class="page-link curpage"  @click="setPage(curPage)">
                                {{curPage}}
                            </a>
                        </li> 
                        <li class="page-item"><a class="page-link"  @click="nextInfo"> &raquo; </a></li>
                    </ul>
                </div>       
            </div>
			<p class="tar">
                <button @click="addUsers" class="btn btn-basic">사용자추가</button>
            </p>
            <UsersModal v-if="userModal" :userinfo="userinfo" :gubun="modalgubun"></UsersModal>
        </div>
    </main>
</template>
<script>
import  Config       from  './../../../js/config.js'
import  UsersTable   from  './UsersTable.vue'
import  UsersModal   from  './UsersModal.vue'

export default {
    props:[],
    data:function(){
        return{
            curPage   : 1,
            totalPage : 0,
            perPage   : 200,
            userModal : false,
            pwdModal  : false,
            modalgubun: 0,
            userslist :[],
            userinfo  :{},
            searchinfo:'',
            seloption: '',
            options:[
                {text:"고객명",   value:"name"},
                {text:"회원사명",   value:"comp_name"},
                {text:"사용자계정", value:"userid"},
            ]
        } 
    },
    components: {
        UsersTable   : UsersTable,
        UsersModal   : UsersModal,
    },
    computed:{
    },
    mounted : function(){
        this.fetchUsersList();
    },
    created: function() {
        this.$EventBus.$on('insertUser', this.insertInfo);
        this.$EventBus.$on('updateUser', this.updateInfo);
        this.$EventBus.$on('deleteUser', this.deleteInfo);
        this.$EventBus.$on('closeUserModal', this.closeUserModal);
        this.$EventBus.$on('showUser', this.showInfo);
    },
    beforeDestroy() {
        this.$EventBus.$off('insertUser');
        this.$EventBus.$off('updateUser');
        this.$EventBus.$off('deleteUser');
        this.$EventBus.$off('closeUserModal');
        this.$EventBus.$off('closeInfo' );
        this.$EventBus.$off('showInfo'  );
    },
    methods:{
        fetchUsersList: function(){
            console.log('fetchUsersList');
            var vm = this;
            
            axios.get(Config.base_url+'/admin/userlist',{
                params: {
                     "seloption" : this.seloption,
                    "searchinfo" : this.searchinfo,
                    "curPage": this.curPage,
                    "perPage": this.perPage
                }
            }).then(function(response){
                if(response.data.success == false){
                    alert('해당되는 계정이 없습니다.');
                }else{
                    var tlist = response.data.userslist;
                    tlist.forEach(function(user, index) {
                        user.updated_at = user.updated_at.substring(0, 10);
                        user.last_visitday = user.last_visitday.substring(0, 10);
                    });
                    vm.userslist = tlist;
                    vm.totalPage = response.data.pageInfo.totalPage;
                }
            })
        },
        clearInfo : function(){
            console.log('clearInfo');
            this.modalgubun = 1;        // 신규 1, 수정 2
            this.userinfo = {
                "userid"       : "",
                "oldId"        : "",
                "name"         : "",
                "compName"     : "",
                "password"     : "",
                "oldpassword"  : "",
                "phonenumber"  : "",
                "email"        : "",
                "ipaddr"       : "",    
                "starttime"    : 8,
                "endtime"      : 18,
                "conntime"     :"",
                "user_level"   : "normal",
            };
        },
        addUsers : function(){
            console.log("addUsers");
            this.clearInfo();
            this.userModal = true;    
        },
        showInfo: function(user) {
            console.log("showInfo");
            this.userModal  = true;
            this.userinfo.userid        = user.userid;              // 사용자계정
            this.userinfo.name          = user.name;                // 고객명
            this.userinfo.comp_no      = user.comp_no;           // 회원사번호
            this.userinfo.comp_name      = user.comp_name;           // 회원사명
            this.userinfo.phonenumber   = user.phonenumber;         // 핸드폰 번호
            this.userinfo.email         = user.email;               // E-mail주소
            this.userinfo.ipaddr        = user.ipaddr;              // 접속허용  IP
            this.userinfo.starttime     = user.starttime;           // 접속가능시간 to
            this.userinfo.endtime       = user.endtime;             // 접속가능시간 from
            this.userinfo.user_level    = user.user_level;          // 유저 레벨 (일반고객, 관리자)
            this.modalgubun = 2;    // 신규 1, 수정 2
        },
        insertInfo: function(userinfo) {
            console.log('insertInfo');
            var vm = this;
            vm.userModal = false;
            axios.post(Config.base_url+'/admin/insertinfo', {
                "userinfo" : userinfo
            }).then(function(response) {
                // console.log(response);
                vm.fetchUsersList();
            });
        },
        updateInfo: function(userinfo) {
            console.log('updateInfo');
            var vm = this;
            vm.userModal = false;
            userinfo.updated_at  = Date.now();
            
            axios.post(Config.base_url+'/admin/updateInfo', {
                "userinfo" : userinfo
            }).then(function(response) {
                // console.log(response);
                vm.fetchUsersList();
            });
        },
        deleteInfo: function(userinfo) {
            console.log("deleteInfo");
            var vm = this;
            vm.userModal = false;
            
            axios.post(Config.base_url+'/admin/deleteinfo', {
                "userinfo" : userinfo
            }).then(function(response) {
                // console.log(response);
                vm.fetchUsersList();
            });
        },
        //수정, 삭제 시 비밀번호 모달
        confirmPwd: function(){
            console.log('confirmPwd');
            var vm = this;
            vm.pwdModal = true;
        },
        //비밀번호 입력 확인
        enterPwd : function(userinfo){
            console.log('enterPwd');
            var adminid = this.$store.state.user.userid;
            var vm = this;
            vm.pwdModal = false;
            var adminpwd = userinfo.m_password;
            var pwdgubun = userinfo.pwdgubun;
                        
            axios.post(Config.base_url+'/confirmpassword',{
                "userid"  : adminid ,   
                "password": adminpwd
            }).then(function(response){
                // console.log(response);
                if(response.data.success==false){
                    alert('비밀번호가 틀립니다.');
                }else{
                    if(pwdgubun==1){   //1:수정 수정, 삭제 비밀번호 확인 모달창을 같이 써서 구분.
                        vm.updateInfo(userinfo);
                    }else {  //2:삭제
                        vm.deleteInfo(userinfo);
                    }
                }
            });
        },
        closeUserModal: function() {
            console.log('closeUserModal.... ');
            this.userModal = false;
        },
        closePwd:function(){
            console.log('closePwd');
            var vm = this;
            vm.pwdModal = false;
        },
        prevInfo: function() {
            if (this.curPage > 1) {
                this.curPage -= 1;
                this.fetchUsersList();
            }
        },
        setPage : function(curPage){
            this.curPage = curPage;
            this.fetchUsersList();
        },
        nextInfo: function() {
            if (this.totalPage > this.curPage) {
                this.curPage += 1;
                this.fetchUsersList();
            }
        },
    }
}
</script>
<style scoped>
.form {display:block;padding-bottom: 1rem;}
.total-num {float:left;}
.search {float:right;}
.form-group {display: inline-block;}
.form-control {border-radius: 2px;}
.count{color:#777;font-size: 1.25rem;}
.count em {color:#1577da;font-style: normal;font-weight: bold;}
.btn-small {background:#8c9dad;color:#FFF;font-size:0.75rem;padding:2px 8px;}
.btn-small:hover {background:#7ea1c5;}
.btn{
    margin-left: 10px;
}
.pagetext {
    padding: 5px 30px 0px 30px;
}

.mod {
    margin-left : 15px;
}

.search{
    margin-left : 160px;
}

.paging-row {
    width: 100%;
    text-align : center;
}
.pginnerdiv{
    display: inline-block;
}
ul.pagination li {display: inline;}

ul.pagination li a {
    color: rgb(32, 32, 32);
    float: left;
    padding: 8px 16px;
    text-decoration: none;
    transition: background-color .3s;
    border: 1px solid #ddd;
}
ul li a:hover, ul li a:focus {  
    color:#fff;  
    border:1px solid rgb(228, 219, 217);  
    background-color:rgb(228, 219, 217);   
}
ul.pagination li a:hover:not(.active) {background-color: #ddd;}
.tar {text-align:right;}
.btn-basic {background:#2877c7;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-basic:hover {background:#145392;}
</style>

