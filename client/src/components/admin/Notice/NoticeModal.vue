<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3 v-if="gubun == 1"><i class="fa fa-clipboard-list"></i> 공지사항등록</h3>
                        <h3 v-else><i class="fa fa-clipboard-check"></i> 공지사항수정</h3>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal" role="form">
                            <div class="form-group row">
                                <label class="col-md-1 control-label">작성자</label>
                                <div class="col-md-6">
                                    <input type="text" class="form-control" v-model="storyinfo.writer" id="writer" readonly="readonly">
                                </div>
                                <div class="checkbox checkbox-primary col-md-3">
                                    <input type="checkbox" class="checkbox" v-model="storyinfo.notice" id="notice">
                                    <label for="notice" class="control-label checkboxlabel_mod" > 공지사항</label>
                                </div>
							</div>
							<div class="form-group row">
                                <label class="col-md-1 control-label">제목</label>
                                <div class="col-md-11">
                                    <input type="text" class="form-control" v-model="storyinfo.title" id="title">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-1 control-label">본문</label>
                                <div class="col-md-11" style="overflow:auto">
                                    <VueEditor id="editor1" v-model="storyinfo.contents"></VueEditor>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <div v-if="gubun===1" class="tar">
                            <button type="submit" class="btn btn-basic" @click="insertStory">등록</button>
                        </div>
                        <div v-else class="tar">
                            <button type="submit" class="btn btn-basic" @click="updateStory">수정</button>
                            <button type="submit" class="btn btn-basic" @click="deleteStory">삭제</button>
                        </div>
							<button type="submit" class="btn btn-cancel" @click="closeStory">취소</button>
							<!-- ?<label class="col-md-2 control-label">조회수:{{storyinfo.view+1}}</label> -->
					</div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { VueEditor } from 'vue2-editor'

export default {
    props: ["storyinfo", "gubun"],
    components: {
        VueEditor : VueEditor
    },
    data: function() {
        return {
        };
    },
    mounted: function() {
            this.storyinfo.writer = this.$store.state.user.username ;
    },
    methods: {
        insertStory: function() {
            // this.storyinfo.writer = this.$store.state.user.username ;
            this.$EventBus.$emit("insertStory", this.storyinfo);
        },
        updateStory: function() {
            // this.storyinfo.writer = this.$store.state.user.username ;
            this.$EventBus.$emit("updateStory", this.storyinfo);
        },
        deleteStory: function() {
            this.$EventBus.$emit("deleteStory", this.storyinfo);
        },
        closeStory: function() {
            this.$EventBus.$emit("closeStory", this.storyinfo);
        }
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
    transition: opacity .3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    width:65%;
    margin: 0px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
}

.modal-header {margin-top: 0;padding:10px 0 5px 0;color: #486bdf;border-bottom:2px solid #111;}
.modal-header h3 i::before {color:#2877c7;}
.tar {text-align:right;}
.btn-basic {background:#2877c7;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-basic:hover {background:#145392;}
.btn-cancel {background:#8c9dad;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-cancel:hover {background:#66737e;}

.modal-body {
    max-height: 700px;
    overflow-y:auto;
}
.modal-body .form-group {border-bottom:1px solid #e5e5e5;padding-bottom:15px;}
.form-control {border-radius: 2px;}

.modal-footer {border-top:1px solid #111;}
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

/* .label_mod{
    padding-right: 0px; 
    margin-right: 18px;
    padding-top: 5px;
} */
.control-label {margin:0;padding: 5px 0 0 5px;color:#111;font-size:1.125rem}
.writer_mod{
    width: 30%;
}
.checkboxlabel_mod{
    /* margin-top: 5px;
    margin-left: 30px; */
}
.checkbox{
    /*transform: scale(1.1);
     margin-left: 30px; */
    padding-top: 0px;
}
.notice-label{
    padding-left : 40px;
    padding-top  : 5px;
}

.checkbox label {
    display: inline-block;
    vertical-align: middle;
    position: relative;
    padding-left: 5px;
}

.checkbox label::before {
    content: "";
    display: inline-block;
    position: absolute;
    width: 25px;
    height: 25px;
    left: 0;
    margin-left: -30px;
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
    width: 25px;
    height: 25px;
    left: 0;
    top: 0;
    margin-left: -28px;
    padding-left: 3px;
    padding-top: 1px;
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
    padding-left: 5px;
    padding-top: 10px;
}
</style>
