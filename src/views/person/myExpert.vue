<template>
  <!--我的专家-->
  <div class="area expert-page clear">
    <div class="u-left">
      <router-link to="/personnel/experts" class="inner-nav" active-class="active-nav">{{$t('person.infoTab')}}
      </router-link>
      <router-link to="/personnel/favor" class="inner-nav" active-class="active-nav">{{$t('person.favTab')}}</router-link>
    </div>
    <div class="u-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
    export default {
        name: "myExpert"
    }
</script>

<style scoped lang="less">
  @import "person";
</style>
