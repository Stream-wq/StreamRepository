<template>
  <div class="g-page">
    <div class="group">
      <span class="name">{{$t('project.kycText')}}</span>
      <router-link to="/member" v-if="walletCheck.kycStatus==0" class="client-button">{{$t('project.noVerified')}}
      </router-link>
      <p class="notLink" v-else>{{$t('project.haveVerified')}}</p>
    </div>
    <div class="group">
      <span class="name">{{$t('project.PINText')}}</span>
      <router-link to="/salepwd" class="client-button" v-if="walletCheck.passwordStatus==0">
        {{$t('project.noVerified')}}
      </router-link>
      <p class="notLink" v-else>{{$t('project.haveVerified')}}</p>
    </div>
  </div>
</template>

<script>
    export default {
        name: "kycCheck",
        props:{
            walletCheck:{
                type:Object,
                default:null
            }
        }
    }
</script>

<style scoped lang="less">
  .g-page {
    margin-top: -20px;
    padding-bottom: 10px;
  }

  .group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;

    .name {
      font-size: 16px;
      color: #333;
    }

    .notLink {
      font-size: 16px;
      color: #22a27f;
      width: 114px;
      text-align: center;
    }
  }
</style>
