<template>
  <div class="u-page area" v-if="projectSource!=null">
    <div class="basic-info">
      <div class="basic-top flex flex-direction-row flex-pack-justify">
        <div class="logo">
          <img :src="projectSource.img_project_logo?projectSource.img_domain+projectSource.img_project_logo:empImg"
               class="avatar"/>
          <p class="fullname">{{projectSource.ico_name}}</p>
        </div>
        <div class="info flex flex-direction-column flex-pack-center">
          <el-rate disabled show-score :colors="colors" disabled-void-color="#49475c"
                   v-model="rate"></el-rate>
          <div :class="['video',projectSource.videourl==''?'disable':'']" @click="onShowVideo(projectSource.videourl)">
            {{$t('project.projectVideo')}}
          </div>
          <div class="ft flex flex-direction-row flex-pack-justify">
            <div class="mess-link">
              <el-tooltip effect="dark" :content="$t('project.eye')" placement="top-start">
                <p class="link eye">{{projectSource.format_view_count}}</p>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('project.heart')" placement="top-start">
                <p :class="['link zan',isLogin&&projectSource.is_cart==1?'active':'']"
                   @click="clientLike(projectSource.is_cart)">
                  {{projectSource.format_like_count}}</p>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('project.tag')" placement="top-start">
                <p class="link tag">{{projectSource.format_tag_count}}</p>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('project.chart')" placement="top-start">
                <p class="link review">{{projectSource.format_professional_analysis_count}}</p>
              </el-tooltip>
            </div>
            <button :class="['client-button',projectSource.is_transaction==1?'err':'disable']"
                    @click="toShop(projectSource.is_transaction)">
              {{$t('project.buy')}}
            </button>
          </div>
        </div>
      </div>
      <div class="basic-content">
        <h2 class="tagTitle">{{$t('project.projectIntr')}}</h2>
        <div class="content">{{projectSource.pdesc}}</div>
      </div>
    </div>
    <Tabs :activeIndex="activeIndex" :menuList="menuList" @groupBy="onGroup" :tabsIndexHide="projectSource.is_show_itb==0?3:-1"></Tabs>
    <project-info v-if="activeIndex==0" :projectSource="projectSource"></project-info>
    <project-user v-if="activeIndex==1" :tagSource="tagPage.tagSource" :isShowMore.sync="tagPage.isShowMore"
                  :projectId="projectId"></project-user>

    <project-analysis v-if="activeIndex==2" :visible.sync="htpShow" :url.sync="htpAddr" :userInfo="userInfo"
                      :projectId="projectId" :busSource.sync="busSource" :busExpert="busParams" :codeExpert="codeParams"
                      :busAllSource.sync="busAllSource"
                      :codeAllSource.sync="codeAllSource" :busPage.sync="busPage" :codePage.sync="codePage"
                      :codeSource.sync="codeSource" :singleCodeVideo.sync="singleCodeVideo"
                      :isShowCodeUpdate="isShowCodeUpdate"
                      :isShowBusUpdate="isShowBusUpdate"
                      :singleBusVideo.sync="singleBusVideo"></project-analysis>
    <Chart :style="{'display':activeIndex==3?'block':'none'}" :token="projectSource.ticker"></Chart>
    <!--视频弹窗-->
    <el-dialog :visible.sync="htpShow" :title="$t('project.videoLink')" width="488px" top="0" :lock-scroll="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <p class="addr">{{htpAddr}}</p>
      <div slot="footer">
        <button class="client-button" @click="onCopyUrl">{{$t('project.copyUrl')}}</button>
      </div>
    </el-dialog>
    <!--kyc验证-->
    <el-dialog :visible.sync="checkShow" :title="$t('project.checkTitle')" width="318px" top="0" :lock-scroll="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <KYC :walletCheck="walletCheck"></KYC>
    </el-dialog>
  </div>
</template>

