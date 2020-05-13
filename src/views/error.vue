<template>
    <!--404-->
  <div class="err-page">
    <div class="content">
      <img src="@/assets/notfound.png"/>
      <router-link to="/" class="link" replace>{{txt}}</router-link>
    </div>
  </div>
</template>

<script>
  import {getCookie} from "../util/cookie";

  export default {
        name: "error",
        data(){
            return{
                local:this.$i18n.locale
            }
        },
        computed:{
            txt:function () {
                let local = document.cookie == "" ? "zh" : getCookie('local') == "" ? 'zh' : getCookie("local")
                return local=="en"?'Home':'返回首页'
            }
        }
    }
</script>

<style scoped lang="less">
.err-page{
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
  .link{
    display: block;
    width: 88px;
    height: 32px;
    border: 1px solid #fff;
    color:#fff;
    line-height: 32px;
    font-size: 14px;
    text-align: center;
    margin: 38px auto 0;
  }
</style>
