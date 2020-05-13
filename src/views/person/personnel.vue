<template>
  <!--人才首页-->
  <div class="person-page">
    <div class="banner-box">
      <div class="area">
        <div class="box">
          <div class="lg-word">{{$t('person.needAdvice')}}</div>
          <pre class="sm-word">{{$t('person.headInfo')}}</pre>
          <button class="client-button" @click="toExperts">
            {{isCheck?$t('person.experts'):$t('person.bannerButtonTxt')}}
          </button>
        </div>
      </div>
    </div>
    <div class="area">
      <expert-page :emp="$t('message.noDataTip')"></expert-page>
    </div>
  </div>
</template>

<script>
    import ExpertPage from './expert/components/expertpage'
    import {checkLogin} from "../../util/common";

    export default {
        name: "personnel",
        props:['dialog','dialogType'],
        components: {ExpertPage},
        data() {
            return {
                activeIndex: 0,
                menuList: [
                    {title: 'input.statusAll', activeIndex: 0},
                    {title: 'project.applyBusinessTitle', activeIndex: 1},
                    {title: 'project.applyCodeTitle', activeIndex: 2},
                ],
                searchVal: '',
                page: {
                    pageSize: 20,
                    pageNumber: 1,
                    total: 0
                },
                personSource: [],
                empUrl: require('@/assets/default.png'),
                isCheck: false
            }
        },
        computed: {
            userInfo() {
                return JSON.parse(this.$storage.get("userInfo"))
            }
        },
        methods: {

            //查询申请状态
            getAnalysisInfo() {
                let _self = this;
                _self.$post('/elites/getelitesinfo', {
                    user_id: _self.userInfo ? _self.userInfo.uid : ''
                }).then(res => {
                    if (res.code != 1 && res.code != 1012) {
                        _self.$toastMessage(res.msg)
                    }
                    if (res.code == 1) {
                        if (res.data.is_business_status == 1 || res.data.is_code_status == 1) {
                            _self.isCheck = true
                        } else _self.isCheck = false
                    }
                })
            },

            toExperts(){
                if(!this.$storage.get("isLogin")){
                    this.$emit('update:dialog',true)
                    this.$emit('update:dialogType','log')
                }else{
                    this.$router.push("/experts")
                }
            },
        },
        created() {
            if (checkLogin(true)) {
                this.getAnalysisInfo()
            }
           // this.getPersonSource('', this.page.pageSize, this.page.pageNumber);

        }
    }
</script>

<style scoped lang="less">
  @import "person";
</style>
