<template>
  <!--重置密码-->
  <div class="area">
    <div class="user-page">
      <div class="pwd-header">{{$t('common.resetPSW')}}</div>
      <div class="pwd-page">
        <div class="pwd-group">
          <label>{{$t('common.setNewPwd')}}</label>
          <input type="password" class="ret-input" autocomplete="new-password" maxlength="18" v-model="pwd" @input="checkForm"
                 :placeholder="$t('common.passwordTip')"/>
        </div>
        <div class="pwd-group error">
          <p class="errmsg gray">{{$t('common.passWordTipsText')}}</p>
        </div>
        <div class="pwd-group">
          <el-button :class="['pwd-button',isEmp?'disable':'']" :loading="isLoading" @click="resetPwd">
            {{$t('common.submitTxt')}}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "resetPassword",
        data() {
            return {
                isLoading: false,
                isEmp: true,
                pwd: '',
                clientOptions:null
            }
        },
        methods: {
            checkForm() {
                if (this.pwd.trim()=="") this.isEmp = true
                else
                    this.isEmp = false
            },
            resetPwd() {
              let _self=this;
              if (_self.isEmp) return


                _self.isLoading=true
                if(_self.clientOptions.client=="log"){
                    //重置登录密码
                    _self.$post('/userpassport/forgotpwd',{
                        cellphone:_self.clientOptions.type==1?'':_self.clientOptions.cellphone.trim(),
                        email:_self.clientOptions.type==2?'':_self.clientOptions.email.trim(),
                        code:_self.clientOptions.code,
                        new_pwd:_self.pwd
                    }).then(res=>{
                        if(res.code==1){

                            _self.$toastMessage(_self.$t('common.resetPwd'))
                            setTimeout(()=>{
                                _self.$storage.remove('loghistory')
                                _self.$toastMessage.close()
                                _self.$router.replace('/')
                            },1000)
                        }else{
                            _self.$toastMessage(res.msg)
                        }
                        _self.isLoading=false
                    })
                }else{
                    //重置交易密码
                    _self.$post('/userpassport/forgotpinpwd',{
                        cellphone:_self.clientOptions.type==1?'':_self.clientOptions.cellphone.trim(),
                        email:_self.clientOptions.type==2?'':_self.clientOptions.email.trim(),
                        code:_self.clientOptions.code,
                        new_pwd:_self.pwd
                    }).then(res=>{
                        if(res.code==1){

                            _self.$toastMessage(_self.$t('common.resetPwd'))
                            setTimeout(()=>{
                                _self.$storage.remove('loghistory')

                                _self.$storage.remove('client')

                                _self.$toastMessage.close()
                                _self.$router.replace('/member/security')
                            },1000)
                        }else{
                            _self.$toastMessage(res.msg)
                        }
                        _self.isLoading=false
                    })
                }

            }
        },
        created() {
            this.clientOptions=JSON.parse(this.$storage.get('loghistory'))
        },
        beforeRouteEnter(to, from, next) {
            window.document.body.style.backgroundColor = "#ffffff"
            next()
        },
        beforeRouteLeave(to, from, next) {
            window.document.body.style.backgroundColor = ""
            next()
        }
    }
</script>
<style scoped lang="less">
  @import "user";
  @import "./components/form";
</style>
