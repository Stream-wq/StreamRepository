<template>
  <div class="drawer-page">
    <div class="m-title row-pack-justify flex-align-center">
      <div class="title-box flex flex-direction-row flex-align-center">
        <h2 class="tagTitle">{{$t('project.applyCodeTitle')}}</h2>
        <ex-radio :isCheck="isCheck" @check="onGroup">{{$t('project.videoAnalysis')}}</ex-radio>
      </div>
      <button class="client-button" v-if="role==1012||role==0" @click="onApply">{{$t('project.applyBusinessBtn')}}
      </button>
      <button class="client-button err" v-else-if="role==3" @click="onApply">{{$t('project.reAudit')}}</button>
      <button class="client-button disable" v-else-if="role==2">{{$t('project.willAudit')}}</button>
      <template v-else>
        <button class="client-button" v-if="!isUpdate" @click="onSend">{{$t('project.submitAnalysis')}}</button>
        <button class="client-button" v-else @click="onSend">{{$t('project.editAnalysis')}}</button>
      </template>

    </div>
    <el-scrollbar id="scrollbar" v-if="source.length>0" :style="{'height':offsetHeight+'px'}">
      <div class="source-list" v-if="source.length>0">
        <div class="source-item" v-for="(item,index) in source">
          <div class="flex row-pack-justify flex-align-center">
            <div class="s-top">
              <img :src="item.head_figure" class="avatar"/>
              <span class="name">{{item.nick_name}}</span>
              <router-link :to="`/personnel/detail/${item.user_id}`" class="toPerson">{{$t('project.viewExperts')}}
              </router-link>
            </div>
            <div class="video" v-if="item.video!=''" @click="onShowVideo(item.video)">
              {{$t('project.projectVideo')}}
            </div>
          </div>
          <div :class="['content',[item.contentExpan?'expan':'']]">{{item.contentExpan?item.content.substring(1,1500)+'...':item.content}}
            <span v-if="item.contentExpan"
                  class="cols"
                  @click="item.contentExpan=item.contentExpan?false:true">{{item.contentExpan?$t('project.expand'):$t('project.collapse')}}</span>
          </div>
          <div class="s-footer row-pack-justify flex-align-center">
            <span class="date">{{item.create_time}}</span>
            <div class="operation">
              <span class="zan" @click="setGood(item,1)" :class="{'active':item.is_good==1}">({{item.good_count}})</span>
              <span class="down" @click="setGood(item,0)" :class="{'active':item.is_despise==1}">({{item.despise_count}})</span>
            </div>
          </div>
        </div>
      </div>
      <p class="all" @click="onShowMore">{{$t('nav.more')}}</p>
    </el-scrollbar>
    <div class="flex-page" v-else :style="{'height':offsetHeight+'px'}">
      <Emp>{{$t('message.noDataTip')}}</Emp>
    </div>
  </div>
</template>

<script>
    import ExRadio from '@/components/radio/radio'
    import Emp from '@/components/empty/empty'

    export default {
        name: "drawerPage",
        components: {ExRadio, Emp},
        props: {
            source: {
                type: Array,
                default: []
            },
            type: {
                type: Number,
                default: 1
            },
            isCheck: {
                type: Boolean,
                default: false
            },
            role: {
                type: Number,
                default: 1012
            },
            isUpdate: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                htpShow: false,
                htpAddr: '',
                isVideo: false
            }
        },
        computed: {
            offsetHeight: function () {
                let docHeight = document.documentElement.offsetHeight
                return docHeight - 88
            }
        },
        methods: {
            listenScroll() {
                let let1 = document.getElementById("scrollbar").firstChild.scrollTop; //滚动条滚动距离
                let let2 = document.getElementById("scrollbar").firstChild.scrollHeight; //浏览器总高度
                let let3 = document.getElementById("scrollbar").scrollHeight;//浏览器可见高度

                if (let2 - let3 - let1 <= 0.05) {
                    //加载数据 alert(1)
                }
            },
            onShowMore() {
                this.$emit("loadMore")
            },
            //复制地址
            onShowVideo(url) {
                if (url == "") return
                else this.$emit("showUrl", url)
            },
            onGroup(check) {
                this.isVideo = check
                this.$emit("groupSource", check)
            },
            onApply() {
                this.$parent.$parent.onApply()
            },
            onSend() {
                this.$parent.$parent.showDialog(this.type, true)
            },
            setGood(source, isGood) {
                this.$parent.$parent.setGood(source, isGood,this.type,true)
            }
        },
        mounted() {
            // document
            //     .getElementById("scrollbar")
            //     .addEventListener("scroll", this.listenScroll, true);
        },
        created() {

        }
    }
</script>
<style>
  .drawer-page .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
<style scoped lang="less">
  @import "../project";

  .all {
    margin-bottom: 20px;
  }

  .flex-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
