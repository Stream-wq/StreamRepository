<template>
  <!--项目分析-->
  <div class="analysis-page">
    <div class="current-page">
      <div class="m-title row-pack-justify">
        <div class="title-box flex flex-direction-row flex-align-center">
          <h2 class="tagTitle">{{$t('project.applyBusinessTitle')}}</h2>
          <ex-radio :isCheck.sync="singleBusVideo" @check="onParentGroupVideo(1,$event)">
            {{$t('project.videoAnalysis')}}
          </ex-radio>
        </div>
        <button class="client-button" v-if="busType==1012||busType==0" @click="onApply">
          {{$t('project.applyBusinessBtn')}}
        </button>
        <button class="client-button err" v-else-if="busType==3" @click="onApply">{{$t('project.reAudit')}}</button>
        <button class="client-button disable" v-else-if="busType==2">{{$t('project.willAudit')}}</button>
        <template v-else>
          <button class="client-button" v-if="!isShowBusUpdate" @click="showDialog(1)">{{$t('project.submitAnalysis')}}
          </button>
          <button class="client-button" v-else @click="showDialog(1)">{{$t('project.editAnalysis')}}</button>
        </template>
      </div>
      <div class="source-list" v-if="busSource.length>0">
        <div class="source-item" v-for="(item,index) in busSource" :key="index">
          <div class="row-pack-justify flex-align-center">
            <div class="s-top">
              <img :src="item.head_figure" class="avatar"/>
              <span class="name">{{item.nick_name}}</span>
              <router-link :to="`/personnel/detail/${item.user_id}`" class="toPerson">{{$t('project.viewExperts')}}
              </router-link>
            </div>
            <div class="video" v-if="item.video!=''" @click="copyUrl(item.video)">
              {{$t('project.projectVideo')}}
            </div>
          </div>
          <div :class="['content',[item.contentExpan?'expan':'']]">
            {{item.contentExpan?item.content.substring(1,1500)+'...':item.content}}
            <span v-if="item.contentExpan"
                  class="cols"
                  @click="item.contentExpan=item.contentExpan?false:true">{{item.contentExpan?$t('project.expand'):$t('project.collapse')}}</span>
          </div>
          <div class="s-footer row-pack-justify flex-align-center">
            <span class="date">{{item.create_time}}</span>
            <div class="operation">
              <span class="zan" @click="setGood(item,1,1)"
                    :class="{'active':item.is_good==1}">({{item.good_count}})</span>
              <span class="down" @click="setGood(item,0,1)" :class="{'active':item.is_despise==1}">({{item.despise_count}})</span>
            </div>
          </div>
        </div>
      </div>
      <Emp v-else>{{$t('message.noDataTip')}}</Emp>
      <p class="all" @click="busShow=busShow?false:true" v-if="busSource.length>0">{{$t('project.allAnalysis')}}</p>
    </div>
    <div class="current-page">
      <div class="m-title row-pack-justify">
        <div class="title-box flex flex-direction-row flex-align-center">
          <h2 class="tagTitle">{{$t('project.applyCodeTitle')}}</h2>
          <ex-radio :isCheck.sync="singleCodeVideo" @check="onParentGroupVideo(2,$event)">
            {{$t('project.videoAnalysis')}}
          </ex-radio>
        </div>
        <button class="client-button" v-if="codeType==1012||codeType==0" @click="onApply">
          {{$t('project.applyBusinessBtn')}}
        </button>
        <button class="client-button err" v-else-if="codeType==3" @click="onApply">{{$t('project.reAudit')}}</button>
        <button class="client-button disable" v-else-if="codeType==2">{{$t('project.willAudit')}}</button>
        <template v-else>
          <button class="client-button" v-if="!isShowCodeUpdate" @click="showDialog(2)">
            {{$t('project.submitAnalysis')}}
          </button>
          <button class="client-button" v-else @click="showDialog(2)">{{$t('project.editAnalysis')}}</button>
        </template>

      </div>
      <div class="source-list" v-if="codeSource.length>0">
        <div class="source-item" v-for="(item,index) in codeSource" :key="index">
          <div class="row-pack-justify flex-align-center">
            <div class="s-top">
              <img :src="item.head_figure" class="avatar"/>
              <span class="name">{{item.nick_name}}</span>
              <router-link :to="`/personnel/detail/${item.user_id}`" class="toPerson">{{$t('project.viewExperts')}}
              </router-link>
            </div>
            <div class="video" v-if="item.video!=''" @click="copyUrl(item.video)">
              {{$t('project.projectVideo')}}
            </div>

          </div>
          <div :class="['content',[item.contentExpan?'expan':'']]">
            {{item.contentExpan?item.content.substring(1,1500)+'...':item.content}}
            <span v-if="item.contentExpan"
                  class="cols"
                  @click="item.contentExpan=item.contentExpan?false:true">{{item.contentExpan?$t('project.expand'):$t('project.collapse')}}</span>
          </div>
          <div class="s-footer row-pack-justify flex-align-center">
            <span class="date">{{item.create_time}}</span>
            <div class="operation">
              <span class="zan" @click="setGood(item,1,2)"
                    :class="{'active':item.is_good==1}">({{item.good_count}})</span>
              <span class="down" @click="setGood(item,0,2)" :class="{'active':item.is_despise==1}">({{item.despise_count}})</span>
            </div>
          </div>
        </div>
      </div>
      <Emp v-else>{{$t('message.noDataTip')}}</Emp>
      <p class="all" @click="codeShow=codeShow?false:true" v-if="codeSource.length>0">{{$t('project.allAnalysis')}}</p>
    </div>
    <Drawer ref="bus" :show.sync="busShow">
      <drawer-page :source="busAllSource" :type="1" :pageIndex.sync="busPage.pageIndex" @showUrl="copyUrl"
                   @loadMore="onLoadMore(1)" :isCheck="busPage.isVideo" :role="busType" :isUpdate="isShowBusUpdate"
                   @groupSource="onGroupVideo($event,1)"></drawer-page>
    </Drawer>
    <Drawer ref="code" :show.sync="codeShow">
      <drawer-page :source="codeAllSource" :type="2" :pageIndex.sync="codePage.pageIndex" @showUrl="copyUrl"
                   @loadMore="onLoadMore(2)" :isCheck="codePage.isVideo" :role="codeType" :isUpdate="isShowCodeUpdate"
                   @groupSource="onGroupVideo($event,2)"></drawer-page>
    </Drawer>

    <!--分析-->
    <el-dialog v-if="analyShow" :visible.sync="analyShow" :title="$t('project.inputAnalysis')" width="560px"
               :lock-scroll="false" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <analysis-dialog ref="analyDialog" :params="analyParams" :isEmp.sync="dialogParams.isEmp"></analysis-dialog>
      <div slot="footer">
        <el-button :class="['client-button',dialogParams.isEmp?'disable':'']" @click="onSendAnalysis"
                   :loading="dialogParams.isLoading">
          {{$t('project.submitAnalysis')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import ExRadio from '@/components/radio/radio'
    import Drawer from '@/components/drawer/drawer'
    import DrawerPage from './drawerPage'
    import Emp from '@/components/empty/empty'
    import {checkLogin} from "../../../util/common";
    import AnalysisDialog from '../dialog/analysisDialog'

    export default {
        name: "analysis",
        components: {ExRadio, Drawer, DrawerPage, Emp, AnalysisDialog},
        props: {
            projectId: {
                type: String,
                default: ""
            },
            userInfo: {
                type: Object,
                default: {}
            },
            busSource: {
                type: Array,
                default: []
            },
            codeSource: {
                type: Array,
                default: []
            },
            busAllSource: {
                type: Array,
                default: []
            },
            codeAllSource: {
                type: Array,
                default: []
            },
            busPage: {
                type: Object,
                default: {}
            },
            codePage: {
                type: Object,
                default: {}
            },
            singleCodeVideo: {
                type: Boolean,
                default: false
            },
            singleBusVideo: {
                type: Boolean,
                default: false
            },
            isShowCodeUpdate: {
                type: Boolean,
                default: false
            },
            isShowBusUpdate: {
                type: Boolean,
                default: false
            },
            busExpert:{
                type:Object,
                default:null
            },
            codeExpert:{
                type:Object,
                default:null
            }
        },
        data() {
            return {
                analyShow: false,
                busShow: false,
                codeShow: false,
                busType: 1012,//当前账号状态：1012未提交申请，1审核通过（专家）,2审核中，3审核失败
                codeType: 1012,
                dialogParams: {
                    type: 1,
                    inputValue: '',
                    url: '',
                    isCheck: false,
                    isEmp: true,
                    isLoading: false,
                    isAllSearch: false,
                },
                analyParams: {
                    areaValue: '',
                    url: '',
                    id: ''
                },
            }
        },
        methods: {
            copyUrl(url) {
                this.$emit('update:visible', true)
                this.$emit("update:url", url)
            },
            //查询用户状态
            getAnalysisInfo() {
                let _self = this;
                _self.$post('/elites/getelitesinfo', {
                    user_id: _self.userInfo ? _self.userInfo.uid : ''
                }).then(res => {
                    if (res.code == 1 && res.data != null) {
                        _self.codeType = res.data.is_code_status
                        _self.busType = res.data.is_business_status
                    } else if (res.code == 1012) {
                        _self.codeType = _self.busType = res.code
                    }
                    if (res.code != 1 && res.code != 1012) {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            onParentGroupVideo(type, isVideo) {
                if (type == 1)
                    this.$emit("update:singleBusVideo", isVideo)
                else this.$emit("update:singleCodeVideo", isVideo)
                this.$parent.getAnalysisiSource(type, isVideo, 1, 2, 'single')
            },
            //抽屉筛选数据
            onGroupSource(type, isVideo, pageIndex, pageSize) {
                let _self = this;
                _self.$post('/elites/getanalysislist', {
                    is_video: isVideo == true ? 1 : 0,
                    page_index: pageIndex,
                    page_size: pageSize,
                    pid: _self.projectId,
                    type_id: type
                }).then(res => {
                    if (res.code == 1) {
                        let arr = JSON.parse(_self.$parent.comebackSource(res.data.listBaseRespList.list))
                        if (type == 1) {//业务分析
                            _self.$emit("update:busPage.total", res.data.listBaseRespList.total)
                            // _self.busPage.total = res.data.listBaseRespList.total
                            _self.$emit("update:busAllSource", _self.busAllSource.concat(arr))
                            // _self.busAllSource = _self.busAllSource.concat(arr)

                        } else {
                            _self.$emit("update:codePage.total", res.data.listBaseRespList.total)
                            // _self.codePage.total = res.data.listBaseRespList.total
                            // _self.codeAllSource = _self.codeAllSource.concat(arr)
                            _self.$emit("update:codeAllSource", _self.codeAllSource.concat(arr))
                        }
                    }
                })
            },
            onLoadMore(type) {
                let index = 1;
                if (type == 1) {
                    if (this.busPage.total == this.busAllSource.length || this.busAllSource.length < this.busPage.pageSize) {
                        this.$toastMessage(this.$t('common.nomore'))
                        return
                    }
                    this.busPage.pageIndex += 1
                    index = this.busPage.pageIndex
                } else {
                    if (this.codePage.total == this.codeAllSource.length || this.codeAllSource.length < this.codePage.pageSize) {
                        this.$toastMessage(this.$t('common.nomore'))
                        return
                    }
                    this.codePage.pageIndex += 1
                    index = this.codePage.pageIndex
                }
                this.onGroupSource(type, type == 1 ? this.busPage.isVideo : this.codePage.isVideo, index, 10)
            },
            //筛选有无视频
            onGroupVideo(check, type) {//type=1:业务分析，type=2：代码分析
                if (type == 1) {
                    this.busPage.isVideo = check
                    this.busPage.pageIndex = 1
                    this.$emit("update:busAllSource", [])
                } else {
                    this.codePage.isVideo = check
                    this.codePage.pageIndex = 1
                    this.$emit("update:codeAllSource", [])
                }
                this.onGroupSource(type, type == 1 ? this.busPage.isVideo : this.codePage.isVideo, 1, 10)
            },
            //申请
            onApply() {
                if (checkLogin()) {
                    //跳转页面
                    this.$router.push({path: '/personnel/experts'})
                }
            },
            showDialog(type, isAllSearch) {
                // debugger
                if (type == 1 && this.isShowBusUpdate) {
                    this.analyParams.id = this.busExpert.aid
                    this.analyParams.areaValue = this.busExpert.content
                    this.analyParams.url = this.busExpert.video

                    this.dialogParams.isEmp=false

                } else if (type == 2 && this.isShowCodeUpdate) {
                    this.analyParams.id = this.codeExpert.aid
                    this.analyParams.areaValue = this.codeExpert.content
                    this.analyParams.url = this.codeExpert.video

                    this.dialogParams.isEmp=false
                } else {
                    for (let item in this.analyParams) {
                        this.analyParams[item] = ""
                    }
                    this.dialogParams.isEmp=true
                }

                this.analyShow = true;
                this.dialogParams.type = type
                this.dialogParams.isAllSearch = typeof isAllSearch == "undefined" ? false : isAllSearch


            },
            //发表分析
            onSendAnalysis() {
                let _self = this;
                if (_self.dialogParams.isEmp) return
                _self.dialogParams.isLoading = false


                _self.$post('/elites/setanalysis', {
                    adesc: _self.$refs['analyDialog'].areaValue.trim(),
                    pid: _self.projectId,
                    aid: _self.analyParams.id,
                    type_id: _self.dialogParams.type,
                    video_url: _self.$refs['analyDialog'].url.trim()
                }).then(res => {
                    if (res.code == 1) {
//                         if (!_self.dialogParams.isAllSearch)
//                             _self.getAnalysisiSource(_self.dialogParams.type, _self.dialogParams.type == 1 ? _self.singleBusVideo : _self.singleCodeVideo, 1, 2)
//                         else {
//
//                             _self.onGroupSource(_self.dialogParams.type, _self.dialogParams.type == 1 ? this.busPage.isVideo : this.codePage.isVideo, 1, 10)
//                         }
// // else
                        // _self.onGroupSource(_self.dialogParams.type,)
                        _self.analyShow = false

                        _self.$router.go(0)
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                    _self.dialogParams.isLoading = false
                })
            },
            //点赞+踩
            setGood(source, isGood, type, isAll) {
                if (checkLogin()) {
                    let _self = this;
                    _self.$post('/elites/setgood', {
                        aid: source.aid,
                        is_good: isGood,
                        pid: _self.projectId
                    }).then(res => {
                        if (res.code == 1) {
                            if (isGood == 1) {
                                source.good_count = source.good_count + 1
                                source.is_good = 1
                            } else {
                                source.despise_count = source.despise_count + 1
                                source.is_despise = 1
                            }
                            if (isAll) {
                                if (type == 1) {
                                    _self.setStatus(_self.busSource, source.aid, isGood)
                                } else {
                                    _self.setStatus(_self.codeSource, source.aid, isGood)
                                }
                            } else {
                                if (type == 1) {
                                    _self.setStatus(_self.busAllSource, source.aid, isGood)
                                } else {
                                    _self.setStatus(_self.codeAllSource, source.aid, isGood)
                                }
                            }
                        } else {
                            _self.$toastMessage(res.msg)
                        }
                    })
                }
            },
            setStatus(source, id, isGood) {

                let v = source.filter(item => id == item.aid)
                if (v.length > 0) {
                    if (isGood == 1) {
                        v[0].good_count = v[0].good_count + 1
                        v[0].is_good = 1
                    } else {
                        v[0].despise_count = v[0].despise_count + 1
                        v[0].is_despise = 1
                    }
                }
            }
        },
        created() {
            this.getAnalysisInfo()
        },
    }
</script>

<style scoped lang="less">
  @import "../project";
</style>
