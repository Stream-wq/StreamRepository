<template>
  <!--邀请好友-->
  <div class="invite-page">
    <div class="invite-banner">
      <img :src="bannerSrc"/>
    </div>
    <div class="member-page">
      <div class="copy-page">
        <p class="c-title">{{$t('invite.selfLink')}}</p>
        <div class="flex flex-direction-row flex-align-center">
          <input type="text" readonly v-model="selfLink" class="user-input"/>
          <p class="link" @click="onCopyLink">{{$t('invite.copyUrl')}}</p>
        </div>
        <p class="tip">*{{$t('invite.inviteDes3')}}</p>
      </div>
      <div class="table-page">
        <p class="c-title">{{$t('invite.hasInvite')}}</p>
        <div class="table" v-if="invitSource.length>0">
          <ul class="th-header">
            <li class="w50">{{$t('invite.account')}}</li>
            <li class="w50">{{$t('invite.time')}}</li>
          </ul>
          <div class="t-body">
            <ul class="t-row" v-for="(item,index) in invitSource">
              <li class="w50">{{item.account}}</li>
              <li class="w50">{{item.time}}</li>
            </ul>
          </div>
        </div>
        <Emp v-else>{{$t('common.noData')}}</Emp>
      </div>
      <el-pagination v-if="invitSource.length>0"
        :page-size="page.pageSize" :pager-count="11" :current-page="page.pageNumber"
        layout="prev, pager, next" @current-change="onPageChange"
        :total="page.total">
      </el-pagination>
    </div>



  </div>

</template>

<script>
    import Emp from '@/components/empty/empty'
    export default {
        name: "invite",
        components:{Emp},
        data() {
            return {
                local: this.$i18n.locale,
                selfLink: '',
                invitSource: [],
                page: {
                    pageSize: 20,
                    pageNumber: 1,
                    total: 0
                },
            }
        },
        computed: {
            bannerSrc() {
                let zh_src = require('@/assets/banner/invite_zh.jpg'), en_src = require('@/assets/banner/invite_en.png')
                return this.local == "zh" ? zh_src : en_src
            }
        },
        methods: {
            getSelfLink() {
                let _self = this;
                _self.$get('/user/getinvitecode', null).then(res => {
                    if (res.code == 1) {
                        _self.selfLink = location.origin + "?inviteCode=" + res.data.code
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            onCopyLink() {
                let oInput = document.createElement('input');
                oInput.value = this.selfLink;
                document.body.appendChild(oInput);
                oInput.select(); // 选择对象;
                document.execCommand("Copy"); // 执行浏览器复制命令
                this.$toastMessage(this.$t('invite.copySuccess'))
                oInput.remove()
            },
            //获取分享注册的用户
            getInvitePerson(pageNumber, pageSize) {
                let _self = this;

                document.body.scrollTop = document.documentElement.scrollTop = 0;
                _self.$post("/user/getinvitelist", {
                    page_index: pageNumber,
                    page_size: pageSize
                }).then(res => {
                    if (res.code == 1) {
                        let arr = []
                        res.data.list.map(item => {
                          arr.push({
                              account:item.email,
                              time:item.create_time
                          })
                        })
                        _self.page.total=res.data.total
                        _self.invitSource=arr
                    }else{
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            onPageChange(num) {
                this.page.pageNumber = num;
                this.getInvitePerson( this.page.pageNumber,this.page.pageSize,);
            }
        },
        created() {
            this.getSelfLink()
            this.getInvitePerson(this.page.pageNumber,this.page.pageSize)
        }
    }
</script>

<style scoped lang="less">
  @import "../user";
</style>
