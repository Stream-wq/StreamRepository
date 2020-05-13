<template>
  <div class="page">
    <div class="area">
      <div class="title-box">{{$t('common.serviceProtol')}}</div>
      <div class="page-content">
        <pre :class="['pre-content',local=='en'?'en':'']">{{content}}</pre>
      </div>
    </div>
  </div>
</template>

<script>
  import service_lang from '../../util/lang/service'
    export default {
        name: "service",
        data() {
            return {
                title: '',
                content: '',
                local:this.$i18n.locale
            }
        },
        created() {
            this.content=this.local=="zh"?service_lang.pageContent_zh:service_lang.pageContent_en
        },
        beforeRouteEnter(to,from,next){
            window.document.body.style.backgroundColor="#ffffff"
            next()
        },
        beforeRouteLeave(to,from,next){
            window.document.body.style.backgroundColor=""
            next()
        }
    }
</script>

<style scoped lang="less">
  @import "treaty";
</style>
