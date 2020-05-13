export function setCookie(name, value, expiredays) {
  let date = new Date()
  date.setSeconds(date.getSeconds() + expiredays)
  document.cookie = name + "=" + escape(value) + ";path=/;expires=" + date.toGMTString()
  //console.log(document.cookie)
}
export function getCookie(name) {
  if (document.cookie.length>0){
    let c_start=document.cookie.indexOf(name + "=")
    if (c_start!=-1){
      c_start=c_start + name.length+1
      let c_end=document.cookie.indexOf(";",c_start)
      if (c_end==-1) c_end=document.cookie.length
      return unescape(document.cookie.substring(c_start,c_end))
    }
  }
  return ""
}
export function removeCookie(name) {
  setCookie(name,"",-1);
}
