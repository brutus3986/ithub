<template>
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
            <router-link to="/notice" class="navbar-brand">IT-HUB</router-link>
            <div id="navbar" class="collapse navbar-collapse">
                <div class="navbar-nav mr-auto">
                    <ul class="nav navbar-nav">
                        <li class="nav-item">
                            <router-link to="/user/notice" class="nav-link">공지사항</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/user/chart" class="nav-link">일간보고서</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/user/chartterm" class="nav-link">월간보고서</router-link>
                        </li>
                    </ul>
                </div>
                <div class="navbar-nav">
                    <li>
                        <a class="info" @click="changeMyInfo"><i class="fa fa-user"></i> {{ username }} 님</a>
                    </li>
                    <li>
                        <a class="btn-login" @click="logout"><i class="fa fa-sign-out-alt"></i> LOGOUT </a>  
                    </li>
                </div>
            </div>
            <ChangeMyInfoModal v-if="changeMyInfoModalFlag" :userid="userid"></ChangeMyInfoModal>
        </div>
    </nav>
</template>

<script>
import Constant from './../../store/constant.js'
import ChangeMyInfoModal   from  './MyInfo/ChangeMyInfoModal.vue'

export default {
	data() {
		return {
            userid:"",
            username : "",
            comp_name : "",
            changeMyInfoModalFlag : false,
		};
    },
    components: {
        ChangeMyInfoModal : ChangeMyInfoModal,
    },
    created: function() {
        this.$EventBus.$on('closeChangeMyInfoModal', this.closeChangeMyInfoModal);
    },
    beforeDestroy() {
        this.$EventBus.$off('closeChangeMyInfoModal');
    },
    mounted: function() {
		this.getUserName();
	},
	methods: {
		getUserName() {
			this.userid = this.$store.state.user.userid ;
            this.username = this.$store.state.user.username ;
            this.comp_name = this.$store.state.user.comp_name ;
            console.log("comp_name [" + this.$store.state.user.comp_name + "]");
            
			if(this.username == "" || this.username == undefined) {
                this.logout();
			}else {
				// console.log("Success call...........");
			}
		},
		logout() {
			this.userid = "";
            this.username = "";
            this.comp_name = "";
			this.$store.commit(Constant.DELETE_USER);
			this.$router.push({
				path: "/"
            });
        },
        changeMyInfo() {
            console.log('changeMyInfo : [' + this.userid + ']');
            this.changeMyInfoModalFlag = true;
        },
        closeChangeMyInfoModal() {
            this.changeMyInfoModalFlag = false;
        }
	}
};
</script>

<style scoped>
.navbar {padding:0 1rem;}
.navbar-brand {font-weight: bold;margin-right:2rem;}
nav {margin-bottom:3.125rem;background:#171e26;}
.nav-item a.nav-link {display:block;padding:13px 25px 15px;border-bottom:3px solid #171e26;color:rgba(255,255,255,0.75)}
.nav-item a.nav-link:hover {border-bottom:3px solid #0f87ff;color:rgba(255,255,255,1);}
.nav-item .router-link-active {border-bottom:3px solid #0f87ff!important;color:rgba(255,255,255,1)!important;}
.navbar .info {color:rgba(255,255,255,0.75);text-decoration:none;}
.navbar .info:hover {color:rgba(255,255,255,1);}
.navbar-nav .router-link-active {border-bottom:none;color:rgba(255,255,255,1);}
.navbar .btn-login {margin-left:20px;border-radius: 3px;padding:3px 10px;background:#a03737;color:#FFF;font-size:0.75rem;cursor: pointer;}
.navbar .btn-login:hover {color:#FFF;background:#d45252;} 
</style>
