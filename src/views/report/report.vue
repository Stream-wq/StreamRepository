<template>
  <!--举报-->
  <div class="report-page">
    <div class="banner-box">
      <div class="area">
        <div class="box">
          <img :src="txtUrl"/>
          <button class="client-button" @click="onDialog">{{$t('report.reportBannerbtn')}}</button>
        </div>
      </div>
    </div>
    <div class="area">
      <div class="page-top row-pack-justify flex-align-center">
        <i></i>
        <Search @search="onGroup" @input="onInput"></Search>
      </div>
      <div class="report-list" v-if="reportSource.length>0">
        <div class="report-item" v-for="(item,index) in reportSource">
          <div class="c-top row-pack-justify">
            <div class="avatar-box flex flex-direction-row flex-align-center">
              <img :src="item.logo" class="avatar"/>
              <span class="name">{{item.ico_name}}</span>
            </div>
            <button class="client-button" @click="onDraw(item)">{{$t('common.reportInfo')}}</button>
          </div>
          <div class="detail">
            <p class="item">{{$t('report.tokenName')}}<span>{{item.ticker==""?$t('common.noData'):item.ticker}}</span>
            </p>
            <p class="item">{{$t('report.website')}}<span>{{item.website==""?$t('common.noData'):item.website}}</span>
            </p>
          </div>
          <p class="p-name">{{$t('report.projectTxt')}}</p>
          <div class="content">{{item.content==""?$t('common.noData'):item.content}}</div>
        </div>
      </div>
      <Emp v-else>{{$t('common.noData')}}</Emp>
      <el-pagination v-if="reportSource.length>0"
                     :page-size="page.pageSize" :pager-count="11" :current-page="page.pageNumber"
                     layout="prev, pager, next" @current-change="onPageChange"
                     :total="page.total">
      </el-pagination>
    </div>

    <Drawer :show.sync="isDraw">
      <detail :header="drawHeader" :source="drawSource" @loadMore="onLoadMore"></detail>
    </Drawer>

    <!--添加举报-->
    <el-dialog v-if="dialog" :visible.sync="dialog" :title="$t('common.projectInfo')" width="560px" :lock-scroll="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <report-form ref="reportform" :isEmp.sync="isEmp"></report-form>
      <div slot="footer">
        <el-button :class="['client-button',isEmp?'disable':'']" @click="onReport"
                   :loading="isLoading">
          {{$t('report.reportNow')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import Search from '@/components/search/search'
    import Emp from '@/components/empty/empty'
    import Drawer from '@/components/drawer/drawer'
    import Detail from './components/detail'
    import ReportForm from './components/form'
    import {checkLogin} from "../../util/common";


    export default {
        name: "report",
        components: {Search, Emp, Drawer, Detail, ReportForm},
        data() {

            return {
                local: this.$i18n.locale,
                txtUrl: this.$i18n.locale == 'en' ? require('@/assets/banner/report_en.png') : require('@/assets/banner/report_zh.png'),
                reportSource: [],
                keywords: '',
                page: {
                    pageSize: 10,
                    pageNumber: 1,
                    total: 0
                },
                empImg: require('@/assets/default.png'),
                isDraw: false,
                drawPage: {
                    pageSize: 10,
                    pageNumber: 1,
                    total: 0
                },
                drawSource: [],
                drawHeader: {},
                dialog: false,
                isEmp: true,
                isLoading: false
            }
        },
        methods: {
            onGroup(value) {
                this.page.pageNumber=1
                this.keywords = value.trim()
                this.getReportSource()
            },
            onPageChange(num) {
                this.page.pageNumber = num
                this.getReportSource()
            },
            onInput(v) {
                if (v == ""){
                    this.keywords=""
                    this.getReportSource()
                }

            },
            //获取举报数据
            getReportSource: function () {
                let _self = this

                document.body.scrollTop = document.documentElement.scrollTop = 0;
                _self.$post("report/list", {
                    keywords: _self.keywords.trim()==""?"":_self.keywords,
                    page_index: _self.page.pageNumber,
                    page_size: _self.page.pageSize,
                }).then(res => {
                    if (res.code == 1) {
                        let arr = []
                        if (res.data != null) {
                            res.data.list.map(item => {
                                arr.push({
                                    content: item.pdesc,
                                    id: item.id,
                                    logo: item.p_logo == "" ? _self.empImg : 'https://img.tokenrank.co/' + item.p_logo,
                                    ticker: item.ticker,
                                    ico_name: item.ico_name,
                                    website: item.officicl_web
                                })
                            })
                            _self.page.total = res.data.total
                        } else {
                            _self.page.total = 0
                        }

                        _self.reportSource = arr

                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            //查看详情
            onDraw(item) {
                let _self = this;

                _self.drawSource = []
                _self.drawHeader.name = item.ico_name
                _self.drawHeader.logo = item.logo
                _self.drawHeader.id = item.id

                _self.getDrawSource(item.id)
            },
            //获取举报的具体信息
            getDrawSource(id) {
                let _self = this;
                _self.$post("/report/detail", {
                    page_index: _self.drawPage.pageNumber,
                    page_size: _self.drawPage.pageSize,
                    rid: id
                }).then(res => {
                    if (res.code == 1) {
                        let arr = []

                        res.data.list.map(item => {
                            arr.push({
                                content: item.content,
                                email: item.email,
                                date: item.create_time,
                                images: item.images == "" ? [] : item.images.split(',')
                            })
                        })
                        if (_self.drawSource.length > 0)
                            _self.drawSource.concat(arr)
                        else _self.drawSource = arr

                        _self.drawPage.total = res.data.total
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                    _self.isDraw = true
                })
            },
            //加载更多
            onLoadMore() {
                if (this.drawSource.length == this.drawPage.total) {
                    this.$toastMessage(this.$t('common.nomore'))
                    return
                }
                this.drawPage.pageNumber += 1
                this.getDrawSource(this.drawHeader.id)
            },
            //举报
            onDialog() {
                if (checkLogin()) {
                    this.dialog = true
                    this.isEmp = true
                }
            },
            onReport() {
                let _self = this, form = _self.$refs['reportform'];
                if (_self.isEmp) return
                let err = _self.$valid.email(form.email, _self.$t('common.emailTip'))
                if (err != "") {
                    this.$toastMessage(err)
                    return
                }
                _self.isLoading = true
                _self.$post("/report/add", {
                    content: form.content.trim(),
                    email: form.email.trim(),
                    ico_name: form.name.trim(),
                    images: form.files.toString(),
                    typeId: 1,
                    ticker: ''
                }).then(res => {
                    if (res.code == 1) {
                        _self.$toastMessage(_self.$t('report.successTip'))
                        _self.dialog = false
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                    _self.isLoading = false
                })
            }
        },
        created() {
            this.getReportSource()
        }
    }
</script>

<style scoped lang="less">
  @import "report";
</style>
