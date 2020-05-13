<template>
  <div :class="['dialog-page',show?'fixed':'']">
    <transition name="fade">
      <div class="dialog-shadow" v-if="show" @click="onClose">
      </div>
    </transition>
    <transition name="fade" :duration="{enter:300,leave:800}">
      <div class="dialog" v-if="show">
        <h4 class="form-title">{{dialogType=='log'?$t('common.loginTxt'):$t('common.registerTxt')}}</h4>
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
    import 'vue2-animate/dist/vue2-animate.min.css'

    export default {
        name: "indexDialog",
        props: {
            // title: {
            //     type: String,
            //     default: ""
            // },
            show: {
                type: Boolean,
                default: false
            },
            dialogType: {
                type: String,
                default: ''
            }
        },
        data() {
            return {}
        },
        methods: {
            onClose() {
                this.$emit('update:show', false)
            }
        }
    }
</script>

<style scoped lang="less">
  .fixed {
    position: fixed;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    right: 0;
    z-index: 99;
  }

  .dialog-page {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -ms-flex-direction: column;
    flex-direction: column;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;

    .dialog-shadow {
      position: fixed;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, .6);
      z-index: 99;
    }

    .dialog {
      padding: 22px 56px 34px;
      background-color: #fff;
      border-radius: 5px;
      z-index: 100;
      position: relative;
      width: 450px;
    }

    .form-title {
      display: block;
      font-size: 32px;
      line-height: 32px;
      color: #333333;
      margin-bottom: 14px;
    }
  }
</style>
