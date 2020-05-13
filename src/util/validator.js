const Valid={
  email:function (email,err) {
    let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if(!reg.test(email.trim())){
      return err
    }else{
      return ""
    }
  },
  txtEmp:function (email,err) {
    if(email.trim()==""){
      return err
    }else{
      return ""
    }
  }
}

export default Valid
