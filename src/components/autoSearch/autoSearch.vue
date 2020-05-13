<template>
  <transition name="fadeOutDown">
    <div class="page">
      <div class="input-box" @click="onClick">
        <input type="text" :readonly="readonly" class="search-input" v-model="val" :placeholder="placeholder"
               @input="onGroupSource"/>
      </div>
      <div class="group-page" v-if="show&&!readonly">
        <el-scrollbar style="height: 100%">
          <ul class="options-list">
            <li class="options" v-for="(item,i) in sySource" :key="i" @click="onChoose($event,item)">
              {{item.name}}
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </transition>
</template>

<script>
    export default {
        name: "autoSearch",
        props: {
            placeholder: {
                type: String,
                default: ''
            },
            groupSource: {
                type: Array,
                default: []
            },
            readonly: {
                type: Boolean,
                default: false
            },
            inputVal: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                val: this.inputVal,
                show: false,
                sySource: this.groupSource
            }
        },
        watch: {
            groupSource(val) {
                this.sySource = val
            },
            inputVal(v) {
                this.val = v
            },
            show(v) {
                if (this.sySource.length <= 0) {
                    this.$emit("update:inputVal", '中国')
                }
            }
        },
        methods: {
            onClick() {
                this.show = this.show ? false : true
                if(this.show){
                    this.onGroupSource()
                }
            },
            onGroupSource() {
                let _self = this, arr = [];
                _self.groupSource.filter(val => {
                    if (_self.val.trim() != "" && val.name.indexOf(_self.val.trim()) != -1)
                        arr.push(val)
                })
                _self.sySource = _self.val.trim() == "" ? _self.groupSource : arr
                _self.$emit('input', _self.val.trim())
            },
            onChoose(event, item) {
                this.val = item.name
                this.show = false
                this.$emit("update:inputVal", item.name)
                this.$emit('select', item)
            }
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
    height: 302px;
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
    justify-content: space-between;
    padding: 0 5px;
    cursor: pointer;
    font-size: 14px;
    color: #fff;
  }
</style>
