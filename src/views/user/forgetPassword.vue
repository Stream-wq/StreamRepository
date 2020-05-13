<template>
  <!--密码找回-->
  <div class="area">
    <div class="user-page">
      <div class="pwd-header">{{$t('common.forgetPassword')}}（{{rsType==1?$t('common.recoverdEmail'):$t('common.recoverdSMS')}}）</div>

      <reset-pwd :type="rsType" @submit="onSubmit"></reset-pwd>
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
                rsType: 1, //类型：1邮箱，2手机
                // clientType:'log'//当前操作类型：wallet:交易密码，log:登录忘记密码，modify:修改绑定
            }
        },
        methods: {
            onSubmit(opt) {
                let _self = this;
                _self.$post('/nologon/user/checkverificationcode', {
                    send_type: _self.rsType,
                    send_to: _self.rsType == 1 ? opt.email : opt.phone,
                    code: opt.validCode,
                    code_type: 'FORGOTPWD'
                }).then(res => {
                    if (res.code == 1) {
                        _self.$storage.set('loghistory', {
                            cellphone: opt.phone,
                            email: opt.email,
                            type: _self.rsType,
                            code:opt.validCode,
                            client:'log',
                            expires:new Date().getTime()//过期时间十分钟
                        })
                        _self.$router.push({path: `/forget/${_self.$route.params.type}/reset`})
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            }
        },
        created() {
            let params = this.$route.params.type;
            this.rsType = params == 'email' ? 1 : 2


            // this.clientType=this.$storage.get('client')
        },
        beforeRouteEnter(to, from, next) {
            window.document.body.style.backgroundColor = "#ffffff"
            next()
        },
        beforeRouteLeave(to, from, next) {
            window.document.body.style.backgroundColor = ""
            next()
        },
        beforeCreate() {
            this.$bus.$on('type',data=>{
                this.rsType=data=="email"?1:2
            })
        }
    }
</script>
<style scoped lang="less">
  @import "user";
</style>
