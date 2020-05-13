<template>
  <div class="check-box" @click="onCheck">
    <span class="check" :class="{'isCheck':isCheck}"></span>
    <span class="name">{{label}}</span>
  </div>
</template>

<script>
    export default {
        name: "checkbox",
        props: ['label'],
        data() {
            return {
                isCheck: false,
            }
        },
        methods: {
            onCheck: function () {
                this.isCheck = this.isCheck ? false : true
                this.$emit('check', this.isCheck)
            },

        }
    }
</script>

<style scoped>
  .check-box {
    line-height: 16px;
    font-size: 0;
    cursor: pointer;
  }

  .check {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #4f4f4f;
    background-color: transparent;
    vertical-align: middle;
  }

  .isCheck {
    background: #22a27f url("./done.png") center no-repeat;
    border-color: #22a27f;
  }

  .name {
    font-size: 14px;
    color: #17f0b5;
    display: inline-block;
    margin-left: 10px;
    vertical-align: middle;
  }
</style>
