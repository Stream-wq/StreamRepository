<template>
  <div class="page">
    <transition name="fade">
      <div class="shadow" v-if="show"></div>
    </transition>
    <transition name="slideRight" :duration="300">
      <div class="drawer-page animated" @click.self="onClose($event)" v-if="show">
        <div class="drawer">
          <div class="drawer-btn" @click.prevent.stop="onClose($event)"></div>
          <slot></slot>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
    import 'vue2-animate/dist/vue2-animate.min.css'

    export default {
        name: "drawer",
        props: {
            show: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                xshow: false
            }
        },
        watch: {
            show(val, oldVal) {
                if (val) {
                    window.document.body.style.overflow="hidden"
                } else {
                    window.document.body.style.overflow="auto"
                }
            }
        },
        methods: {
            onClose(e) {
                e.stopPropagation()
                this.$emit('update:show', false)
            }
        },
    }
</script>

<style scoped>
  .shadow {
    background-color: rgba(0, 0, 0, .4);
  }

  .shadow, .drawer-page {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
  }

  .drawer-page {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -ms-flex-direction: column;
    flex-direction: column;
    align-items: flex-end;
  }

  .drawer {
    width: 700px;
    position: relative;
    height: 100%;
    background: #26253a;
    color: #cccccc;
    z-index: 98;
    border-left: 1px solid #36334a;
    /*right: -700px;*/
  }

  .drawer-btn {
    position: absolute;
    top: 50%;
    height: 30px;
    width: 30px;
    margin-top: 15px;
    left: -15px;
    z-index: 99;
    background: url(drawer-arrow.png) no-repeat center /cover;
    cursor: pointer;
  }

  .animated {
    animation-duration: 0.3s;
  }
</style>
