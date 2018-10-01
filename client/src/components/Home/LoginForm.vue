<template>
    <div class="login"> <!-- login start-->
        <div class="overlay"> 
            <div class="container">
                <div class="logo">
                </div>
                <div class="row">
                    <div class="col-md-12 mx-auto title">
                        <span class="word-8rem">IT-HUB</span>
                        <h2>코스콤 회원사 보안관제 보고서</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4 col-md-offset-4 mx-auto">
                        <form novalidate @submit.stop.prevent>
                            <div class="form-group">
                                <input type="text" class="form-login" placeholder="USER ID" name="userid" v-model="userid" autofocus/>
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-login" placeholder="PASSWORD" name="password" v-model="password">
                            </div>
                            <div>
                                <button type="submit" class="btn btn-block btn-lg btn-login" v-on:click="loginWithInfo">로그인</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="contact">
                    <p>웹서비스 사용문의 : 정보보호운영팀 안정현 과장 02-767-7116</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Config   from "./../../js/config.js"
import Constant from "./../../store/constant.js"

export default {
    props: [],
    data() {
      return {
        userid   : "",
        password : ""
      };
    },
    methods: {
        loginWithInfo(event) {
            console.log('loginWithInfo');
            var vm = this;
            if (this.loginExceptionHandler()) return true;
            
            axios.post(Config.base_url+'/login', {
                userid   : vm.userid,
                password : vm.password
            }).then(function(response) {
                vm.clearForm();
                if(response.data.success == true) {
                    console.log(response.data);
                    var userid = response.data.userid;
                    vm.$store.commit(Constant.ADD_USER, {
                        userid: response.data.userid, 
                        username: response.data.username, 
                        user_level:response.data.user_level, 
                        comp_no:response.data.comp_no, 
                        comp_name:response.data.comp_name, 
                    });
                    var user_level = response.data.user_level;
                    
                    console.log("user_level : " + user_level);
                    //관리자와 일반유저 구분
                    if(user_level==="admin"){
                        vm.$router.push({
                            path: "/admin/notice"
                        });
                    }else{
                        vm.$router.push({
                            path: "/user/notice"
                        });
                    }
                }else if(response.data.message == 'No Auth IP' ) {    //승인되지 않은 IP
                     alert("승인되지 않은 IP입니다.");
                }else if(response.data.message == 'No Auth TIME' ) {  //승인되지 않은 접속시간
                     alert("승인되지 않은 시간입니다.");
                }else {
                    alert("ID 또는 비밀번호가 일치하지 않습니다.");
                }
            });
        },
        loginExceptionHandler() {
            if (this.userid === "" || this.password === "") {
                alert("계정과 비밀번호를 입력해주세요.");
                return true;
            }
            return false;
        },
        clearForm() {
            this.userid   = "";
            this.password = "";
        }
    }
  };


</script>

<style scoped>

.login {
    color: #fff; text-align: center; 
    background:url(/assets/img/login-bg.jpg)  no-repeat center top ;
    background-size:cover; 
    padding-top: 0rem;
    padding-bottom: 0rem; 
}

.login .logo {
    position: absolute;
    top: 20px;
    left: 30px;
}

.login .overlay {
    position: relative;
    /* background-color: #12181e;
    background-size:cover; 
    opacity: 0.9;   */
}

.login .title {
    padding-top: 8rem;
    padding-bottom: 4rem; 
}

.login form {
    padding-bottom: 7rem; 
}

.login .word-8rem {
    font-size : 5rem;
    font-weight:500;  
}
.login .form-login {
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #FFF;
    background:rgba(0,0,0,0.3);
    background-clip: padding-box;
    border: 1px solid #9ab5d0;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.login .form-login::placeholder {color:#9ab5d0;}
.login .form-login:focus {background:rgba(0,127,255,0.2);border: 1px solid #FFF;}
.login .btn-login {background:#2c6daf;color:#fff;}
.login .btn-login:hover {background:#077ff6;}
.login .contact {
    text-align: right;
}
.contact p {
    padding-bottom: 1rem;
    color:#dadada;
}
/* input[type="text" ] {
    -webkit-text-security: disc !important;
} */
.login input:-webkit-autofill {
    /* background-color: rgb(250, 255, 189) !important;
    background-image: none !important;
    color: rgb(0, 0, 0) !important; */
    /* -webkit-box-shadow: 0 0 0 100px rgba(0,127,255,0.2) inset;
    -moz-box-shadow: 0 0 0 100px rgba(0,127,255,0.2) inset; */
    box-shadow: 0px 0px 0px rgba(0,0,0,0.3) inset;
    /* background:rgba(0,127,255,0.2)!important;border: 1px solid #FFF!important; */
}

</style>
