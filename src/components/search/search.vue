<template>
  <div class="search-box">
    <input type="text" ref="search" v-model="inputVal" class="search-txt" @input="onInput" :placeholder="$t('input.SearchInputPlaceholder')"/>
    <div class="search-btn" @click="onSearch"></div>
  </div>
</template>

<script>
    export default {
        name: "search",
        props:{
            // text:{
            //     type:String,
            //     default:""
            // }
        },
        data(){
            return{
               inputVal:''
            }
        },
        methods:{
            onSearch(){
                let _self=this;
                _self.$emit("search",_self.inputVal.trim())
            },
            onInput(){
                this.$emit('input',this.inputVal.trim())
            }
        }
    }
</script>

<style scoped>
  .search-box {
    width: 300px;
    height: 36px;
    position: relative;
    line-height: 36px;
    border-radius: 25px;
    background-color:#26253a;
    overflow: hidden;
  }
  .search-txt{
    border: none;
    outline: none;
    height: 35px;
    line-height: 35px;
    margin-left: 18px;
    font-size: 14px;
    color:#fff;
    background: none;
    width: 236px;
  }
  .search-btn{
    position: absolute;
    right: 20px;
    top: 10px;
    width: 16px;
    height: 16px;
    background: url(search.png) no-repeat center / cover;
    cursor: pointer;
  }
  .search-txt::-moz-placeholder{
    color:#9d9d9d;
  }
  .search-txt:-ms-input-placeholder{
    color:#9d9d9d;
  }
  .search-txt::-webkit-input-placeholder{
    color: #9d9d9d;
  }
</style>
