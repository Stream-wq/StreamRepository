<template>
  <div class="login-page">
    <div class="tabs-nav">
      <span class="label" :class="activeIndex==1?'active':''" @click="changeIndex(1)">{{$t('common.emailLogin')}}</span>
      <span class="label" :class="activeIndex==2?'active':''" @click="changeIndex(2)">{{$t('common.phoneLogin')}}</span>
    </div>
    <div class="form-page">
      <div class="page-item">
        <div class="group" v-if="activeIndex==1">
          <input type="text" v-model="email" @keyup.enter="onLogin" class="input" :placeholder="$t('common.emailTip2')"
                 @input="onEmailFormValid"/>
        </div>
        <div class="group xarea" v-if="activeIndex==2">
          <div class="country-area" ref="_group">
            <span class="country-num" @click="onSlide">+{{num.substr(2,num.length)}}</span>
            <search-group :isShow.sync="groupShow" :groupSource="nationalSource" @choose="onChoose"></search-group>
          </div>
          <input type="phone" v-model="phone" class="input" :placeholder="$t('common.phoneTip')"
                 @input="onEmailFormValid" @keyup="phone=phone.replace(/\D/g,'')" @keyup.enter="onLogin"
                 @pause="phone=phone.replace(/\D/g,'')"/>
        </div>
        <div class="group pwd">
          <input :type="type" v-model="pwd" @keyup.enter="onLogin" class="input" :placeholder="$t('common.passwordTip')"
                 maxlength="18"
                 @input="onEmailFormValid"/>
          <i :class="[type=='password'?'hide':'show']" @click="onShowPwd"></i>
        </div>
        <p class="rpwd">
          <span class="link" @click="toForget">{{$t('common.forgetPassword')}}?</span>
        </p>
        <p class="err" v-if="errMsg!=''">{{errMsg}}</p>
        <el-button :class="['submit',!isEmp?'':'disable']" @keyup.enter="onLogin" :loading="isLoading" @click="onLogin">
          {{$t('common.loginTxt')}}
        </el-button>
      </div>
      <div class="form-footer">
        <p class="tip">{{$t('common.agreeText')}}
          <router-link to="/Service" target="_blank" tag="a" class="link">{{$t('common.serviceProtol')}}</router-link>
        </p>
        <em class="line"></em>
        <el-button class="register" @click="toRegister">{{$t('common.registerTxt')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
    import SearchGroup from '../../../components/searchGroup/searchGroup'

    export default {
        name: "login",
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
                dialogType: '',
                activeIndex: this.ruleType,
                isLoading: false,
                groupShow: false,
                type: 'password',
                isEmp: true,
                email: '',
                pwd: '',
                phone: '',
                num: '0086',
                errMsg: '',
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
            toForget() {
                this.$emit('update:show', false)
                this.$router.push({path: `/forget/${this.activeIndex == 1 ? 'email' : 'phone'}`})
                this.$bus.$emit('type', this.activeIndex == 1 ? 'email' : 'phone')
            },
            changeIndex(val) {
                this.activeIndex = val;
                this.errMsg = ""
                this.onEmailFormValid()
            },
            onSlide() {
                this.groupShow = this.groupShow ? false : true
                this.$refs["_group"].id = "groupPage"
            },
            //去注册
            toRegister() {
                this.$emit('update:dialogType', 'register')
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
            //表单验证
            onEmailFormValid(v) {
                if (this.activeIndex == 1) {
                    if (this.email.trim() != "" && this.pwd != "") this.isEmp = false
                    else this.isEmp = true
                } else {
                    this.phone = this.phone.replace(/[^0-9]/g, '')
                    if (this.phone.trim() != "" && this.pwd != "") this.isEmp = false
                    else this.isEmp = true
                }
            },
            //登录
            onLogin() {
                //activeIndex=1 邮箱登录 /  =2 手机登录
                let _self = this;
                if (_self.isEmp) return;
                _self.isLoading = true;
                if (_self.activeIndex == 1) {
                    _self.errMsg = _self.$valid.email(_self.email, _self.$t('common.emailTip'))
                    if (_self.errMsg != '' && typeof (_self.errMsg) != "undefined") {
                        _self.isLoading = false;
                        return;
                    }
                }
                _self.$post('/nologon/user/logon', {
                    cellphone: _self.activeIndex == 1 ? '' : _self.num + _self.phone.trim(),
                    email: _self.activeIndex == 1 ? _self.email.trim() : '',
                    passWd: _self.pwd,
                    type: 'local'
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
                        _self.errMsg = res.msg
                    }

                    _self.isLoading = false
                })
            }
        },
        created() {

        },
        beforeDestroy() {
            if (this.$refs['_group'])
                this.$refs['_group'].removeAttribute("id")
        }
    }
</script>

<style scoped lang="less">
  @import "form";
</style>
