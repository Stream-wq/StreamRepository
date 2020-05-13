<template>
  <div class="radio" @click="onCheck">
    <span :class="['cir',isChoose?'active':'']" :style="{'border-color':color}"></span>
    <label class="txt" :style="textStyle">
      <slot></slot>
    </label>
  </div>
</template>

<script>
    export default {
        name: "exradio",
        props: {
            color: {
                type: String,
                default: "#22a27f"
            },
            textStyle: {
                type: Object,
                default: null
            },
            isCheck: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isChoose: this.isCheck
            }
        },
        watch: {
            isChoose(v) {
                this.$emit("update:isCheck", v)
            }
        },
        methods: {
            onCheck() {
                let _self = this;


                _self.isChoose = _self.isChoose ? false : true

                _self.$emit('check', _self.isChoose)
            }
        }
    }
</script>

<style scoped>
  .radio {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: row;
    -webkit-flex-direction: row;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
  }

  .cir {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #22a27f;
    margin-right: 8px;
  }

  .cir.active {
    background: #22a27f url("done.png") no-repeat center /cover;
    border: none;
  }

  .txt {
    font-size: 16px;
    color: #cccccc;
    cursor: pointer;
  }
</style>
