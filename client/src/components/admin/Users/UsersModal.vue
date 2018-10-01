<template>
<transition name="modal">
    <div class="modal-mask">
        <div class="modal-wrapper">
            <div class="modal-container">
                <div class="modal-header">
                    <h3 v-if="gubun == 1"><i class="fa fa-user-plus"></i>사용자등록</h3>
                    <h3 v-else><i class="fa fa-user-edit"></i>사용자수정</h3>
                </div>
                <div class="modal-body">
                    <form>
                        <!-- 고객명 -->
                        <div class="form-group input-group">
                            <label class="col-md-2 col-form-label">고객명</label>
                            <div class="input-group-prepend">
                                <span class="input-group-text"> <i class="far fa-user fa-fw"></i> </span>
                            </div>
                            <input type="text" class="form-control" v-model="userinfo.name" id="name" required="required">
                        </div> 
                        <!-- 회원사명 -->
                        <div class="form-group input-group">
                            <label class="col-md-2 col-form-label">회원사명</label>
                            <select class="custom-select" style="max-width: 180px;" v-model="comp">
                                <option selected="selected">{{comp_name}}</option>
                                <option v-for="option in complist" :key="option.index" :value="option">
                                    {{option.text}}
                                </option>    
                            </select>
                        </div> 
                        <!-- 사용자계정 (등록) -->
                        <div v-if="gubun == 1" class="form-group input-group">
                            <label class="col-md-2 col-form-label">사용자계정</label>
                            <div class="input-group-prepend">
                                <span class="input-group-text"> <i class="far fa-id-card fa-fw"></i> </span>
                            </div>
                            <input type="text" class="form-control mod" v-model.trim="userinfo.userid" id="userid" required="required">
                            <button type="button" class="btn btn-gray" @click="useridCheck">중복확인</button>
                        </div> 
                        <!-- 사용자계정 (수정) -->
                        <div v-else class="form-group input-group">
                            <label class="col-md-2 col-form-label">사용자계정</label>
                            <div class="input-group-prepend">
                                <span class="input-group-text"> <i class="far fa-id-card fa-fw"></i> </span>
                            </div>
                            <input type="text" class="form-control mod" v-model.trim="userinfo.userid" id="userid" readonly="readonly">
                        </div> 
                        <!-- 비밀번호 -->
                        <div v-if="gubun != 1" class="form-group input-group">
                            <label class="col-md-2 col-form-label">비밀번호</label>
                            <button type="button" class="btn btn-gray" @click="pwdInit">비밀번호 초기화</button>
                            <button type="button" class="btn btn-gray" @click="pwdChange">비밀번호 변경</button>
                        </div> 
                        <!-- 접속허용IP -->
                        <div class="form-group input-group">
                            <label class="col-md-2 col-form-label">접속허용IP</label>  
                            <div class="input-group-prepend">
                                <span class="input-group-text"> <i class="far fa-hdd fa-fw"></i> </span>
                            </div>
                            <input class="form-control" v-model="userinfo.ipaddr" id="ipaddr">
                        </div> 
                        <!-- 접속시간 -->
                        <div class="form-group input-group">
                            <label class="col-md-2 col-form-label">접속시간</label>  
                            <div class="input-group-prepend">
                                <span class="input-group-text"> <i class="far fa-clock fa-fw"></i> </span>
                            </div>
                            <select class="custom-select" style="max-width: 180px;" v-model="userinfo.starttime" v-on:change="changeTime">
                                <option v-for="time in timelist" :key="time.index" :value="time.value">
                                    {{time.text}}
                                </option>    
                            </select>
                            <select class="custom-select" style="max-width: 180px;" v-model="userinfo.endtime" v-on:change="changeTime">
                                <option v-for="time in timelist" :key="time.index" :value="time.value">
                                    {{time.text}}
                                </option>    
                            </select>
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
                        <!-- 사용자 권한 -->
                        <div class="form-group input-group">
                            <label class="col-md-2 col-form-label">사용자 권한</label>
                            <div class="input-group-prepend">
                                <span class="input-group-text"> <i class="fas fa-user fa-fw"></i> </span>
                            </div>
                            <select class="custom-select" v-model="userinfo.user_level">
                                <option value="normal">일반고객</option>
                                <option value="admin">관리자</option>
                                <option value="test">test계정</option>
                            </select> 
                        </div> 
                    </form>
                </div>
                <div class="modal-footer">
                    <div v-if="gubun===1" class="tar">
                        <button type="submit" class="btn btn-primary" @click="insertUser">등록</button>
                    </div>
                    <div v-else class="tar" role="group" >
                        <button type="submit" class="btn btn-basic" @click="updateUser">수정</button>
                        <button type="submit" class="btn btn-basic" @click="deleteUser">삭제</button>
                    </div>
                    <button type="submit" class="btn btn-cancel" @click="closeUserModal">취소</button>
                </div>
            </div>
        </div>
        <ChangePwdModal v-if="pwdChangeFlag" :userid="userinfo.userid"></ChangePwdModal>
    </div>
