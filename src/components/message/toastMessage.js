const options = {
  isShow: false,
  message: ''
}

import Vue from 'vue'
import message from './message'

let Toast = Vue.extend(message);

let instance;
let timer = null;

const Message = (options) => {
  if (!instance) {
    instance = new Toast();
    instance.vm = instance.$mount()
    document.body.appendChild(instance.vm.$el)
  }
  if (timer) {
    clearTimeout(timer)
    timer = null
    instance.show = false
    instance.message = ''
  }
  let time = 3000
  if (typeof options === 'string') {
    instance.message = options
  } else if (typeof options === 'object') {
    let {message, time,show} = options
    instance.message = message
    time = time || 3000
    instance.show=show
  } else {
    return
  }
  // debugger
  if(typeof (options.show)!="undefined"){
    instance.show=options.show
  }else{
    instance.show =true
    timer = setTimeout(() => {
      instance.show = false
      clearTimeout(timer)
      timer = null
      instance.message = ''
    }, time)
  }

}

Message.close=()=>{
  timer=null
  instance.show=false
  instance.message=''
}
Message.install=(Vue)=>{
  Vue.prototype.$toastMessage = Message
}

export default Message
