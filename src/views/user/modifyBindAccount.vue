<template>
  <!--修改账号绑定-->
  <div class="area">
    <div class="user-page">
      <div class="pwd-header">{{activeIndex==1?$t('common.changeEmail'):$t('common.changePhone')}}</div>
      <!--      <reset-pwd :type="activeIndex" pageType="BindAccount" bindType="modify" :isLoading.sync="isLoading" @submit="onSubmit"></reset-pwd>-->
      <div class="pwd-page">
        <div class="pwd-group" v-if="activeIndex==1">
          <label>{{$t('common.accountName')}}</label>
          <input type="text" class="ret-input" v-model="email" @input="checkForm" autocomplete="new-password"
                 :placeholder="$t('common.newEmailTxt')"/>
        </div>
        <div class="pwd-group" v-else>
          <label>{{$t('common.accountName')}}</label>
          <div class="flex row-pack-justify">
            <div class="country-area" ref="_modify">
              <span class="country-num" @click="onSlide">+{{num.substr(2,num.length)}}</span>
              <search-group :isShow.sync="groupShow" :groupSource="nationalSource" @choose="onChoose"></search-group>
            </div>
            <input type="text" class="ret-input" @input="checkForm" @keyup="phone=phone.replace(/\D/g,'')"
                   @pause="phone=phone.replace(/\D/g,'')" v-model="phone" autocomplete="new-password"
                   :placeholder="$t('common.newPhoneTxt')"/>
          </div>
        </div>
        <div class="pwd-group">
          <label>{{$t('common.verifyCodeTip2')}}</label>
          <input type="text" class="ret-input" v-model="imgCode" @input="checkForm" autocomplete="new-password"
                 :placeholder="$t('common.placeholder1')"/>
          <p class="rightCode"><img class="validcode" :src="codeImg" @click="getImgCode"/></p>
        </div>
        <div class="pwd-group">
          <label>{{activeIndex==1?$t('common.newEmail'):$t('common.newSms')}}</label>
          <input type="text" class="ret-input" autocomplete="new-password" @input="checkForm" v-model="newValidCode"
                 :placeholder="activeIndex==1?$t('common.emailCode'):$t('common.phoneCode')"/>
          <p :class="['c-link',isSending1?'disable':'']" @click="getValidCode(1)">
            {{isSending1?timmer1+'s':$t('common.getVcode')}}</p>
        </div>
        <div class="pwd-group">
          <label>{{activeIndex==1?$t('common.validEmail'):$t('common.validSMS')}}</label>
          <input type="text" class="ret-input" autocomplete="new-password" @input="checkForm" v-model="validCode"
                 :placeholder="activeIndex==1?$t('common.placeholder2'):$t('common.placeholder3')"/>
          <p :class="['c-link',isSending2?'disable':'']" @click="getValidCode(2)">
            {{isSending2?timmer2+'s':$t('common.getVcode')}}</p>
        </div>
        <div class="pwd-group error">
          <p class="errmsg" v-if="errMsg!=''">{{errMsg}}</p>
        </div>
        <div class="pwd-group">
          <el-button :class="['pwd-button',isEmp?'disable':'']" :loading="isLoading" @click="onSubmit">
            {{$t('common.saveTxt')}}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    // import ResetPwd from './components/resetPwd'
    import SearchGroup from '@/components/searchGroup/searchGroup'

    export default {
        name: "modifyBindAccount",
        components: {SearchGroup},
        data() {
            return {
                activeIndex: 1, //类型：1邮箱，2手机
                codeImg: '',
                isSending1: false,
                isSending2: false,
                isLoading: false,
                timmer1: 60,
                timmer2: 60,
                isEmp: true,
                userInfo: {},
                groupShow: false,
                errMsg: '',
                num: '0086',
                email: '',
                phone: '',
                imgCode: '',
                validCode: '',
                newValidCode: ''
            }
        },
        computed: {
            nationalSource: function () {
                if (this.$store.state.nationalNum.length <= 0) {
                    this.$store.dispatch('getNationalSource')
                }
                return this.$store.state.nationalNum
            },
        },
        methods: {
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
            //选择区号
            onChoose(val) {
                this.num = val.areaCode
            },
            onSlide() {
                this.groupShow = this.groupShow ? false : true
                this.$refs['_modify'].id="groupPage"
            },
            checkForm() {
                if (this.activeIndex == 1) {
                    if (this.email.trim() != "" && this.imgCode.trim() != "" && this.validCode.trim() != "" && this.newValidCode.trim() != "") this.isEmp = false
                    else this.isEmp = true
                } else {
                    if (this.phone.trim() != "" && this.imgCode.trim() != "" && this.validCode.trim() != "" && this.newValidCode.trim() != "") this.isEmp = false
                    else this.isEmp = true
                }
            },
            validate(type) {
                let _self = this;
                if (type == 1) {
                    if (_self.activeIndex == 1) {
                        _self.errMsg = _self.$valid.txtEmp(_self.email, _self.$t('common.newEmailTxt'))
                        if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") return false;
                        _self.errMsg = _self.$valid.email(_self.email, _self.$t('common.emailTip'))
                        if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") return false;
                    } else {
                        _self.errMsg = _self.$valid.txtEmp(_self.phone, _self.$t('common.newPhoneTxt'))
                        if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") return false;
                    }
                }
                _self.errMsg = _self.$valid.txtEmp(_self.imgCode, _self.$t('common.captchaTips'))
                if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") return false;
                else return true
            },
            getImgCode() {
                let _self = this;
                _self.codeImg = '/bcbuyerapihttp/nologon/user/imgcode?type_id=1' + '&' + new Date().getTime()
            },
            timeDown(type) {
                let self = this;
                let result = setInterval(() => {
                    if (type == 1) {//type=1新账号；type=2旧账号
                        --self.timmer1;
                        if (self.timmer1 < 0) {
                            clearInterval(result);
                            self.isSending1 = false;
                            self.timmer1 = 60;
                        }
                    } else {
                        --self.timmer2;
                        if (self.timmer2 < 0) {
                            clearInterval(result);
                            self.isSending2 = false;
                            self.timmer2 = 60;
                        }
                    }

                }, 1000);
            },
            getValidCode(type) {
                let account = "", _self = this, codeType = '';

                if (!_self.validate(type)) return

                if (type == 2) {
                    if (_self.activeIndex == 1) {
                        account = _self.userInfo.email.trim()
                        codeType = "VERIFICATIONEMAIL"
                    } else {
                        account = _self.userInfo.cellphone.trim()
                        codeType = "VERIFICATIONCELLPHONE"
                    }
                } else {
                    if (_self.activeIndex == 1) {
                        account = _self.email.trim()
                        codeType = "BINDINGEMAIL"
                    } else {
                        account = _self.num + _self.phone.trim()
                        codeType = "BINDINGCELLPHONE"
                    }
                }


                _self.$post('/nologon/user/verificationcode', {
                    code: _self.imgCode,
                    code_type: codeType,
                    send_to: account,
                    send_type: _self.activeIndex
                }).then(res => {
                    if (res.code == 1) {
                        if (type == 1) {
                            _self.isSending1 = true;
                        } else {
                            _self.isSending2 = true
                        }
                        _self.timeDown(type)
                    } else {
                        _self.errMsg = res.msg
                    }
                })

            },
            onSubmit() {
                let _self = this;

                if (_self.isEmp) return

                _self.isLoading = true

                let url = "", params;

                if (_self.activeIndex == 1) {
                    //邮箱绑定
                    url = "/user/emailbinding"
                    params = {
                        code: _self.newValidCode,
                        old_code: _self.validCode,
                        email: _self.email,
                        old_email: _self.userInfo.email,
                        type: 2,
                    }
                } else {
                    //手机绑定
                    url = "/user/cellphonebinding"
                    params = {
                        code: _self.newValidCode,
                        old_code: _self.validCode,
                        cellphone: _self.num + _self.phone,
                        old_cellphone: _self.userInfo.cellphone,
                        type: 2,
                    }
                }
                _self.$post(url, params).then(res => {
                    if (res.code == 1) {

                        _self.$toastMessage(_self.$t('common.successful'))

                        _self.$storage.remove("userInfo");

                        let timer = setTimeout(() => {
                            _self.$toastMessage.close()
                            _self.$router.push('/home')
                            _self.$bus.$emit("uInfo", null);

                        }, 1000)
                    } else {
                        _self.$toastMessage(res.msg);
                    }
                    _self.isLoading = false
                })
            }
        },
        created() {
            this.getImgCode()

            this.getUserInfo()

            this.activeIndex = this.$route.params.type == "email" ? 1 : 2
        },
        beforeRouteEnter(to, from, next) {
            window.document.body.style.backgroundColor = "#ffffff"
            next()
        },
        beforeRouteLeave(to, from, next) {
            window.document.body.style.backgroundColor = ""
            next()
        },
    }
</script>

<style scoped lang="less">
  @import "user";
  @import "./components/form";
</style>