</transition>
</template>

<script>
import  Config       from  '../../../js/config.js'
import  UtilConstant from  '../../../js/utilConstant.js'
import  ChangePwdModal     from  '../../common/ChangePwdModal.vue'

export default {
    props: ["userinfo", "gubun"],
    data: function() {
        return {
            idDupCheckFlag: false,
            pwdChangeFlag: false,
            conntime: "",
            comp_name: "",
            comp: {},
            complist: [],
            timelist:[],    
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
        this.conntime = this.userinfo.starttime + "시 ~ "+ this.userinfo.endtime + "시";
        this.comp = {"value":this.userinfo.comp_no, "text":this.userinfo.comp_name};
        this.timelist = UtilConstant.timelist;
        this.complist = UtilConstant.complist;
    },
    methods: {
        checkForm: function() {
            var rtn = false;

            if(this.userinfo.name == "" || this.userinfo.name == undefined) {
                alert('고객명을 입력하세요.');
            }else if(this.userinfo.userid == "" || this.userinfo.userid == undefined) {
                alert('ID를 입력하세요.');
            }else if(this.comp.text == "" || this.comp.text == undefined) {
                alert('회원사를 선택하세요.');
            }else {
                rtn = true;
            }                

            return rtn;
        },
        insertUser: function() {
            if(this.checkForm()){
                if(this.idDupCheckFlag == false) {
                    alert('ID 중복 확인하세요.');
                }else {
                    this.userinfo.comp_no = this.comp.value;
                    this.userinfo.comp_name = this.comp.text;
                    this.$EventBus.$emit("insertUser", this.userinfo);
                }                    
            }
        },
        updateUser: function(){
            if(this.checkForm()){
                console.log("username : " + this.userinfo.name);
                this.userinfo.comp_no = this.comp.value;
                this.userinfo.comp_name = this.comp.text;
                this.$EventBus.$emit("updateUser", this.userinfo);
            }
        },
        deleteUser: function(){
            this.$EventBus.$emit("deleteUser", this.userinfo);
        },
        closeUserModal: function() {
            console.log("emit closeUserModal");
            this.$EventBus.$emit("closeUserModal");
        },
        useridCheck: function(){
            console.log('useridCheck');
            var vm = this;
            
            if(vm.userinfo.userid == ''){
                alert('ID를 입력하세요.');
            }else{
                axios.post(Config.base_url+'/admin/useridcheck', {
                    "userid" : vm.userinfo.userid
                }).then(function(response) {
                    // console.log(response);
                    if(response.data.success==true){
                        alert('존재하는 ID 입니다.');
                    }else{
                        vm.idDupCheckFlag = true; // 중복인증 구분
                        alert('사용가능한 ID 입니다.');
                    }
                });
            }
        },
        pwdInit: function(){
            console.log('pwdInit');
            var vm = this;
            
            if(this.checkForm()){
                if(this.gubun == 1 && this.idDupCheckFlag == false) {
                    alert('ID 중복 확인하세요.');
                }else {
                    axios.post(Config.base_url+'/admin/pwdinit', {
                        "userid" : vm.userinfo.userid
                    }).then(function(response) {
                        // console.log(response);
                        if(response.data.success == true){
                            alert('비밀번호가 초기화 되었습니다.');
                        }else{
                            alert('비밀번호 초기화 오류. 담당자에게 문의 바랍니다.');
                        }
                    });
                }
            }
        },
        pwdChange: function(){
            console.log('pwdChange');
            this.pwdChangeFlag = true;
        },            
        changeTime : function(){
            if(this.userinfo.starttime >= this.userinfo.endtime){
                alert('허용 시간을 다시 설정해주십시오.');
            }else{
                this.conntime= this.userinfo.starttime + "시 ~ "+ this.userinfo.endtime + "시";
            }
            return this.conntime;
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
