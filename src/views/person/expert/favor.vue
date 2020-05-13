<template>
  <!--喜欢的专家-->
  <div class="favor-page">
    <expert-page :is-favor="1" :emp="$t('common.noyet')"></expert-page>
  </div>
</template>

<script>
    import ExpertPage from './components/expertpage'

    export default {
        name: "favor",
        components: {ExpertPage}
    }
</script>

<style scoped>

</style>
