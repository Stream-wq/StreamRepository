<template>
  <!--活动-->
  <div class="img-page">
    <a @click="onHref(item.url)" class="box" v-for="(item,index) in imgList" :key="index" :style="{backgroundImage:'url('+item.img+')'}">
      <img class="img" :src="item.img"/>
    </a>
  </div>
</template>

<script>
    export default {
        name: "activity",
        data() {
            return {
                imgList: [],
                index: 0,
            }
        },
        methods: {
            getImgList() {
                let _self = this;
                _self.$get("/ac/getprojectevaluationdata?acitvity_id=" + _self.index + "&channel_type=2", {}).then(res => {
                    if (res.code == 1) {
                        let arr = []
                        res.data.map(item => {
                            arr.push({
                                img: item.img_url,
                                url: item.link_url
                            })
                        })
                        _self.imgList = arr
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })

            },
            onHref(url){
                if(url!=""){
                    window.open(url)
                }
            }
        },
        created() {
            if (this.$route.params) {
                this.index = this.$route.params.id
            }
            this.getImgList()
        }
    }
</script>

<style scoped lang="less">
  .img-page {
    font-size: 0;
    line-height: 0;
    min-width: 1124px;
    margin-bottom: -50px;

    .box {
      display: block;
      min-width:1124px;
      overflow: hidden;
      height: auto;
      background-position: center;
      background-repeat: no-repeat;
      .img {
        visibility: hidden;
        vertical-align: top;
      }
    }


  }

</style>
