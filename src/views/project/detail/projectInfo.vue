<template>
  <!--项目详情-->
  <div class="info-page current-page">
    <div class="c-group">
      <h2 class="tagTitle">{{$t('project.sales')}}</h2>
      <ul :class="['project-info',local=='en'?'en':'']">
        <li v-if="projectSource.ticker!=''"><label :class="{'single':nameArr.length==1}">{{$t('project.salesList.ticker')}}：</label>{{projectSource.ticker}}
        </li>
        <li v-if="projectSource.token_type!=''"><label :class="{'single':nameArr.length==1}">{{$t('project.salesList.tokenType')}}：</label>{{projectSource.token_type}}
        </li>
        <li v-if="projectSource.token_price.toString()!=''"><label :class="{'single':nameArr.length==1}">{{$t('project.salesList.price')}}：</label>{{projectSource.token_price}}
          USD
        </li>
        <li v-if="projectSource.available_for_token_sale.toString()!=''"><label :class="{'single':nameArr.length==1}">{{$t('project.salesList.ATS')}}：</label>{{projectSource.available_for_token_sale}}
        </li>
      </ul>
    </div>
    <div class="c-group" v-if="projectSource.list_team.length>0">
      <h2 class="tagTitle">{{$t('project.memberIntr')}}</h2>
      <div class="img-list">
        <div class="img-item" v-for="(item,index) in projectSource.list_team">
          <img :src="item.head_img==''?empImg:projectSource.img_domain+item.head_img" class="avatar" :key="index"/>
          <p class="name">{{item.uname}}</p>
        </div>
      </div>
    </div>
    <div class="c-group" v-if="urlList.length>0">
      <h2 class="tagTitle">{{$t('project.screenshots')}}</h2>
      <div class="project-img">
        <div class="img-item" v-for="(item,i) in urlList" @click="onPriview(i)">
          <img :src="projectSource.img_domain+item.img_url" class="img"/>
          <p class="name">{{item.name}}</p>
        </div>
      </div>
    </div>
    <div class="c-group" v-if="projectSource.officicl_web!=''||projectSource.img_white_paper!=''">
      <h2 class="tagTitle">{{$t('project.officicl')+' & '+$t('project.whitePaper')}} </h2>
      <div class="link-box">
        <a :href="projectSource.officicl_web" v-if="projectSource.officicl_web!=''" target="_blank">{{$t('project.officicl')}}</a>
        <a :href="projectSource.img_white_paper" v-if="projectSource.img_white_paper!=''" target="_blank">{{$t('project.whitePaper')}}</a>
      </div>
    </div>
    <div class="c-group" v-if="projectSource.listContact!=null">
      <h2 class="tagTitle">{{$t('project.otherLinks')}} </h2>
      <div class="target-link">
        <a v-for="item in projectSource.listContact" target="_blank" :href="item.contact_value"
           :class="['link logo-icon',item.contact_name]"></a>
      </div>
    </div>
    <div class="c-group" v-if="projectSource.listExchange.length>0">
      <h2 class="tagTitle">{{$t('project.exchanges')}} </h2>
      <div class="target-link">
        <template v-for="(item,index) in projectSource.listExchange">
          <a v-if="index<18" :href="item.exchange_url" target="_blank" class="link"><img
            :src="projectSource.img_domain+item.exchange_logo"/> </a>
        </template>

      </div>
    </div>
    <el-image-viewer v-if="showViewer" :url-list="imgList" :on-close="onViewClose"></el-image-viewer>
  </div>
</template>

<script>
    import ElImageViewer from '../../../../node_modules/element-ui/packages/image/src/image-viewer'

    export default {
        name: "basic",
        components: {ElImageViewer},
        props: {
            projectSource: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                local: this.$i18n.locale,
                showViewer: false,
                activeImgIndex: 0,
                urlList: this.projectSource.list_roadmap,
                nameArr: [],
                empImg: require('@/assets/emp_avatar.jpg'),
            }
        },
        computed: {
            imgUrlList: function () {
                let arr = []
                this.projectSource.list_roadmap.map(item => {
                    arr.push(this.projectSource.img_domain + item.img_url)
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
        methods: {
            onPriview(index) {
                this.showViewer = true
                this.activeImgIndex = index
            },
            onViewClose() {
                this.showViewer = false
            }
        },
        mounted() {
            if (this.projectSource) {
                if (this.projectSource.ticker != '')
                    this.nameArr.push(this.projectSource.ticker)
                if (this.projectSource.token_type != '')
                    this.nameArr.push(this.projectSource.token_type)
                if (this.projectSource.token_price.toString() != '')
                    this.nameArr.push(this.projectSource.token_price)
                if (this.projectSource.available_for_token_sale.toString() != '')
                    this.nameArr.push(this.projectSource.available_for_token_sale)
            }
        },
        created() {

        }
    }
</script>

<style scoped lang="less">
  @import "../project";
</style>
