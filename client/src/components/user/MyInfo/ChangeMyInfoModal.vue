<template>
<transition name="modal">
    <div class="modal-mask">
        <div class="modal-wrapper">
            <div class="modal-container">
                <div class="modal-header">
                    <h3><i class="fa fa-user-edit"></i>회원정보변경</h3>
                </div>
                <div class="modal-body">
                    <form>
                        <!-- 고객명 -->
                        <div class="form-group input-group">
                            <label class="col-md-2 col-form-label">고객명</label>
                            <div class="input-group-prepend">
                                <span class="input-group-text"> <i class="far fa-user fa-fw"></i> </span>
                            </div>
                            <input type="text" class="form-control" v-model="userinfo.name" id="name" readonly="readonly">
                        </div> 
                        <!-- 회원사명 -->
                        <div class="form-group input-group">
                            <label class="col-md-2 col-form-label">회원사명</label>
                            <div class="input-group-prepend">
                                <span class="input-group-text"> <i class="far fa-user fa-fw"></i> </span>
                            </div>
                            <input type="text" class="form-control" v-model="userinfo.comp_name" id="comp_name" readonly="readonly">
                        </div> 
                        <!-- 사용자계정 (등록) -->
                        <div class="form-group input-group">
                            <label class="col-md-2 col-form-label">사용자계정</label>
                            <div class="input-group-prepend">
                                <span class="input-group-text"> <i class="far fa-user fa-fw"></i> </span>
                            </div>
                            <input type="text" class="form-control" v-model="userinfo.userid" id="userid" readonly="readonly">
                        </div> 
                        <!-- 비밀번호 -->
                        <div class="form-group input-group">
                            <label class="col-md-2 col-form-label">비밀번호</label>
                            <button type="button" class="btn btn-gray" @click="pwdChange">비밀번호 변경</button>
                        </div> 
                        <!-- 접속허용IP -->
                        <div class="form-group input-group">
                            <label class="col-md-2 col-form-label">접속허용IP</label>  
                            <div class="input-group-prepend">
                                <span class="input-group-text"> <i class="far fa-hdd fa-fw"></i> </span>
                            </div>
                            <input class="form-control" v-model="userinfo.ipaddr" id="ipaddr"  readonly="readonly">
                        </div> 
                        <!-- 접속시간 -->
                        <div class="form-group input-group">
                            <label class="col-md-2 col-form-label">접속시간</label>  
                            <div class="input-group-prepend">
                                <span class="input-group-text"> <i class="far fa-clock fa-fw"></i> </span>
                            </div>
                            <input class="form-control" v-bind:value="conntime" readonly="readonly" id="conntime"> 
                        </div> 
                        <!-- 핸드폰번호 -->
                        <div class="form-group input-group">
                            <label class="col-md-2 col-form-label">핸드폰번호</label>
                            <div class="input-group-prepend">
                                <span class="input-group-text"> <i class="fas fa-phone fa-fw"></i> </span>
                            </div>
                            <input class="form-control" v-model="userinfo.phonenumber" id="phonenumber">
                        </div> 
                        <!-- 이메일주소 -->
                        <div class="form-group input-group">
                            <label class="col-md-2 col-form-label">E-mail 주소</label>
                            <div class="input-group-prepend">
                                <span class="input-group-text"> <i class="far fa-envelope fa-fw"></i> </span>
                            </div>
                            <input class="form-control" v-model="userinfo.email" id="email">
                        </div> 
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-basic" @click="updateUser">수정</button>
                    <button type="submit" class="btn btn-cancel" @click="closeChangeMyInfoModal">취소</button>
                </div>
            </div>
        </div>
        <ChangePwdModal v-if="pwdChangeFlag" :userid="userinfo.userid"></ChangePwdModal>
    </div>
</transition>
</template>

<script>
import  Config       from  './../../../js/config.js'
import  UtilConstant from  './../../../js/utilConstant.js'
import  ChangePwdModal     from  '../../common/ChangePwdModal.vue'

