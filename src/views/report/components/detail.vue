<template>
  <!--举报详情-->
  <div class="drawer-page">
    <div class="m-title">
      <img :src="header.logo" class="avatar"/>
      <span class="name">{{header.name}}</span>
    </div>
    <el-scrollbar id="scrollbar" v-if="source.length>0" :style="{'height':offsetHeight+'px'}">
      <div class="list">
        <div class="source-item" v-for="(item,index) in source">
          <div class="top row-pack-justify flex-align-center">
            <span class="account">{{item.email}}</span>
            <span class="date">{{item.date}}</span>
          </div>
          <div class="content">{{item.content}}</div>
          <div class="img-list" v-if="item.images.length>0">
            <img v-for="(img,i) in item.images" :src="img" @click="onShow(item.images,i)"/>
          </div>
        </div>
      </div>
      <p class="all" @click="onShowMore" v-if="source.length>10">{{$t('nav.more')}}</p>
    </el-scrollbar>
    <div class="flex-page" v-else :style="{'height':offsetHeight+'px'}">
      <Emp>{{$t('message.noDataTip')}}</Emp>
    </div>

    <el-image-viewer v-if="showViewer" :url-list="imgList" :on-close="onViewClose"></el-image-viewer>
  </div>
</template>

<script>
    import Emp from '@/components/empty/empty'
    import ElImageViewer from '../../../../node_modules/element-ui/packages/image/src/image-viewer'

    export default {
        name: "detail",
        props: {
            source: {
                type: Array,
                default: []
            },
            header: {
                type: Object,
                default: {}
            }
        },
        components: {Emp, ElImageViewer},
        computed: {
            offsetHeight: function () {
                let docHeight = document.documentElement.offsetHeight
                return docHeight - 96
            },
            imgUrlList: function () {
                let arr = []
                this.urlList.map(item => {
                    arr.push(item)
                })
                return arr
            },
            imgList: function () {
                let _self = this, urlList = _self.imgUrlList, arr = urlList;
                if (_self.activeImgIndex > 0) {
                    let prvArr = urlList.slice(0, _self.activeImgIndex),
                        nxtArr = urlList.slice(_self.activeImgIndex, urlList.length);
                    arr = nxtArr.concat(prvArr)
                }
                return arr
            }
        },
        data() {
            return {
                showViewer: false,
                urlList: [],
                activeImgIndex: 0,
            }
        },
        methods: {
            onShowMore() {
                this.$emit("loadMore")
            },
            onViewClose() {
                this.showViewer = false
            },
            onShow(images, index) {
                this.urlList = images
                this.activeImgIndex = index
                this.showViewer=true
            }
        }
    }
</script>
<style>
  .drawer-page .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
<style scoped lang="less">
  @import "../report";

  .list {
    padding: 0 40px;
  }

  .all {
    margin: 20px 0;
  }

  .flex-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
