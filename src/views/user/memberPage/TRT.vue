<template>
  <!--TRT-->
  <div class="trt-page">
    <div class="invite-banner flex flex-direction-column">
      <div class="box">
        <p class="score">{{score}} TRT</p>
        <button class="client-button" @click="onUnlock">{{$t('TRT.buttonText')}}</button>
      </div>
    </div>
    <div class="t-page">
      <div class="info-box">
        <p class="c-title">{{$t('TRT.usefulScore')}}</p>
        <div class="info">
          {{$t('TRT.usefulScoreDes')[0]}}<br/>
          {{$t('TRT.usefulScoreDes')[1]}}<br/>
          {{$t('TRT.usefulScoreDes')[2]}}
        </div>
        <em></em>
        <p class="c-title">{{$t('TRT.getScore')}}</p>
        <div class="info">
          {{$t('TRT.getScoreDes')[0]}}<br/>
          {{$t('TRT.getScoreDes')[1]}}
        </div>
      </div>
      <p class="c-title">{{$t('TRT.scoreDetail')}}</p>
      <div class="table" v-if="scoreList.length>0">
        <ul class="th-header">
          <li class="w280">{{$t('TRT.time')}}</li>
          <li class="w280">{{$t('TRT.matters')}}</li>
          <li class="w280">{{$t('TRT.integral')}}</li>
        </ul>
        <div class="t-body">
          <ul class="t-row" v-for="(item,index) in scoreList">
            <li class="w280">{{item.time}}</li>
            <li class="w280">{{item.item_info}}</li>
            <li class="w280">{{item.score}}</li>
          </ul>
        </div>
      </div>
      <Emp v-else>{{$t('common.noData')}}</Emp>
      <el-pagination v-if="scoreList.length>0"
                     :page-size="page.pageSize" :pager-count="11" :current-page="page.pageNumber"
                     layout="prev, pager, next" @current-change="onPageChange"
                     :total="page.total">
      </el-pagination>
    </div>

    <!--解锁-->
    <el-dialog :visible.sync="isLockPage" v-if="isLockPage" :title="$t('TRT.buttonText')+' TRT'" width="488px" top="0"
               :lock-scroll="false" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <unlock :count="score" @input="onCheckScore"></unlock>
      <div slot="footer">
        <el-button :class="['client-button',isEmp?'disable':'']" @click="onUnlockTRT" :loading="isLoading">{{$t('TRT.buttonText')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import Emp from '@/components/empty/empty'
    import Unlock from '../components/unlockTRT'

    export default {
        name: "TRT",
        components: {Emp, Unlock},
        data() {
            return {
                score: 0,
                scoreList: [],
                isLock: false,
                isLockPage:false,
                isEmp: true,
                isLoading:false,
                inputScore: 0,
                page: {
                    pageSize: 20,
                    pageNumber: 1,
                    total: 0
                },
            }
        },
        methods: {
            //获取用户信息
            getUserInfo() {
                let _self = this;
                _self.$get("/userinfo", {}).then(res => {
                    if (res.code == 1) {
                        _self.score = res.data.integral
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            //是否认证KYC
            getUserDraw() {
                let _self = this;
                _self.$get("/wallet/withdrawcheck", {}).then(res => {
                    if (res.code == 1) {
                        _self.isLock = res.data.is_auth_kyc == 0 ? false : true
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            //获取用户积分
            getScoreList(pageSize, pageNumber) {
                let _self = this;
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                _self.$post('/user/getintegralrecordlist', {
                    page_index: pageNumber,
                    page_size: pageSize
                }).then(res => {
                    if (res.code == 1) {
                        let arr = []
                        res.data.list.map(item => {
                            arr.push({
                                time: item.create_time,
                                item_info: item.item_info,
                                score: item.score
                            })
                        })
                        _self.page.total=res.data.total
                        _self.scoreList = arr
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            onPageChange(num) {
                this.page.pageNumber = num
                this.getScoreList(this.page.pageSize, this.page.pageNumber)
            },
            onCheckScore(score) {
                this.inputScore = score
                if (Number(score) > Number(this.score) || this.inputScore == 0 || this.inputScore == "") this.isEmp = true
                else this.isEmp = false
                // console.log(score)
            },
            onUnlock() {
                if (!this.isLock) {
                    this.$toastMessage(this.$t('TRT.kycCheck'))
                    return
                }
                this.isLockPage=true
            },
            onUnlockTRT(){
                let _self=this;
                if(_self.isEmp) return
                _self.isLoading=true
                _self.$post('/wallet/trtunlock',{
                    trt_amount:_self.inputScore.trim()
                }).then(res=>{
                    if(res.code==1){
                        _self.$toastMessage(_self.$t('TRT.toastText'));
                        _self.getUserInfo()
                        _self.getScoreList(this.page.pageSize, this.page.pageNumber)
                        _self.isLockPage=false
                    }else{
                        _self.$toastMessage(res.msg)
                    }
                    _self.isLoading=false
                })
            }
        },
        created() {
            this.getUserInfo()
            this.getUserDraw()
            this.getScoreList(this.page.pageSize, this.page.pageNumber)
        }
    }
</script>

<style scoped lang="less">
  @import "../user";
</style>
