import message from '../components/message/toastMessage'
import {getCookie} from "./cookie";


export function checkLogin(isMessage) {
  let isLogin = localStorage.getItem("isLogin")
  if (!isLogin) {
    if (!isMessage)
      message(getCookie('local') == "en" ? 'Please Log in' : '请先登录')
    return false
  } else return true
}

export function copyLink(url) {
  let oInput = document.createElement('input');
  oInput.value = url;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象;
  document.execCommand("Copy"); // 执行浏览器复制命令
  oInput.remove()
}

export function formatDate(timestamp) {
  let date = new Date(Number(timestamp)); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-';
  let D =
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  let h =
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
    ':';
  let m =
    (date.getMinutes() < 10
      ? '0' + date.getMinutes()
      : date.getMinutes()) + ':';
  let s =
    date.getSeconds() < 10
      ? '0' + date.getSeconds()
      : date.getSeconds();
  return Y + M + D + h + m + s;
}

export function formateNum(num) {
  if (num) {
    var arr = num.toString().split('.');
    var t1 = arr[0].toString().split('');
    var t2 = arr[1].toString();
    var result = [],
      counter = 0;
    for (var i = t1.length - 1; i >= 0; i--) {
      counter++;
      result.unshift(t1[i]);
      if (counter % 3 == 0 && i != 0) {
        result.unshift(',');
      }
    }
    var t3 = result.join('');
    var t4 = t3 + '.' + t2;
    return t4;
  } else {
    return num;
  }
}
