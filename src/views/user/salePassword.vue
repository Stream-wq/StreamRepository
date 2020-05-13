<template>
  <!--设置交易密码-->
  <div class="area">
    <div class="user-page">
      <div class="pwd-header">{{$t('common.payMentListText3')}}</div>
      <div class="pwd-page">
        <div class="pwd-group">
          <label>{{$t('common.PIN')}}</label>
          <input type="password" v-model="oldPwd" autocomplete="new-password" @input="onCheckForm" class="ret-input"
                 :placeholder="$t('common.passwordTip')" maxlength="18"/>
        </div>
        <div class="pwd-group">
          <label>{{$t('common.confirm')}}</label>
          <input type="password" v-model="newPwd" class="ret-input" @input="onCheckForm" autocomplete="new-password"
                 :placeholder="$t('common.reEnter')" maxlength="18"/>
        </div>
        <div class="pwd-group error">
          <p class="errmsg gray">{{$t('common.passWordTipsText')}}</p>
        </div>
        <div class="pwd-group error">
          <p v-if="errMsg!=''" class="errmsg ">{{$t('common.inconsistent')}}</p>
        </div>
        <div class="pwd-group">
          <el-button :class="['pwd-button',isEmp?'disable':'']" :loading="isLoading" @click="setPwd">
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
                isLoading: false,
                isEmp: true,
                oldPwd: '',
                newPwd: '',
                errMsg: '',
            }
        },
        methods: {
            onCheckForm() {
                if (this.oldPwd.trim() == "" || this.newPwd.trim() == "") this.isEmp = true
                else this.isEmp = false
            },
            setPwd() {
                let _self = this;
                if (_self.isEmp) return
                if (_self.oldPwd != _self.newPwd) {
                    _self.errMsg = _self.$t('inconsistent')
                    return;
                }
                _self.isLoading = true
                _self.$post('/userpassport/settransactionpwd', {
                    new_transaction_password: _self.newPwd,
                }).then(res => {
                    if (res.code == 1) {
                        _self.$toastMessage(_self.$t('common.successful'))
                        setTimeout(() => {
                            _self.$toastMessage.close()
                            _self.$router.push('/member/security')
                        }, 1000)


                    } else {
                        _self.$toastMessage(res.msg)
                    }
                    _self.isLoading = false
                })
            },
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
