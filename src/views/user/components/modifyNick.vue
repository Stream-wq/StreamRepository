<template>
  <!--修改昵称-->
  <div class="form-page">
    <div class="input-group">
      <input type="text" ref="nickname" maxlength="16" class="radius-input" v-model="nickname" :placeholder="placeholder"/>
      <p class="errmsg">*{{$t('common.placeholder')}}</p>
    </div>
  </div>
</template>

<script>
    export default {
        name: "modifyNick",
        props: {
            placeholder: {
                type: String,
                default: ""
            }
        },
        data() {
            return{
                nickname:''
            }
        }
    }
</script>

<style scoped>
  .errmsg {
    color: #9d9d9d;
    margin-top: 5px;
    margin-left: 15px;
  }

  .input-group {
    margin-bottom: 0;
  }
</style>
