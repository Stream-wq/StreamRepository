<template>
  <!--（针对国家区号）带搜索框的下拉列表-->
  <transition name="fadeOutDown">
    <div class="group-page" v-if="isShow" :style="pageStyle">
      <div class="search-box">
        <input type="text" ref="search" v-model="inputVal" @input="onGroupSource" class="search-txt"
               :placeholder="$t('input.SearchInputPlaceholder')"/>
        <div class="search-btn" @click="onSearch"></div>
      </div>
      <div class="group-content">
        <el-scrollbar style="height: 100%">
          <ul class="options-list">
            <li class="options" v-for="(item,i) in sySource" :key="i" @click="onChoose($event,item)">
              <span class="country" :style="textStyle">{{item.name}}</span>
              <span class="num">+{{item.areaCode.substring(2,item.areaCode.length)}}</span>
            </li>
          </ul>
        </el-scrollbar>
      </div>

    </div>
  </transition>
</template>

<script>
    import 'vue2-animate/dist/vue2-animate.min.css'

    export default {
        name: "searchGroup",
        props: {
            isShow: {
                type: Boolean,
                default: true
            },
            groupSource: {
                type: Array,
                default: []
            },
            pageStyle: {
                type: Object,
                default: null
            },
            textStyle: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                inputVal: '',
                show: this.isShow,
                sySource: this.groupSource
            }
        },
        watch: {
            groupSource(val) {
                this.sySource = val
            },
            isShow: function (val) {
                this.inputVal = val ? this.inputVal : ""
                this.sySource = this.groupSource

                let group = document.getElementById("groupPage")
                if (!val)
                    group.removeAttribute("id")
            }
        },
        methods: {
            onGroupSource() {
                let _self = this, arr = [];
                _self.groupSource.filter(val => {
                    if (val.name.indexOf(_self.inputVal.trim()) != -1 || val.areaCode.indexOf(_self.inputVal.trim()) != -1)
                        arr.push(val)
                })
                _self.sySource = arr
            },
            onSearch() {

            },
            onChoose(e, item) {
                this.$emit("choose", item)
                this.$emit('update:isShow', false)
            },
            eventListener(event) {
                let sp = document.getElementById("groupPage")
                if (sp) {
                    if (!sp.contains(event.target)) {
                        this.$emit("update:isShow", false)
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
            window.document.body.removeEventListener("click", this.eventListener)
        }
    }
</script>
<style>
  .group-page .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
<style scoped>
  .group-page {
    padding: 8px 16px 0;
    height: 302px;
    overflow: hidden;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    position: absolute;
    width: 100%;
    top: 55px;
    z-index: 88;
  }

  .search-box {
    width: 100%;
    height: 34px;
    position: relative;
    line-height: 34px;
    border-radius: 25px;
    overflow: hidden;
    border: 1px solid #ccc;
  }

  .search-txt {
    border: none;
    outline: none;
    height: 35px;
    line-height: 35px;
    margin-left: 18px;
    font-size: 14px;
    color: #666;
    background: none;
    width: 100%;
    padding-right: 45px;
  }

  .search-btn {
    position: absolute;
    right: 20px;
    top: 7px;
    width: 16px;
    height: 16px;
    background: url(search.png) no-repeat center / cover;
    cursor: pointer;
    z-index: 102;
  }

  .search-txt::-moz-placeholder {
    color: #ccc;
  }

  .search-txt:-ms-input-placeholder {
    color: #ccc;
  }

  .search-txt::-webkit-input-placeholder {
    color: #ccc;
  }

  .group-content {
    overflow: hidden;
    height: 250px;
  }

  .options-list .options {
    height: 36px;
    line-height: 36px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 5px;
    cursor: pointer;
  }

  .country {
    font-size: 14px;
    color: #333;
  }

  .num {
    font-size: 14px;
    color: #9b9b9b;
  }
</style>
