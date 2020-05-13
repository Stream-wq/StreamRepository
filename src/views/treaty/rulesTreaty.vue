<template>
  <div class="page">
    <div class="area">
      <div class="title-box">{{$t('common.rulesProtol')}}</div>
      <div class="page-content">
        <pre :class="['pre-content',local=='en'?'en':'']">{{content}}</pre>
      </div>
    </div>
  </div>
</template>

<script>
    import service_lang from '../../util/lang/rules'
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
            this.content=this.local=="zh"?service_lang.rules_zh:service_lang.rules_en
        },
        beforeRouteEnter(to,from,next){
            window.document.body.style.backgroundColor="#f2f2f2"
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
