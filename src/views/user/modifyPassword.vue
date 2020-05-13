<template>
  <!--修改登录/交易密码-->
  <div class="area">
    <div class="user-page">
      <div class="pwd-header">{{type=='log'?$t('common.udlgpwTitle'):$t('common.payMentListText1')}}</div>
      <div class="pwd-page">
        <div class="pwd-group">
          <label>{{$t('common.oldPwdTxt')}}</label>
          <input type="password" v-model="oldPwd" autocomplete="new-password" @input="onCheckForm" class="ret-input"
                 :placeholder="$t('common.passwordTip')" maxlength="18"/>
        </div>
        <div class="pwd-group">
          <label>{{$t('common.newPwdTxt')}}</label>
          <input type="password" v-model="newPwd" class="ret-input" @input="onCheckForm" autocomplete="new-password"
                 :placeholder="$t('common.passwordTip')" maxlength="18"/>
        </div>
        <div class="pwd-group error">
          <p class="errmsg gray">{{$t('common.passWordTipsText')}}</p>
        </div>
        <div class="pwd-group error">
          <p v-if="errMsg!=''" class="errmsg">{{errMsg}}</p>
        </div>
        <div class="pwd-group">
          <el-button :class="['pwd-button',isEmp?'disable':'']" :loading="isLoading" @click="setPassword">
            {{$t('common.saveTxt')}}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "modifyPassword",
        data() {
            return {
                userInfo: null,
                isLoading: false,
                isEmp: true,
                oldPwd: '',
                newPwd: '',
                errMsg: '',
                type: ''
            }
        },
        methods: {
            onCheckForm() {
                if (this.oldPwd.trim() == "" || this.newPwd.trim() == "") this.isEmp = true
                else this.isEmp = false
            },
            setPassword() {
                let _self = this;
                if (_self.isEmp) return
                _self.isLoading = true
                if (_self.type == "log") {
                    _self.$post('/userpassport/updatepwd', {
                        old_pwd: _self.oldPwd,
                        new_pwd: _self.newPwd
                    }).then(res => {
                        if (res.code == 1) {
                            _self.$toastMessage(_self.$t('common.successful'))
                            _self.$get("/logonout", {}).then(res => {
                                if (res.code == 1) {
                                    _self.$storage.remove("userInfo");
                                    _self.$toastMessage.close()
                                    let timer = setTimeout(() => {
                                        _self.$router.push('/home')
                                        _self.$bus.$emit("uInfo", null);

                                    }, 1000)

                                } else {
                                    _self.$toastMessage(res.msg)
                                }
                            })
                        } else {
                            _self.$toastMessage(res.msg)
                        }
                        _self.isLoading = false
                    })
                } else {
                    _self.$post('/userpassport/updatetransactionpwd', {
                        new_transaction_password: _self.newPwd,
                        old_transaction_password: _self.oldPwd
                    }).then(res => {
                        if (res.code == 1) {
                            _self.$toastMessage(_self.$t('common.successful'))

                            setTimeout(()=>{
                                _self.$toastMessage.close()
                                _self.$router.push('/member/security')
                            },1000)
                        } else {
                            _self.$toastMessage(res.msg)
                        }
                        _self.isLoading = false
                    })
                }


            }
        },
        created() {
            this.type = this.$route.params.type
        },
        beforeDestroy() {
            this.$bus.$off("uInfo")
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
