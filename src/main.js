// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'

import store from './store/index'

import {
  Carousel,
  CarouselItem,
  Rate,
  Pagination,
  Form,
  FormItem,
  Button,
  Scrollbar,
  Tooltip,
  Dialog,
  Upload,
  Input,
  Image
} from 'element-ui';
import {fetchPost, fetchGet} from "./api/axios"
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/element-variables.scss'

import message from './components/message/toastMessage'
import 'vue2-animate/dist/vue2-animate.min.css'
import Valid from './util/validator'

import VueI18n from 'vue-i18n'
import {getCookie} from "./util/cookie";



// import cssVars from 'css-vars-ponyfill'

Vue.use(VueI18n)

const i18n = new VueI18n({
  //定义默认语言
  locale: 'zh',
  messages: {
    'zh': require('./util/lang/zh'),
    'en': require('./util/lang/en')
  },
  silentTranslationWarn: true
})

// cssVars({})

Vue.use(message)


Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Rate)
Vue.use(Pagination)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Scrollbar)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Upload)
Vue.use(Input)
Vue.use(Image)

window.$bus = Vue.prototype.$bus = new Vue()

Vue.config.productionTip = false

Vue.prototype.$valid = Valid

require('es6-promise').polyfill();
require('es6-promise/auto');

//本地数据存储
Vue.prototype.$storage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    return localStorage.getItem(key);
  },
  remove(key) {
    localStorage.removeItem(key);
  }
}

//axios接口调用
Vue.prototype.$get = fetchGet
Vue.prototype.$post = fetchPost

router.beforeEach((to, form, next) => {

  if(getCookie('b_uinfo') == "" || document.cookie.length <= 0){
    localStorage.removeItem('isLogin');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('client');
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (getCookie('b_uinfo') == "" || document.cookie.length <= 0) {
      next('/')
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.isLevel)) {
    let expires = 1000 * 60 * 10, loghistory = JSON.parse(localStorage.getItem('loghistory'))
    if (loghistory == null) {
      next('/')
    } else {
      if (new Date().getTime() - loghistory.expires > expires) {
        localStorage.removeItem('loghistory');
        next('/')
      }
      next()
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: {App},
  template: '<App/>'
})
