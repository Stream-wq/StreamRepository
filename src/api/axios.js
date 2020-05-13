import Axios from 'axios'
import {Loading} from "element-ui";
import Message from '../components/message/toastMessage'
import {getCookie} from '../util/cookie'
// import cookie from './cookie'


let url='/bcbuyerapihttp';

let http = Axios.create({
  baseURL: url,//请求路径
  timeout: 200000, //请求超时时间
  headers:{
    'Accept':'application/json'
  },
  withCredentials:true
})

// 设置 post、put 默认 Content-Type
http.defaults.headers.post['Content-Type'] = 'application/json'
http.defaults.headers.get['Content-Type'] = 'application/json'
http.defaults.headers.delete['Content-Type'] = 'application/json'


let loadingInstance;
// 添加请求拦截器
http.interceptors.request.use(config => {
  //设置请求数据蒙层
  // loadingInstance=Loading.service({
  //   lock: true,
  //   text: '',
  //   spinner: 'el-icon-loading',
  //   background: 'rgba(0, 0, 0, 0.7)'
  // });

  if (config.method === "post" || config.method === "get" || config.method==="delete") {
    config.data = JSON.stringify(config.data);
  }
  return config
}, error => {
  //请求错误处理
  // loadingInstance.close()
  Message(getCookie('local')=="en"?'Request Error':'请求错误')
  return Promise.reject(error)
});

// 添加响应拦截器
http.interceptors.response.use(response => {
  // loadingInstance.close()
  return response
}, error => {
  // loadingInstance.close()
  Message(getCookie('local')=="en"?'Request Error':'请求错误')
  return Promise.reject(error)
});

//发送请求
export function fetchPost(url, params) {
  // debugger
  return new Promise((resolve, reject) => {
    // debugger
    http.post(url, params).then(res => {
      resolve(res.data)
    }, err => {
      //reject(err.config)
    })
  })
}

export function fetchGet(url, params) {
  return new Promise((resolve, reject) => {
    http.get(url, params).then(res => {
      resolve(res.data)
    })

  })
}

export function fetchDelete(url, params) {
  return new Promise((resolve,reject)=>{
    http.delete(url,params).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      reject(err.config)
    })
  })
}

