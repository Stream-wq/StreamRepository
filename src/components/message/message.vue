<template>
  <transition name="fade">
    <div class="message" v-if="show">
      <div class="message-box">{{message}}</div>
    </div>
  </transition>
</template>

<script>
    export default {
        name: "message",
        data(){
            return{
                show:false,
                message:''
            }
        }
    }
</script>

<style scoped>
  .message{
    position: fixed;
    height: 100%;
    width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    top:0;
    left: 0;
    right: 0;
    z-index: 9999;
  }
  .message-box{
    min-width:100px;
    min-height:68px;
    max-width:330px;
    line-height: 22px;
    background-color:rgba(0,0,0,.8);
    text-align: center;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    padding:22px 56px;
    font-size: 16px;
    color:#fff;
    border-radius:5px;
    word-break: break-word;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
