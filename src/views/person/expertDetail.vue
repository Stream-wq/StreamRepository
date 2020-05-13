<template>
  <!--专家详情-->
  <div class="area">
    <user-info :person-id="personId"></user-info>
    <project-page :person-id="personId"></project-page>
  </div>
</template>

<script>
    import UserInfo from './expert/components/userInfo'
    import ProjectPage from './expert/components/projectpage'

    export default {
        name: "expertDetail",
        components: {UserInfo, ProjectPage},
        data() {
            return {
                personId: '',
            }
        },
        methods: {},
        created() {
            if (this.$route.params.id) {
                this.personId = this.$route.params.id
            }
        }
    }
</script>

<style scoped lang="less">
  @import "person";


</style>
