<template>
  <transition name="fadeOutDown">
    <div class="page" id="defaultPage">
      <div class="input-box" @click="onClick">
        <input type="text" :readonly="readonly" class="search-input" v-model="val"/>
      </div>
      <div class="group-page" v-if="show">
        <el-scrollbar style="height: 100%">
          <ul class="options-list">
            <li class="options" v-for="(item,i) in source" :key="i" @click="onChoose($event,item)">
              <span class="country">{{item.name}}</span>
              <span class="num">{{item.fullname}}</span>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </transition>
</template>

<script>
    export default {
        name: "defaultSelect",
        props: {
            readonly: {
                type: Boolean,
                default: true
            },
            // show:{
            //     type:Boolean,
            //     default:false
            // },
            source: {
                type: Array,
                default: []
            },
            inputVal: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                val: '',
                show: false
            }
        },
        watch:{
            source:function (v) {
                if(this.inputVal==""){
                    this.val=this.source.length > 0 ? this.source[0].name : ''
                }else{
                    this.val=this.inputVal
                }
            }
        },
        methods: {
            onClick() {
                this.show = this.show ? false : true
            },
            onChoose(event, item) {
                this.val = item.name
                this.show = false
                this.$emit('select', item)
            },
            eventListener(event){
                let sp = document.getElementById("defaultPage")
                if (sp) {
                    if (!sp.contains(event.target)) {
                        this.show=false
                    }
                }
            }
        },
        created() {
        },
        mounted() {
            window.document.body.addEventListener("click", this.eventListener)
        },
        beforeDestroy() {
            window.document.body.removeEventListener("click",this.eventListener)
        }
    }
</script>
<style>
  .group-page .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
<style scoped>
  .page {
    width: 100%;
    cursor: default;
  }

  .input-box {
    height: 46px;
    border: 1px solid #777777;
    padding: 0 20px;
    border-radius: 5px;
    overflow: hidden;
    background: url("white-down.png") no-repeat right 18px center;
  }

  .input-box input {
    height: 46px;
    border: none;
    outline: none;
    background-color: transparent;
    width: 100%;
    font-size: 16px;
    color: #fff;
    cursor: default;
  }

  input:-moz-placeholder {
    color: #9d9d9d;
  }

  input::-webkit-input-placeholder {
    color: #9d9d9d;
  }

  input::-ms-input-placeholder {
    color: #9d9d9d;
  }

  .group-page {
    padding: 8px 16px 0;
    height: 230px;
    overflow: hidden;
    background: #26253a;
    border: 1px solid #777777;
    border-radius: 5px;
    position: absolute;
    width: 100%;
    top: 50px;
    z-index: 102;
  }

  .options-list .options {
    height: 36px;
    line-height: 36px;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: default;
  }

  .country {
    font-size: 14px;
    color: #fff;
    display: inline-block;
    width: 70px;
  }

  .num {
    font-size: 14px;
    color: #9d9d9d;
    display: inline-block;
    margin-left: 8px;
  }
</style>
