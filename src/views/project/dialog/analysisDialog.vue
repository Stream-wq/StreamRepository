<template>
  <div class="ana-page">
    <div class="input-group">
      <textarea ref="areaValue" v-model="areaValue" :placeholder="$t('project.byteNumber')" class="input-area"
                :maxlength="locale=='en'?20000:10000" @input="onInput"></textarea>
      <p v-if="errMsg!=''" class="errmsg">{{errMsg}}</p>
    </div>
    <div class="raio">
      <ex-radio class="left" :isCheck="isCheck" @check="onCheck" :textStyle="textStyle">{{$t('project.agreeDes')}}</ex-radio>
      <router-link tag="a" target="_blank" to="/rules" class="xservice">{{$t('project.agreeDes2')}}</router-link>
    </div>
    <p class="cm-title">{{$t('project.videoLink')}}</p>
    <div class="input-group">
      <input type="text" ref="url" maxlength="200" v-model="url" class="radius-input"
             :placeholder="$t('project.videoLinkPlaceholder')"/>
    </div>
  </div>
</template>

<script>
    import ExRadio from '@/components/radio/radio'

    export default {
        name: "analysisDialog",
        components: {ExRadio},
        props: {
            errMsg: {
                type: String,
                default: ''
            },
            params: {
                type: Object,
                default: null
            },
            isEmp: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                locale: this.$i18n.locale,
                textStyle: {
                    fontSize: '14px',
                    color: '#9d9d9d'
                },
                url: this.params ? this.params.url.trim() : "",
                areaValue: this.params ? this.params.areaValue.trim() : '',
                isCheck:this.params.areaValue?true:false
            }
        },
        methods: {
            validForm() {
                if (this.areaValue.trim() == "" || !this.isCheck) this.$emit("update:isEmp",true)
                else this.$emit("update:isEmp",false)
            },
            onInput() {
                this.validForm()
            },
            onCheck(isCheck) {
                this.isCheck=isCheck
                this.validForm()
            }
        }
    }
</script>

<style scoped lang="less">
  .input-area {
    height: 340px;
  }

  .cm-title {
    font-size: 16px;
    color: #9d9d9d;
    margin: 14px 0;
  }

</style>
