<template>
  <!--找回密码/安全验证密码-->
  <div class="pwd-page">
    <div class="pwd-group" v-if="type==1">
      <label>{{$t('common.accountName')}}</label>
      <input type="text" class="ret-input" v-model="email" @input="checkForm" autocomplete="new-password"
             :placeholder="$t('common.emailTip3')"/>
    </div>
    <div class="pwd-group" v-else>
      <label>{{$t('common.accountName')}}</label>
      <div class="flex row-pack-justify">
        <div class="country-area" ref="_pwdgroup">
          <span class="country-num" @click="onSlide">+{{num.substr(2,num.length)}}</span>
          <search-group :isShow.sync="groupShow" :groupSource="nationalSource" @choose="onChoose"></search-group>
        </div>
        <input type="text" class="ret-input" @input="checkForm" @keyup="phone=phone.replace(/\D/g,'')"
               @pause="phone=phone.replace(/\D/g,'')" v-model="phone" autocomplete="new-password"
               :placeholder="$t('common.phoneTip2')"/>
      </div>
    </div>
    <div class="pwd-group">
      <label>{{$t('common.verifyCodeTip2')}}</label>
      <input type="text" class="ret-input" v-model="imgCode" @input="checkForm" autocomplete="new-password"
             :placeholder="$t('common.placeholder1')"/>
      <p class="rightCode"><img class="validcode" :src="codeImg" @click="getImgCode"/></p>
    </div>
    <div class="pwd-group">
      <label>{{type==1?$t('common.validEmail'):$t('common.validSMS')}}</label>
      <input type="text" class="ret-input" autocomplete="new-password" @input="checkForm" v-model="validCode"
             :placeholder="type==1?$t('common.placeholder2'):$t('common.placeholder3')"/>
      <p :class="['c-link',isSending?'disable':'']" @click="getValidCode">
        {{isSending?timmer+'s':$t('common.getVcode')}}</p>
    </div>
    <div class="pwd-group error">
      <p class="errmsg" v-if="errMsg!=''">{{errMsg}}</p>
    </div>
    <div class="pwd-group">
      <el-button :class="['pwd-button',isEmp?'disable':'']" :loading="isLoading" @click="onSubmit">
        {{pageType!='BindAccount'? $t('common.nextTxt'):$t('common.saveTxt')}}
      </el-button>
    </div>
  </div>
</template>

<script>
    import SearchGroup from '../../../components/searchGroup/searchGroup'

    export default {
        name: "resetPwd",
        components: {SearchGroup},
        props: {
            //类型：1邮箱，2手机
            type: {
                type: Number,
                default: 1
            },
            pageType: {
                type: String,
                default: 'log' //wallet:交易密码，log:登录忘记密码，BindAccount:修改绑定
            },
            isLoading: {
                type: Boolean,
                default: false
            },
            bindType: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                //rsType:1
                codeImg: '',
                // isLoading: false,
                isSending: false,
                timmer: 60,
                isEmp: true,
                groupShow: false,
                errMsg: '',
                num: '0086',
                email: '',
                phone: '',
                imgCode: '',
                validCode: '',
            }
        },
        watch: {
            type: function (v) {
                this.getImgCode()

                this.isSending = false
                this.timmer = 60
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
            //获取验证码
            getImgCode() {
                let _self = this;
                _self.imgCode = ""
                _self.codeImg = '/bcbuyerapihttp/nologon/user/imgcode?type_id=1' + '&' + new Date().getTime()
            },
            checkForm() {
                if (this.type == 1) {
                    if (this.email.trim() != "" && this.imgCode.trim() != "" && this.validCode.trim() != "") this.isEmp = false
                    else this.isEmp = true
                } else {
                    if (this.phone.trim() != "" && this.imgCode.trim() != "" && this.validCode.trim() != "") this.isEmp = false
                    else this.isEmp = true
                }
            },
            onSlide() {
                this.groupShow = this.groupShow ? false : true
                this.$refs['_pwdgroup'].id="groupPage"
            },
            //选择区号
            onChoose(val) {
                this.num = val.areaCode
            },
            //获取验证码
            getValidCode() {
                let _self = this;
                if (_self.isSending) return
                if (_self.type == 1) {
                    _self.errMsg = _self.$valid.txtEmp(_self.email, _self.$t('common.emailTip2'))
                    if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") return;
                    _self.errMsg = _self.$valid.email(_self.email, _self.$t('common.emailTip'))
                    if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") return;
                } else {
                    _self.errMsg = _self.$valid.txtEmp(_self.phone, _self.$t('common.phoneTip'))
                    if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") return;
                }
                _self.errMsg = _self.$valid.txtEmp(_self.imgCode, _self.$t('common.captchaTips'))
                if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") return;

                // if (!_self.validate()) return

                let codeType = _self.pageType == "log" ? "FORGOTPWD" : _self.pageType == "wallet" ? 'FORGOTPIN' : _self.pageType == "BindAccount" && _self.type == 1 ? 'BINDINGEMAIL' : 'BINDINGCELLPHONE'
                _self.$post('/nologon/user/verificationcode', {
                    code: _self.imgCode,
                    code_type: codeType,
                    send_to: _self.type == 1 ? _self.email.trim() : _self.num + _self.phone.trim(),
                    send_type: _self.type
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
            onSubmit() {
                let _self = this;

                if (_self.isEmp) return

                // if (_self.type == 1) {
                //     _self.errMsg = _self.$valid.email(_self.email, _self.$t('common.emailTip'))
                //     if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") {_self.isLoading=false; return;}
                // }

                _self.$emit('update:isLoading', true);

                _self.$emit('submit', {
                    email: _self.email,
                    phone: _self.num + _self.phone,
                    validCode: _self.validCode,
                    imgCode: _self.imgCode
                })
            },
        },
        created() {
            this.getImgCode()
        }
    }
</script>

<style scoped lang="less">
  @import "form";
</style>
