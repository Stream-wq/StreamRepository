<template>
  <div class="empty">
    <template v-if="!isIcon">
      <img src="./shop_emp.png" class="emp" v-if="type"/>
      <img src="./empty.png" class="emp" v-else/>
    </template>
    <p class="txt">
      <slot></slot>
    </p>

  </div>
</template>

<script>
    export default {
        name: "empty",
        props:['type','isIcon']
    }
</script>

<style scoped>
  .empty{
    margin-top: 88px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 110px;
  }
  .txt{
    font-size: 16px;
    color:#9d9d9d;
    margin-top: 26px;
    line-height: 26px;
    white-space: pre-line;
  }
</style>
