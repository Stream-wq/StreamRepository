<template>
  <div class="banner-box">
    <el-carousel height="340px">
      <el-carousel-item v-for="(item,index) in bannerList" :key="index">
        <div class="banner-item" :style="{backgroundImage:'url('+item.img+')'}" @click="onClick(item)"></div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
    export default {
        name: "banner",
        props: {
            bannerList: {
                type: Array,
                default: []
            }
        },
        data() {
            return {}
        },
        methods:{
            onClick(item){
                this.$emit("click",item)
            }
        }
    }
</script>
<style>
  .el-carousel__arrow {
    display: none;
  }

  .el-carousel__indicators--horizontal {
    bottom: 20px;
    transform: translateX(0);
  }

  .el-carousel__indicator--horizontal {
    padding: 0 6px;
  }

  .el-carousel__button {
    width: 10px;
    height: 10px;
    background-color: #fff;
    opacity: 1;
    transition: width .4s;
    border-radius: 5px;

  }

  .el-carousel__indicator.is-active button {
    width: 29px;
  }
</style>
<style scoped>
  .banner-box {
    width: 100%;
    min-width: 1124px;
    position: relative;
    z-index: 2;
    height: 340px;
    overflow: hidden;
  }

  .banner-box .banner-item {
    height: 340px;
    /*background-image: url("../../assets/banner.jpg");*/
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    cursor: pointer;
  }


</style>
