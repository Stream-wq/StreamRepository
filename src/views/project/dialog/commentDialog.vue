<template>
  <div class="form-page">
    <p class="cm-title">{{$t('project.commentLable')}}</p>
    <div class="input-group">
      <input type="text" ref="tagValue" maxlength="38" class="radius-input" @input="onInput" v-model="value" :placeholder="$t('project.byteNumber2')"/>
      <p v-if="errMsg!=''" class="errmsg">{{errMsg}}</p>
    </div>
    <div class="raio">
      <ex-radio class="left" @check="onCheck" :textStyle="textStyle">{{$t('project.agreeDes')}}</ex-radio>
      <router-link tag="a" target="_blank" to="/rules" class="xservice">{{$t('project.agreeDes2')}}</router-link>
    </div>
  </div>
</template>

<script>
    import ExRadio from '@/components/radio/radio'
    export default {
        name: "commentDialog",
        components: {ExRadio},
        props: {
            errMsg: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                textStyle: {
                    fontSize: '14px',
                    color: '#9d9d9d'
                },
                value:''
            }
        },
        methods:{
            onInput(){
                this.$emit("input",this.value.trim())
            },
            onCheck(isCheck){
                this.$emit("check",isCheck)
            }
        }
    }
</script>

<style scoped lang="less">
  .cm-title {
    font-size: 16px;
    color: #9d9d9d;
    margin: 20px 0;
  }

  .radius-input {

  }

  .errmsg {
    margin: 7px 20px 0;
  }
</style>
