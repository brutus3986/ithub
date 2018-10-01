<template>
    <main>
        <div class="container">
            <form novalidate @submit.stop.prevent>
                <div class="form-inline">
                    <div class="form-group col-md-4">
                        <label for="sdate" class="col-md-4 col-form-label">시작일자</label>
                         <div class="col-md-8">
                            <input type="date" v-model="sdate" id="sdate" class="form-control indatemod">
                        </div>
                    </div>
                    <div class="form-group col-md-6">
                        <label for="edate" class="col-md-4 col-form-label">종료일자</label>
                         <div class="col-md-8">
                            <input type="date" v-model="edate" id="edate" class="form-control indatemod">
                        </div>
                    </div>
                </div>
                 <div class="form-group tar">
					<button type="submit" @click="fetchChartListMonth" class="btn btn-basic col-md-2">조회</button>
					<button type="submit" @click="downloadFileMonth" class="btn btn-basic col-md-2">전체다운로드</button>
				</div>    
            </form>
            <div class="logo">
                <i class="fas fa-align-justify"></i><span> {{ comp_name }} 보안 관제 월간 보고서</span>
                <br>
                <br>
            </div>
            <ul class="list-group">
                <li v-for="clist in chartlist" v-bind:key="clist.index" class="list-group-item" style="text-align:left;">
                    <a v-bind:href="clist.fullsrc">{{clist.fname}}</a>
                </li>
            </ul>
        </div>
    </main>
</template>
<script>
import Config  from "./../../../js/config.js"
export default {
    props: [],
    data() {
        return {
            sdate: "",
            edate: "",
            comp_no: 0,
            comp_name: "",
            chartlist: [],
        };
    },
    components: {
        
    },
    created: function () {
        this.comp_no = this.$store.state.user.comp_no;
        this.comp_name = this.$store.state.user.comp_name;
    },
    computed : {

    },
    mounted: function () {
        this.getTodayDate() ;
    },
    methods: {
        getTodayDate: function() {
            var dt = new Date();
            var td_year = dt.getFullYear() ;
            var td_month = dt.getMonth() + 1 ;
            var td_date = dt.getDate() ;
            if(td_month < 10) td_month = "0" + td_month ;
            if(td_date < 10) td_date = "0" + td_date ;
            this.sdate = td_year + "-" + td_month + "-" + td_date ;
            this.edate = this.sdate ;
        },
        clearForm: function(){
            console.log("clearForm");
            this.chartlist=[];
        },
        fetchChartListMonth: function () {
            var vm = this;

            console.log("fetchChartListMonth");
            console.log("comp_no : [" + this.$store.state.user.comp_no + "]");
            axios.post(Config.base_url+'/admin/chart/chartlistmonth',{
                "sdate" : this.sdate,
                "edate": this.edate,
                "comp_no": this.comp_no,
            }).then(function (response) {
                var success = response.data.success ;
                if(success) {
                    var tlist = response.data.clist;
                    tlist.forEach(function(clist,index) {
                        clist.fullsrc = Config.base_url + clist.fullsrc;
                    });
                    vm.chartlist = tlist;
                }else {
                    alert(response.data.message);
                    vm.clearForm();
                }
            });
        },
        downloadFileMonth: function () {
            console.log("downloadFileMonth");
            var vm = this;
            // this.grpgubun = this.$store.state.user.grpgubun ;

            axios.post(Config.base_url+'/admin/chart/downloadfilemonth',{
                "sdate": this.sdate,
                "edate": this.edate,
                "comp_no": this.comp_no,
            }).then(function (response) {
                var success = response.data.success ;
                var filename = response.data.filename ;
                if(success) {
                    var aUrl = Config.base_url + "/public/download/" + filename;
                    // vue component 에서 window.open 인식못함
                    // 강제 link click() 이벤트 생성 - ThreeOn 2018.05.24
                    // window.open(Config.base_url+"/public/download/" + filename);
                    var link = document.createElement("a");
                    link.href = aUrl;
                    link.innerHTML = aUrl;
                    link.click();
                    // console.log("link open : " + link.innerHTML);
                }else {
                    alert(response.data.message);
                }
            });
        },
    }
}
</script>
<style scoped>
.form-group{
    margin-bottom: 15px;
}
.form-control {border-radius: 2px;}
.form-inline {padding:0;background:#f9f9f9;}
.form-inline:first-child {padding-top:20px;border-top:1px solid #dcdcdc;}
.form-inline label {color:#111;font-size:1.125rem;}
.logo {color:#111;font-size:1.125rem;}
.btn{
    margin-left: 5px;
    /* 원래450px; */
}
.indatemod{width:185px;}
.pyogiselmod{width:185px;}
.largeselmod{width:185px;}
.midselmod{width:185px;}
.userselmod{width:185px;}
.btn-small {background:#8c9dad;color:#FFF;font-size:1rem;padding:2px 8px;}
.btn-small:hover {background:#7ea1c5;}
.tal {text-align:left;}
.tar {text-align:right;}
.mt20 {margin-top:20px;}
.mb20 {margin-bottom:20px;}
.btn-basic {background:#2877c7;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-basic:hover {background:#145392;}
.btn-cancel {background:#8c9dad;color:#FFF;font-size:1.0625rem;padding:6px 16px 7px;}
.btn-cancel:hover {background:#66737e;}
.tar::before {content:"";display:block;width:100%;height:15px;border-top:1px solid #dcdcdc;}
</style>