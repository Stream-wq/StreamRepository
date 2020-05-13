<template>
  <!--专家评论的项目-->
  <div class="page">
    <Tabs class="tabs" :activeIndex="activeIndex" :menuList="menuList" @groupBy="onGroup"></Tabs>
    <div class="project-page">
      <template v-if="projectSource.length>0">
        <div class="project-item" v-for="(item,index) in projectSource">
          <div class="row-pack-justify flex-align-center">
            <div class="s-top">
              <img :src="item.imgLogo" class="avatar"/>
              <div class="txt">
                <p class="name">{{item.name}}</p>
                <p class="name">{{item.ticker}}</p>
              </div>
              <div :class="['video',item.video_url==''?'disable':'']" @click="onShowVideo(item.video_url)">
                {{item.video_url==''?$t('person.noVideo'):$t('person.checkVideo')}}
              </div>
            </div>
            <div class="button-box">
              <button class="client-button blue" v-if="isEdit" @click="onEdit(item)">{{$t('person.editAnlysis')}}
              </button>
              <router-link :to="`/Project/${item.pid}`" class="client-button">{{$t('common.details')}}</router-link>
            </div>
          </div>
          <div :class="['content',[item.contentExpan?'expan':'']]">{{item.contentExpan?item.adesc.substring(1,1500)+'...':item.adesc}}
            <span v-if="item.contentExpan"
                  class="cols"
                  @click="item.contentExpan=item.contentExpan?false:true">{{item.contentExpan?$t('project.expand'):$t('project.collapse')}}</span>
          </div>
          <div class="s-footer row-pack-justify flex-align-center">
            <span class="date">{{item.createDate}}</span>
            <div class="operation">
              <span class="zan" @click="setGood(item,1)"
                    :class="{'active':item.is_good==1}">({{item.good_count}})</span>
              <span class="down" @click="setGood(item,0)" :class="{'active':item.is_despise==1}">({{item.despise_count}})</span>
            </div>
          </div>
        </div>
      </template>
      <Emp v-else>{{$t('message.noDataTip')}}</Emp>
    </div>
    <el-pagination v-if="projectSource.length>0"
                   :page-size="page.pageSize" :pager-count="11" :current-page="page.pageNumber"
                   layout="prev, pager, next" @current-change="onPageChange"
                   :total="page.total">
    </el-pagination>

    <!--视频弹窗-->
    <el-dialog :visible.sync="htpShow" :title="$t('project.videoLink')" width="488px" top="0" :lock-scroll="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <p class="addr">{{htpAddr}}</p>
      <div slot="footer">
        <button class="client-button" @click="onCopyUrl">{{$t('project.copyUrl')}}</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import Tabs from '@/components/tabs/tabs'
    import Emp from '@/components/empty/empty'
    import {checkLogin, copyLink} from "../../../../util/common";

    export default {
        name: "projectpage",
        components: {Tabs, Emp},
        props: {
            personId: {
                type: String,
                default: ''
            },
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                activeIndex: 0,
                menuList: [
                    {title: 'input.statusAll', activeIndex: 0},
                    {title: 'project.applyBusinessTitle', activeIndex: 1},
                    {title: 'project.applyCodeTitle', activeIndex: 2},
                ],
                page: {
                    pageSize: 10,
                    pageNumber: 1,
                    total: 0
                },
                projectSource: [],
                empImg: require('@/assets/default.png'),
                htpShow: false,
                htpAddr: ''
            }
        },
        methods: {
            //获取专家下项目列表
            getProjectSource(pageNumber, pageSize) {
                let _self = this;

                document.body.scrollTop = document.documentElement.scrollTop = 0;
                _self.$post('/elites/getmyelitesanalysislist', {
                    elites_user_id: _self.personId,
                    page_index: pageNumber,
                    page_size: pageSize,
                    type_id: _self.activeIndex
                }).then(res => {
                    if (res.code == 1) {
                        let arr = []
                        res.data.listInfo.list.map(item => {
                            let innerSource = item.listAna[0]
                            arr.push({
                                pid: item.pid,
                                imgLogo: item.img_project_logo == "" ? _self.empImg : item.img_project_logo,
                                name: item.ico_name,
                                ticker: item.ticker,
                                createDate: innerSource.a_create_time,
                                adesc: innerSource.adesc,
                                video_url: innerSource.video_url,
                                despise_count: innerSource.despise_count,
                                good_count: innerSource.good_count,
                                is_good: item.is_like,
                                is_despise: item.is_dislike,
                                aid: innerSource.aid,
                                type_id: innerSource.a_type_id,
                                contentExpan: innerSource.adesc.length > 1500 ? true : false
                            })
                        })
                        _self.projectSource = arr
                        _self.page.total = res.data.listInfo.total
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            onGroup(index) {
                this.activeIndex = index
                this.page.pageNumber=1
                this.getProjectSource(this.page.pageNumber, this.page.pageSize)
            },
            onPageChange(num) {
                this.page.pageNumber = num
                this.getProjectSource(this.page.pageNumber, this.page.pageSize)
            },
            setGood(source, isGood) {
                if (checkLogin()) {
                    let _self = this;
                    _self.$post('/elites/setgood', {
                        aid: source.aid,
                        is_good: isGood,
                        pid: source.pid
                    }).then(res => {
                        if (res.code == 1) {
                            if (isGood == 1) {
                                source.good_count = source.good_count + 1
                                source.is_good = 1
                            } else {
                                source.despise_count = source.despise_count + 1
                                source.is_despise = 1
                            }
                        } else {
                            _self.$toastMessage(res.msg)
                        }
                    })
                }
            },
            onShowVideo(url) {
                if (url == "") return
                else this.htpShow = true
                this.htpAddr = url
            },
            onCopyUrl() {
                copyLink(this.htpAddr)
                this.htpShow = false
                this.$toastMessage(this.$t('invite.copySuccess'))
            },
            onEdit(item) {
                this.$emit("edit", item)
            }
        },
        created() {
            this.getProjectSource(this.page.pageNumber, this.page.pageSize)
        }
    }
</script>

<style scoped lang="less">
  @import "../../person";

  .tabs {
    margin: 26px 0;
  }
</style>
