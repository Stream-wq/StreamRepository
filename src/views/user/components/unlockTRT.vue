<template>
  <!--解锁TRT-->
  <div class="form-page">
    <p class="count">{{$t('TRT.canlock')}}：{{count}}</p>
    <p class="xm-title">{{$t('TRT.con_title')}}</p>
    <div class="input-group">
      <input type="text" ref="score" class="radius-input" v-model="score"
             :placeholder="$t('TRT.input_placeholder')" @keyup="onInput"
             @pause="score=score.replace(/\D/g,'')"/>
      <p class="errmsg">*{{$t('TRT.tips')}}</p>
    </div>
  </div>
</template>

<script>
    export default {
        name: "unlockTRT",
        props:{
            count:{
                type:Number,
                default:0
            }
        },
        data(){
            return{
                score:''
            }
        },
        methods:{
            onInput(event){
                this.score=this.score.replace(/\D/g,'')

                this.$emit("input",this.score)
            }
        }
    }
</script>

<style scoped>
  .count{
    font-size: 16px;
    color:#333333;
    margin-bottom: 7px;
  }
  .xm-title{
    font-size: 16px;
    color:#9d9d9d;
    margin-bottom: 14px;
  }
  .errmsg {
    color: #9d9d9d;
    margin-top: 5px;
    margin-left: 15px;
  }

  .input-group {
    margin-bottom: 0;
  }
</style>
