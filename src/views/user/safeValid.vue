<template>
  <!--密码找回-->
  <div class="area">
    <div class="user-page">
      <div class="pwd-header">
        {{clientType=='wallet'?$t('common.salfText'):clientType=="BindAccount"&&activeIndex==1?$t('common.bindEmail'):$t('common.bindphone')}}
      </div>
      <div class="tabs" v-if="clientType=='wallet'&& userInfo!=null">
        <template v-if="userInfo.cellphone!=''&&userInfo.email!=''">
          <span :class="['item',activeIndex==1?'active':'']" @click="changeIndex(1)">邮箱验证</span>
          <span :class="['item',activeIndex==2?'active':'']" @click="changeIndex(2)">手机验证</span>
        </template>
      </div>
      <reset-pwd :type="activeIndex" :pageType="clientType" :isLoading.sync="isLoading" @submit="onSubmit"></reset-pwd>
    </div>
  </div>
</template>

<script>
    import ResetPwd from './components/resetPwd'

    export default {
        name: "forgetPassword",
        components: {ResetPwd},
        data() {
            return {
                activeIndex: 1, //类型：1邮箱，2手机
                clientType: '',//wallet:交易密码，log:登录忘记密码，BindAccount:修改绑定
                userInfo: null,
                isDraw: false,
                isLoading: false
            }
        },
        methods: {
            changeIndex(index) {
                this.activeIndex = index

            },
            //获取用户信息
            getUserInfo() {
                let _self = this;
                _self.$get("/userinfo", {}).then(res => {
                    if (res.code == 1) {
                        _self.userInfo = {
                            uid: res.data.user_id,
                            cellphone: res.data.cellphone,
                            email: res.data.email,
                        }

                        this.clientType = this.$route.params.type

                        if (this.userInfo.cellphone == "" && this.userInfo.email != "") {
                            this.activeIndex = 1
                        } else {
                            this.activeIndex = 2
                        }


                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            getUserDraw() {
                let _self = this;
                _self.$get("/wallet/withdrawcheck", {}).then(res => {
                    if (res.code == 1) {
                        _self.isDraw = res.data.is_set_transaction_password == 0 ? false : true
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            onSubmit(opt) {
                //保存交易密码
                let _self = this;

                let code_type = _self.clientType == "wallet" ? 'FORGOTPIN' : _self.clientType == "BindAccount" && _self.activeIndex == 1 ? 'BINDINGEMAIL' : 'BINDINGCELLPHONE'


                if (_self.clientType == "wallet") {
                    _self.$post('/nologon/user/checkverificationcode', {
                        send_type: _self.activeIndex,
                        send_to: _self.activeIndex == 1 ? opt.email : opt.phone,
                        code: opt.validCode,
                        code_type: code_type
                    }).then(res => {
                        if (res.code == 1) {
                            _self.$storage.set('loghistory', {
                                cellphone: opt.phone,
                                email: opt.email,
                                type: _self.activeIndex,
                                code: opt.validCode,
                                client: 'wallet',
                                expires: new Date().getTime()
                            })
                            _self.$router.push({path: `/forget/${_self.type}/reset`})
                        } else {
                            _self.$toastMessage(res.msg)
                        }
                        _self.isLoading=false
                    })
                } else {
                    //保存账户绑定

                    let url = "", params;

                    if (_self.activeIndex == 1) {
                        //邮箱绑定
                        url = "/user/emailbinding"
                        params = {
                            code: opt.validCode,
                            email: opt.email,
                            type: 1,
                        }
                    } else {
                        //手机绑定
                        url = "/user/cellphonebinding"
                        params = {
                            code: opt.validCode,
                            cellphone: opt.phone,
                            type: 1,
                        }
                    }
                    _self.$post(url, params).then(res => {
                        if (res.code == 1) {
                            _self.$toastMessage(_self.$t('common.successful'))
                            setTimeout(() => {
                                _self.$storage.remove('client')
                                _self.$toastMessage.close()
                                _self.$router.replace('/member/security')
                            }, 1000)
                        } else {
                            _self.$toastMessage(res.msg);
                        }
                        _self.isLoading = false
                    })
                }

            },
        },
        created() {
            let etype = JSON.parse(this.$storage.get('client'))
            this.clientType = etype.clientType
            if (this.clientType == "" || this.clientType == "wallet") {
                this.getUserInfo()
                this.getUserDraw()

            } else {
                this.activeIndex = etype.etype
            }

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
</style>
