<template>
    <div class="specinfo">
        <span v-html="sInfo.contents"></span>
    </div>
</template>

<script>
import Config      from "./../../../js/config.js"

export default {
    props: [],
    data() {
        return {
            sInfo: {},
            specInfo : "",
            comp_no : 0,
        };
    },
    mounted: function() {
        this.getUserSpecInfo();
    },
    methods: {
        getUserSpecInfo: function() {
            var vm = this;
            // vm.specInfo = "<p>보안관제 특이사항</p><p><span style=\"color: rgb(230, 0, 0);\">2018.09.17  19:25   : 회원사 스 위치 교체작업으로 인한 eth15 인터페이스 다운 발생</span></p><p><span style=\"color: rgb(230, 0, 0);\">2018.09.12  01:05   : IDC 이전 작업으로 인한 방화벽 다운 발생</span></p>"
            // this.specInfo = "";
            vm.comp_no = this.$store.state.user.comp_no;

            axios.get(Config.base_url+'/user/getuserspecinfo', {
                params: {
                    "bbs_id" : 2,
                    "comp_no": vm.comp_no,
                    "notice": true,
                }
            }).then(function(response) {
                // console.log(response);
                if(response.data.success == false){
                    // alert("해당 게시글이 없습니다");
                }else {
                    vm.sInfo = response.data.specinfo[0] ;
                    //console.log("spec::" + JSON.stringify(vm.sInfo[0]));
                }
            });

        }
    }
}
</script>

<style scoped>
.specinfo {
    border-style: double;
}
</style>
