<template>
  <!--常见问题-->
  <div class="area">
    <div class="user-page">
      <div class="pwd-header">{{$t('nav.questions')}}</div>
      <div class="ques-list">
        <div class="ques-item" v-for="item in quesList.questionsList">
          <p class="title">{{item.question}}</p>
          <div class="content" v-for="content in item.answer">{{content}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import Question from '../../util/lang/question'

    export default {
        name: "question",
        data() {
            return {
                quesList: [],
                local: this.$i18n.locale
            }
        },
        beforeRouteEnter(to, from, next) {
            window.document.body.style.backgroundColor = "#ffffff"
            next()
        },
        beforeRouteLeave(to, from, next) {
            window.document.body.style.backgroundColor = ""
            next()
        },
        created() {
            this.quesList = this.local == "en" ? Question.en : Question.zh
        }
    }
</script>

<style scoped lang="less">
  @import "../user/user";
</style>