<script>
    import Tabs from '@/components/tabs/tabs'

    import ProjectInfo from './detail/projectInfo'
    import ProjectUser from './detail/projectUser'
    import ProjectAnalysis from './detail/analysis'
    import Chart from './detail/chart'
    import KYC from './dialog/kycCheck'


    import {checkLogin, copyLink} from '../../util/common'

    export default {
        name: "project",
        components: {Tabs, ProjectInfo, ProjectUser, ProjectAnalysis,Chart, KYC},
        data() {
            return {
                colors: ['#ffcd04', '#ffcd04', '#ffcd04'],
                rate: 0,
                activeIndex: 0,
                projectId: '',
                projectSource: null,
                htpShow: false,//视频弹窗控制开关
                htpAddr: '',//视频地址
                analyShow: false,
                checkShow: false,
                menuList: [
                    {title: 'project.renderProDes', activeIndex: 0},
                    {title: 'project.renderUser', activeIndex: 1},
                    {title: 'project.renderAnalysis', activeIndex: 2},
                    {title: 'project.renderSource', activeIndex: 3},
                ],
                tagPage: {
                    tagSource: [],//用户评论
                    isShowMore: false
                },
                walletCheck: {
                    kycStatus: 0,
                    passwordStatus: 0
                },
                empImg: require('@/assets/default.png'),
                busSource: [],
                codeSource: [],
                busAllSource: [],
                codeAllSource: [],
                busParams: null,
                codeParams: null,
                singleBusVideo: false,
                singleCodeVideo: false,
                isShowBusUpdate: false,
                isShowCodeUpdate: false,
                busPage: {
                    pageIndex: 1,
                    pageSize: 10,
                    isVideo: false,
                    total: 0
                },
                codePage: {
                    pageIndex: 1,
                    pageSize: 10,
                    isVideo: false,
                    total: 0
                },
            }
        },
        computed: {
            isLogin() {
                return this.$storage.get("isLogin")
            },
            userInfo() {
                return JSON.parse(this.$storage.get("userInfo"))
            }
        },
        methods: {
            onGroup(index) {
                this.activeIndex = index;
            },
            getProjectDetail() {
                let _self = this
                _self.$post('/project/detail', {pid: _self.projectId}).then(res => {
                    if (res.code == 1) {
                        _self.projectSource = res.data
                       // _self.projectSource['head_img']= _self.projectSource['head_img']===""?_self.empImg:_self.projectSource["img_domain"]+_self.projectSource['head_img']
                        _self.rate = Number(res.data.star.toFixed(2))
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            walletCheckMethod() {
                if (checkLogin(true)) {
                    let _self = this;
                    _self.$get('/wallet/withdrawcheck', {}).then(res => {
                        if (res.code == 1) {
                            _self.walletCheck.passwordStatus = res.data.is_set_transaction_password
                            _self.walletCheck.kycStatus = res.data.is_auth_kyc

                        } else {
                            _self.$toastMessage(res.msg)
                        }
                    })
                }
            },
            //去购买
            toShop(type) {
                if (type == 1) {
                    if (checkLogin()) {
                        if (this.walletCheck.passwordStatus == 1 && this.walletCheck.kycStatus == 1)
                            this.$router.push({
                                path: `/wallet/projectcheckout/${this.projectId}`,
                                query: {name: this.projectSource.ticker}
                            })
                        else this.checkShow = true
                    }
                }
            },
            //复制地址
            onShowVideo(url) {
                if (url.trim() == "") return
                else this.htpShow = true
                this.htpAddr = url
            },
            onCopyUrl() {
                copyLink(this.htpAddr)
                this.htpShow = false
                this.$toastMessage(this.$t('invite.copySuccess'))
            },

            //点赞项目
            clientLike(isFavorite) {
                let _self = this;
                if (checkLogin()) {
                    if (!isFavorite) {
                        _self.$post('/project/setmyico', {
                            pid: _self.projectId,
                            type_id: 1,
                            user_id: _self.userInfo.uid
                        }).then(res => {
                            if (res.code == 1) {
                                _self.projectSource.is_cart = 1
                                if (Number(_self.projectSource.format_like_count).toString() != "NaN") {
                                    _self.projectSource.format_like_count = Number(_self.projectSource.format_like_count) + 1
                                }
                                _self.$toastMessage(_self.$t('message.liked'))
                            } else {
                                _self.$toastMessage(err.msg)
                            }
                        })
                    } else {
                        _self.$toastMessage(_self.$t('message.liked'))
                    }
                }
            },

            //查看用户评论
            getTagSource() {
                let _self = this;
                _self.$post("/project/gettag", {pid: _self.projectId}).then(res => {
                    if (res.code == 1) {
                        let arr = []
                        res.data.projectTagBaseDataList.map(item => {
                            arr.push({
                                counter: item.counter,
                                tid: item.tid,
                                tagName: item.tag_name,
                                selected: item.is_mytag === 1 ? true : false
                            })
                        })
                        _self.tagPage.tagSource = arr
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },

            comebackSource(res) {
                let arr = []
                res.map(item => {
                    arr.push({
                        content: item.adesc,
                        aid: item.aid,
                        user_id: item.user_id,
                        create_time: item.create_time,
                        good_count: item.good_count,
                        despise_count: item.despise_count,
                        is_good: item.is_like,
                        is_despise: item.is_dislike,
                        head_figure: item.head_figure == "" ? this.empImg : item.img_domain + item.head_figure,
                        nick_name: item.nick_name == "" ? item.user_id : item.nick_name,
                        video: item.video_url,
                        contentExpan: item.adesc.length > 1500 ? true : false
                    })

                })
                return JSON.stringify(arr)
            },
            getAnalysisiSource(type, isVideo, pageIndex, pageSize, searchType) {
                let _self = this;
                _self.$post('/elites/getanalysislist', {
                    is_video: isVideo == true ? 1 : 0,
                    page_index: pageIndex,
                    page_size: pageSize,
                    pid: _self.projectId,
                    type_id: type
                }).then(res => {
                    if (res.code == 1) {
                        let arr = _self.comebackSource(res.data.listBaseRespList.list)
                        let newSource = []
                        JSON.parse(arr).map((item, index) => {
                            if (index < 2) {
                                newSource.push(item)
                            }
                        })
                        if (type == 1) {//业务分析
                            _self.busSource = newSource
                            if (_self.userInfo) {
                                let len = newSource.filter(item => item.user_id == _self.userInfo.uid)
                                if (len.length > 0 && res.data.is_show_update == 1) {
                                    _self.busParams = newSource[0]
                                }
                            }

                            if (typeof searchType == "undefined") {
                                _self.busPage.total = res.data.listBaseRespList.total
                                _self.busAllSource = JSON.parse(arr)
                            }
                            _self.isShowBusUpdate = res.data.is_show_update == 1 ? true : false
                        } else {
                            _self.codeSource = newSource
                            if (_self.userInfo) {
                                let len = newSource.filter(item => item.user_id == _self.userInfo.uid)
                                if (len.length > 0 && res.data.is_show_update == 1) {
                                    _self.codeParams = newSource[0]
                                }
                            }


                            if (typeof searchType == "undefined") {
                                _self.codePage.total = res.data.listBaseRespList.total
                                _self.codeAllSource = JSON.parse(arr)
                            }
                            _self.isShowCodeUpdate = res.data.is_show_update == 1 ? true : false
                        }
                    }
                })
            },
        },
        created() {
            if (this.$route.params.id) {
                this.projectId = this.$route.params.id
            }
            this.walletCheckMethod()
            this.getProjectDetail()
            this.getTagSource()

            this.getAnalysisiSource(1, false, this.busPage.pageIndex, this.busPage.pageSize)
            this.getAnalysisiSource(2, false, this.codePage.pageIndex, this.codePage.pageSize)


        },
        beforeDestroy() {
            window.document.body.style.overflow="auto"
        }
    }
</script>

<style scoped lang="less">
  @import "project";

  .el-rate__icon {
    font-size: 22px;
  }

  .title {
    font-size: 18px;
    color: #333333;
    line-height: 22px;
  }

  /*.g-page {*/
  /*  margin-top: -20px;*/
  /*  padding-bottom: 10px;*/
  /*}*/

  /*.group {*/
  /*  display: flex;*/
  /*  flex-direction: row;*/
  /*  justify-content: space-between;*/
  /*  align-items: center;*/
  /*  margin: 20px 0;*/

  /*  .name {*/
  /*    font-size: 16px;*/
  /*    color: #333;*/
  /*  }*/

  /*  .notLink {*/
  /*    font-size: 16px;*/
  /*    color: #22a27f;*/
  /*    width: 114px;*/
  /*    text-align: center;*/
  /*  }*/
  /*}*/
</style>
