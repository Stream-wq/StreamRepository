<template>
  <div class="register-page">
    <div class="tabs-nav">
      <span class="label" :class="activeIndex==1?'active':''"
            @click="changeIndex(1)">{{$t('common.emailRegister')}}</span>
      <span class="label" :class="activeIndex==2?'active':''"
            @click="changeIndex(2)">{{$t('common.phoneRegister')}}</span>
    </div>
    <div class="form-page">
      <div class="page-item">
        <div class="group" v-if="activeIndex==1">
          <input type="text" v-model="email" autocomplete="new-password" class="input" @keyup.enter="onRegister"
                 :placeholder="$t('common.emailTip2')"
                 @input="onEmailFormValid"/>
        </div>
        <div class="group xarea" v-if="activeIndex==2">
          <div class="country-area" ref="_register">
            <span class="country-num" @click="onSlide">+{{num.substr(2,num.length)}}</span>
            <search-group :isShow.sync="groupShow" :groupSource="nationalSource" @choose="onChoose"></search-group>
          </div>
          <input type="phone" autocomplete="new-password" v-model="phone" class="input"
                 :placeholder="$t('common.phoneTip')" @keyup.enter="onRegister"
                 @input="onEmailFormValid" @keyup="phone=phone.replace(/\D/g,'')"
                 @pause="phone=phone.replace(/\D/g,'')"/>
        </div>
        <div class="group code">
          <input type="text" v-model="imgCodeNum" @input="onEmailFormValid" autocomplete="new-password" class="input"
                 maxlength="4" @keyup.enter="onRegister"
                 :placeholder="$t('common.placeholder1')"/>
          <p class="rightCode"><img class="validcode" :src="codeImg" @click="getImgCode"/></p>
        </div>
        <div class="group code">
          <input type="text" v-model="validCode" @input="onEmailFormValid" autocomplete="new-password" class="input"
                 maxlength="6" @keyup.enter="onRegister"
                 :placeholder="activeIndex==1?$t('common.placeholder2'):$t('common.placeholder3')"/>
          <p class="rightCode"><span :class="['codelink',isSending?'disable':'']" @click="sendValidCode">{{isSending?timmer+'s':$t('common.getVcode')}}</span>
          </p>
        </div>
        <div class="group pwd">
          <input :type="type" autocomplete="new-password" v-model="pwd" class="input"
                 :placeholder="$t('common.passwordTip')" @keyup.enter="onRegister" maxlength="18"
                 @input="onEmailFormValid"/>
          <i :class="[type=='password'?'hide':'show']" @click="onShowPwd"></i>
        </div>
        <p class="regtip">{{$t('common.passWordTipsText')}}</p>
        <p class="err" v-if="errMsg!=''">{{errMsg}}</p>
        <el-button :class="['submit',!isEmp?'':'disable']" :loading="isLoading" @click="onRegister">
          {{$t('common.registerTxt')}}
        </el-button>
      </div>
      <div class="form-footer">
        <p class="tip">{{$t('common.agreeText')}}
          <router-link to="/Service" target="_blank" tag="a" class="link">{{$t('common.serviceProtol')}}</router-link>
        </p>
        <em class="line"></em>
        <el-button class="register" @click="toRegister">{{$t('common.loginTxt')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
    import SearchGroup from '../../../components/searchGroup/searchGroup'

    export default {
        name: "register",
        components: {SearchGroup},
        props: {
            ruleType: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                show: true,
                activeIndex: this.ruleType,
                isLoading: false,
                groupShow: false,
                type: 'password',
                codeImg: '',
                isEmp: true,
                email: '',
                pwd: '',
                phone: '',
                imgCodeNum: '',
                validCode: '',
                num: '0086',
                errMsg: '',
                timmer: 60,//倒计时
                isSending: false,//是否获取验证码当中
                inviteCode: ''
            }
        },
        computed: {
            nationalSource: function () {
                if (this.$store.state.nationalNum.length <= 0) {
                    this.$store.dispatch('getNationalSource')
                }
                return this.$store.state.nationalNum
            }
        },
        methods: {
            changeIndex(val) {
                this.activeIndex = val;
                this.onEmailFormValid()
                this.getImgCode()

                this.timmer = 60
                this.isSending = false
                this.errMsg = ""
            },
            onSlide() {
                this.groupShow = this.groupShow ? false : true
                this.$refs['_register'].id = "groupPage"
            },
            //去登录
            toRegister() {
                this.$emit('update:dialogType', 'log')
                this.$emit('changeDialog', this.activeIndex)
            },
            //选择区号
            onChoose(val) {
                this.num = val.areaCode
            },
            //展示密码
            onShowPwd() {
                if (this.type == 'password') this.type = 'input'
                else this.type = 'password'
            },
            //获取验证码
            getImgCode() {
                let _self = this;
                _self.imgCodeNum = ""
                _self.codeImg = '/bcbuyerapihttp/nologon/user/imgcode?type_id=1' + '&' + new Date().getTime()
            },
            validate() {
                let _self = this;
                if (_self.activeIndex == 1) {
                    _self.errMsg = _self.$valid.txtEmp(_self.email, _self.$t('common.emailTip2'))
                    if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") return false;
                    _self.errMsg = _self.$valid.email(_self.email, _self.$t('common.emailTip'))
                    if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") return false;
                } else {
                    _self.errMsg = _self.$valid.txtEmp(_self.phone, _self.$t('common.phoneTip'))
                    if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") return false;
                }
                _self.errMsg = _self.$valid.txtEmp(_self.imgCodeNum, _self.$t('common.captchaTips'))
                if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") return false;
                else return true
            },
            //获取验证码
            sendValidCode() {
                let _self = this;
                if (_self.isSending) return
                // if (_self.activeIndex == 1) {
                //     _self.errMsg = _self.$valid.txtEmp(_self.email, _self.$t('common.emailTip2'))
                //     if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") return;
                //     _self.errMsg = _self.$valid.email(_self.email, _self.$t('common.emailTip'))
                //     if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") return;
                // } else {
                //     _self.errMsg = _self.$valid.txtEmp(_self.phone, _self.$t('common.phoneTip'))
                //     if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") return;
                // }
                // _self.errMsg = _self.$valid.txtEmp(_self.imgCodeNum, _self.$t('common.captchaTips'))
                // if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") return;
                if (!_self.validate()) return;
                _self.$post('/nologon/user/verificationcode', {
                    code: _self.imgCodeNum,
                    code_type: "REGISTER",
                    send_to: _self.activeIndex == 1 ? _self.email : _self.num + _self.phone,
                    send_type: _self.activeIndex
                }).then(res => {
                    if (res.code == 1) {
                        _self.isSending = true;
                        _self.timeDown()
                    } else {
                        _self.errMsg = res.msg
                    }
                })

            },
            timeDown() {
                let self = this;
                let result = setInterval(() => {
                    --self.timmer;
                    if (self.timmer < 0) {
                        clearInterval(result);
                        self.isSending = false;
                        self.timmer = 60;
                    }
                }, 1000);
            },
            //表单验证
            onEmailFormValid(v) {
                if (this.activeIndex == 1) {
                    if (this.email.trim() != "" && this.imgCodeNum.trim() != "" && this.pwd != "" && this.validCode.trim() != "") this.isEmp = false
                    else this.isEmp = true
                } else {
                    this.phone = this.phone.replace(/[^0-9]/g, '')
                    if (this.phone.trim() != "" && this.imgCodeNum.trim() != "" && this.pwd != "" && this.validCode.trim() != "") this.isEmp = false
                    else this.isEmp = true
                }
            },
            onRegister() {
                let _self = this;
                if (_self.isEmp || !_self.validate()) return;
                _self.isLoading = true;
                _self.$post('/nologon/user/signup', {
                    cellphone: _self.activeIndex == 1 ? '' : _self.num + _self.phone.trim(),
                    area_code: _self.num,
                    email: _self.activeIndex == 1 ? _self.email.trim() : '',
                    passWd: _self.pwd,
                    type: 'local',
                    vcode: _self.imgCodeNum,
                    verification_code: _self.validCode,
                    inviteCode: _self.inviteCode
                }).then(res => {
                    if (res.code == 1) {
                        _self.$emit('update:show', false)
                        _self.$get("/userinfo", {}).then(res => {
                            if (res.code == 1) {
                                _self.$storage.set("userInfo", {
                                    uid: res.data.user_id,
                                    head_figure: res.data.head_figure,
                                    nick_name: res.data.nick_name,
                                })
                                _self.$storage.set('isLogin', true)

                                if (_self.$route.name == "ForgetPassword")
                                    window.location.href = "/"
                                else
                                    _self.$router.go(0)

                            } else {
                                _self.$toastMessage(res.msg)
                            }
                        })
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                    _self.isLoading = false
                })
            }

        },
        created() {
            this.getImgCode()
            if (this.$route.query.inviteCode) this.inviteCode = this.$route.query.inviteCode
        },
        beforeDestroy() {
            if (this.$refs['_register'])
                this.$refs['_register'].removeAttribute("id")
        }
    }
</script>

<style scoped lang="less">
  @import "form";
</style>
