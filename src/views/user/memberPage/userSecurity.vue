<template>
  <!--安全设置-->
  <div class="member-page">
    <h2 class="tagTitle">{{$t('common.secrity')}}</h2>
    <ul class="page-list">
      <li>
        <p class="title">{{$t('common.passwordTip2')}}</p>
        <router-link :to="`/modify/log`" class="link">{{$t('common.change')}}</router-link>
      </li>
      <li>
        <p class="title">{{$t('common.PIN')}}</p>
        <router-link v-if="!isDraw" to="/salepwd" class="link">{{$t('common.set')}}</router-link>
        <div class="link-box" v-else>
          <router-link to="/modify/wallet" class="link">{{$t('common.change')}}</router-link>
          <em></em>
          <span @click="toSetPassword('wallet')" class="link">{{$t('common.ForgottenPIN')}}</span>
        </div>
      </li>
      <li>
        <p class="title">{{$t('common.phoneButton')}}</p>
        <span @click="toSetPassword('BindAccount',2)" class="link" v-if="userInfo.cellphone==''">{{$t('common.bind')}}
        </span>
        <router-link to="/modifybind/phone"  class="link" v-else>{{$t('common.change')}}</router-link>
      </li>
      <li>
        <p class="title">{{$t('common.emailButton')}}</p>
        <span @click="toSetPassword('BindAccount',1)" class="link" v-if="userInfo.email==''">{{$t('common.bind')}}</span>
        <router-link to="/modifybind/email"  class="link" v-else>{{$t('common.change')}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
    export default {
        name: "userSecurity",
        data() {
            return {
                userInfo: {},
                isDraw: false
            }
        },
        methods: {
            toSetPassword(clientType, type) {
                this.$storage.set('client', {
                    etype: type,
                    clientType: clientType,
                    expires: new Date().getTime()
                })
                this.$router.push(`/verify/${clientType}`)
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
            toResetPwd() {
                // this.$bus.$emit("uInfo", this.userInfo)

                this.$router.push('/modify')
            }
        },
        created() {
            this.getUserInfo()
            this.getUserDraw()
        },
        beforeDestroy() {
            //   this.$bus.$emit("uInfo", this.userInfo)
        }
    }
</script>

<style scoped lang="less">
  @import "../user";
</style>