export default {
    props: ["userid"],
    data: function() {
        return {
            pwdChangeFlag: false,
            userinfo: {},
            conntime: "",
        };
    },
    components: {
        ChangePwdModal   : ChangePwdModal,
    },
    created: function() {
        this.$EventBus.$on('closePwdModal', this.closePwdModal);
    },
    beforeDestroy() {
        this.$EventBus.$off('closePwdModal');
    },
    mounted: function () {
        this.getMyInfo();
    },
    methods: {
        checkForm: function() {
            // var rtn = false;
            var rtn = true;

            // if(this.userinfo.name == "" || this.userinfo.name == undefined) {
            //     alert('고객명을 입력하세요.');
            // }else if(this.userinfo.userid == "" || this.userinfo.userid == undefined) {
            //     alert('ID를 입력하세요.');
            // }else if(this.comp.text == "" || this.comp.text == undefined) {
            //     alert('회원사를 선택하세요.');
            // }else {
            //     rtn = true;
            // }                

            return rtn;
        },
        getMyInfo: function() {
            var vm = this;
            console.log("getMyInfo() userid : " + vm.userid);
            axios.post(Config.base_url+'/user/getuserinfo',{
                "userid" : vm.userid,
            }).then(function(response){
                if(response.data.success==false){
                    alert('해당되는 계정이 없습니다.');
                }else{
                    vm.userinfo = response.data.userinfo;
                    vm.conntime = vm.userinfo.starttime + "시 ~ "+ vm.userinfo.endtime + "시";
                    console.log(vm.userinfo)
                }
            })
        },
        updateUser: function(){
            if(this.checkForm()){
                console.log("updateUser() userid : " + this.userinfo.userid);
                // this.$EventBus.$emit("updateUser", this.userinfo);
                var vm = this;
                vm.userinfo.updated_at  = Date.now();
                
                axios.post(Config.base_url+'/admin/updateInfo', {
                    "userinfo" : vm.userinfo
                }).then(function(response) {
                    // console.log(response);
                    vm.$EventBus.$emit("closeChangeMyInfoModal");
                });
            }
        },
        closeChangeMyInfoModal: function() {
            console.log("emit closeChangeMyInfoModal");
            this.$EventBus.$emit("closeChangeMyInfoModal");
        },
        pwdChange: function(){
            console.log('pwdChange');
            this.pwdChangeFlag = true;
        },            
        closePwdModal: function() {
            console.log("closePwdModal");
            this.pwdChangeFlag = false;
        },
        
    }
};
</script>

<style scoped>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .1s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    width: 60%;
    margin: 0px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .1s ease;
    font-family: Helvetica, Arial, sans-serif;
}

.modal-header {margin-top: 0;padding:10px 0 5px 0;color: #486bdf;border-bottom:2px solid #111;}
.modal-header h3 i::before {color:#2877c7;}
.tar {text-align:right;}
.btn-basic {background:#2877c7;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-basic:hover {background:#145392;}
.btn-cancel {background:#8c9dad;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-cancel:hover {background:#66737e;}
.btn-gray {background:#8c9dad;color:#FFF;font-size:0.9375rem;padding:6px 16px 7px;margin-left:5px;}
.btn-gray:hover {background:#66737e;}

.modal-body {
    margin: 15px 0;
    max-height: 800px;
    padding:0;
}
/* .modal-body .form-group {border-bottom:1px solid #e5e5e5;padding-bottom:15px;} */
.form-control, .custom-select {border-radius: 2px;}
.col-form-label {margin:0;padding: 5px 0 0 5px;color:#111;font-size:1.125rem}

.modal-default-button {
    float: right;
}

.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}

.form-check {padding:3px 0 8px;}
.lamod {
    float: left;
    margin:6px 15px 0 0;
    font-size:1rem;
    color:#7290b4;
    font-weight:bold;
}
.checkbox{
    display: inline-block;
    margin-left: 0px;
    padding:0px;
}
.form-check-inline {display: inline-block;}
.checkbox label {
    display: inline-block;
    vertical-align: middle;
    position: relative;
    padding:4px 5px 0 3px;
}

.checkbox label::before {
    content: "";
    display: inline-block;
    position: absolute;
    width: 20px;
    height: 20px;
    left: -20px;
    top:6px;
    border: 1px solid #cccccc;
    border-radius: 3px;
    background-color: #fff;
    -webkit-transition: border 0.15s ease-in-out, color 0.15s ease-in-out;
    -o-transition: border 0.15s ease-in-out, color 0.15s ease-in-out;
    transition: border 0.15s ease-in-out, color 0.15s ease-in-out;
}

.checkbox label::after {
    display: inline-block;
    position: absolute;
    width: 20px;
    height: 20px;
    left: -20px;
    top: 5px;
    padding-left: 3px;
    padding-top: 5px;
    font-size: 11px;
    color: #555555;
}

.checkbox input[type="checkbox"] {
    opacity: 0;
    z-index: 1;
}

.checkbox input[type="checkbox"]:focus + label::before {
    outline: thin dotted;
    outline: 5px auto -webkit-focus-ring-color;
    outline-offset: -2px;
} 
.checkbox-primary input[type="checkbox"]:checked + label::before {
    background-color: #428bca;
    border-color: #428bca;
}

.checkbox-primary input[type="checkbox"]:checked + label::after {
    color: #fff;
}

.checkbox input[type="checkbox"]:checked + label::after {
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
    content: '\f00c';
    padding-top: 3px;
    padding-left: 4px;
}

.checkbox input[type="checkbox"]:disabled + label {
    opacity: 0.65;
}

.checkbox input[type="checkbox"]:disabled + label::before {
    background-color: #eeeeee;
    cursor: not-allowed;
}
.mod{
    width: 60%;
}
@media (min-width:992px) {
    .col-md-offset-2 {margin-left:16.66666667%;}
}
</style>
