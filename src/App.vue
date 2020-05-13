<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
    import './assets/css/common.css'

    export default {
        name: 'App',
    }
</script>

<style scoped="less">
  #app {
    height: 100%;
    font-family: Helvetica, Arial, sans-serif, "Microsoft YaHei";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*text-align: center;*/
    /*color: #2c3e50;*/
    /*margin-top: 60px;*/
    min-width: 1124px;

  }

  .main-box {
  }

</style>
