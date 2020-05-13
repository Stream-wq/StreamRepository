<template>
  <div class="app-page">
    <div class="page-top">
      <div class="header">
        <div class="area flex flex-direction-row flex-pack-justify">
          <div class="nav flex flex-direction-row flex-align-center">
            <router-link to="/home" class="logo"><img src="../assets/logo.png"/></router-link>
            <ul class="lst-nav">
              <li>
                <router-link to="/home" class="lst-item" active-class="link-active" exact>{{$t("nav.home")}}
                </router-link>
              </li>
              <li>
                <router-link to="/personnel" class="lst-item" active-class="link-active">{{$t("nav.personnel")}}
                </router-link>
              </li>
              <li>
                <router-link to="/wallet" class="lst-item" active-class="link-active">{{$t("nav.wallet")}}</router-link>
              </li>
              <li>
                <router-link to="/report" class="lst-item" active-class="link-active">{{$t("nav.report")}}</router-link>
              </li>
              <li>
                <a href="https://www.tokenrank.co/ProjectApplication" class="lst-item"><i class="menu-icon"></i>
                  {{$t("nav.projectStore")}}
                </a>
              </li>
              <li>
                <a href="https://www.tokenrank.co/AboutUs" class="lst-item">{{$t("nav.about")}}</a>
              </li>
            </ul>
          </div>
          <div class="member-info flex flex-direction-row flex-align-center">
            <div class="unlogin" v-if="!userInfo">
              <span class="log" @click="onDialog('log')">{{$t('common.loginTxt')}}</span>
              <span class="register" @click="onDialog('register')">{{$t('common.registerTxt')}}</span>
            </div>
            <div class="islogin flex flex-direction-row" v-else>
              <router-link tag="a" to="/member" class="user flex flex-direction-row flex-align-center">
                <img :src="userInfo.head_figure" class="avatar"/>
                <span class="log">{{$t('nav.ucenter')}}</span>
              </router-link>
              <span class="log" @click="logOut">{{$t('nav.loginOut')}}</span>
            </div>
            <div class="lang">
              <span :class="['lan',local=='zh'?'link-active':'']" @click="getLang('zh')">中文</span>
              <em></em>
              <span :class="['lan',local=='en'?'link-active':'']" @click="getLang('en')">EN</span>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" :dialog.sync="dialogShow" :dialogType.sync="dialogType"
                       class="router-view">
          </router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" :dialog.sync="dialogShow" :dialogType.sync="dialogType"
                     class="router-view"></router-view>
        <!--          <router-view :dialog.sync="dialogShow" :dialogType.sync="dialogType" />-->
      </div>
    </div>
    <div class="footer">
      <div class="area flex flex-direction-row flex-pack-justify">
        <div class="partner-box">
          <img src="../assets/lg_logo.png" class="lgLogo"/>
          <div class="partner">
            <a href="https://t.me/TokenRank_community" target="_blank" class="pla"></a>
            <a href="https://www.linkedin.com/in/fan-wu-tokenrankco/" target="_blank" class="ins"></a>
            <a href="https://www.facebook.com/TokenRank-105706607492790" target="_blank" class="face"></a>
            <a href="https://twitter.com/TokenRank_EVO" target="_blank" class="twitter"></a>
          </div>
          <p class="email">support@tokenrank.co</p>
        </div>
        <div class="download-box">
          <div class="link left">
            <a href="javascript:;" class="down-link ios disable">{{$t('nav.downIos')}}</a>
            <a href="https://download.tokenrank.co/TokenRank.apk"
               class="down-link android">{{$t('nav.downAndroid')}}</a>
          </div>
          <div class="code">
            <img src="../assets/code.jpg"/>
            <p class="txt">{{$t('nav.h5')}}</p>
          </div>
        </div>
        <div class="ft-nav">
          <h4 class="title">{{$t('nav.more')}}</h4>
          <div class="link-box">
            <router-link to="/question" class="link">{{$t('nav.questions')}}</router-link>
            <router-link to="/support" class="link">{{$t('nav.contact')}}</router-link>
            <!--            <router-link to="" class="link">{{$t('nav.joinUs')}}</router-link>-->
          </div>
        </div>
      </div>
    </div>
    <index-dialog v-if="dialogShow" :show.sync="dialogShow" :dialogType.sync="dialogType">
      <Login v-if="dialogType=='log'" :show.sync="dialogShow" :ruleType="ruleType" :dialogType.sync="dialogType"
             @changeDialog="onChange"></Login>
      <Register v-if="dialogType=='register'" :show.sync="dialogShow" :ruleType="ruleType"
                :dialogType.sync="dialogType" @changeDialog="onChange"></Register>
    </index-dialog>
  </div>
</template>

<script>
    import {setCookie, getCookie} from '../util/cookie'
    import IndexDialog from '../views/user/components/indexDialog'
    import Login from "../views/user/components/login"
    import Register from "../views/user/components/register"

    export default {
        name: 'index',
        data() {
            return {
                local: 'zh',
                dialogTitle: 'common.loginTxt',
                dialogShow: false,
                ruleType: 1,//1:email,2:phone(登录注册类型)
                dialogType: '',
                userInfo: JSON.parse(this.$storage.get("userInfo"))
            }
        },
        components: {IndexDialog, Login, Register},
        computed: {
        },
        methods: {
            onChange(index) {
                this.ruleType = index
            },
            getLang(lang) {
                localStorage.setItem('local', lang);
                setCookie('local', lang);
                this.$router.go(0)
            },
            onDialog(name) {
                this.dialogType = name
                //  this.dialogTitle = this.dialogType == 'log' ? 'common.loginTxt' : 'common.registerTxt'
                this.dialogShow = true
            },
            //退出登录
            logOut() {
                let _self = this;
                _self.$get("/logonout", {}).then(res => {
                    if (res.code == 1) {
                        _self.$storage.remove("userInfo");
                        _self.$storage.remove("isLogin");
                        if (_self.$route.path == '/' || _self.$route.path == '/home') {
                            _self.$router.go(0)
                        } else {
                            _self.$router.push('/home')
                            _self.$bus.$emit("uInfo", null);
                        }


                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            }
        },
        created() {
            // debugger
            let local = document.cookie == "" ? "zh" : getCookie('local') == "" ? 'zh' : getCookie("local")
            this.$i18n.locale = local
            this.local = local
        },
        beforeCreate() {
            this.$bus.$on('uInfo', data => {
                this.userInfo = data
            })
        }
    }


</script>

<style scoped>
  .app-page {
    height: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }

  .main {
    /*background:#1c182f;*/
    /*margin-bottom: 50px;*/
  }
</style>
