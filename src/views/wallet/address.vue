<template>
  <!--地址薄-->
  <div class="area">
    <div class="address-page">
      <div class="top row-pack-justify flex-align-center">
        <div class="flex flex-direction-row flex-align-center">
          <h2 class="title">{{$t('wallet.addressTitle')}}</h2>
          <span class="link" @click="goback(1)">{{$t('common.backdraw')}}</span>
        </div>
        <button class="client-button" @click="onOpen">+ {{$t('wallet.title2')}}</button>
      </div>
      <div class="line-table">
        <ul class="t-header">
          <li class="w510">{{$t('wallet.withdrawUrl')}}</li>
          <li class="w280">{{$t('wallet.note')}}</li>
          <li class="w260">{{$t('wallet.matters')}}</li>
        </ul>
        <div class="tbody" v-if="addressSource.length>0">
          <ul class="row" v-for="(item,index) in addressSource">
            <li class="w510">{{item.mywallet_url}}</li>
            <li class="w280">{{item.memo}}</li>
            <li class="w260">
              <span class="link" @click="goback(2,item)">{{$t('common.selectAddr')}}</span>
              <span class="link err" @click="onDel(item.id,index)">{{$t('common.delete')}}</span>
            </li>
          </ul>
        </div>
        <Emp v-else :isIcon="true">{{$t('common.nowallet')}}</Emp>
      </div>
    </div>
    <!--地址表单-->
    <el-dialog v-if="addressShow" :visible.sync="addressShow" :title="$t('wallet.title2')" width="488px" top="0"
               :lock-scroll="false" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <edit-address ref="e_address" :isEmp.sync="isEmp"></edit-address>
      <div slot="footer">
        <el-button class="client-button" @click="onSubmit" :class="{'disable':isEmp}" :loading="isLoading">
          {{$t('common.saveTxt')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import Emp from '@/components/empty/empty'
    import EditAddress from './components/addressEdit'
    import {copyLink} from "../../util/common";

    export default {
        name: "addresspage",
        components: {Emp, EditAddress},
        data() {
            return {
                addressShow: false,
                addressSource: [],
                isEmp: true,
                isLoading: false,
                local: this.$i18n.locale,
                params: null
            }
        },
        methods: {
            //查询地址
            getAddressSource() {
                let _self = this;
                _self.$get('/wallet/withdrawaddresslist', {}).then(res => {
                    if (res.code == 1) {
                        let arr = []
                        res.data.info.list.map(item => {
                            arr.push(item)
                        })
                        _self.addressSource = arr
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            onOpen() {
                this.isEmp = true
                this.addressShow = true;
            },
            onSubmit() {
                let _self = this;
                if (_self.isEmp) return
                let form = _self.$refs['e_address']
                if (form.url.length != 42 || form.url.substring(0, 2) !== '0x') {
                    _self.$toastMessage(_self.local == 'en' ? 'Please enter correct address' : '请输入正确的地址')
                    return;
                }
                _self.isLoading = true
                _self.$post('/wallet/withdrawaddresscreate', {
                    memo: form.note,
                    mywallet_url: form.url
                }).then(res => {
                    if (res.code == 1) {
                        _self.$toastMessage(_self.$t('wallet.successful'))
                        _self.addressShow = false
                        _self.getAddressSource()
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                    _self.isLoading = false
                })
            },
            //删除地址
            onDel(id, index) {
                let _self = this;
                _self.$post('/wallet/withdrawaddressdel', {ids: id}).then(res => {
                    if (res.code == 1) {
                        _self.addressSource.splice(index, 1)
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            //返回提币页面
            goback(type, item) {//type==1直接返回，type==2
                if (this.params.id) {
                    if(type==2){
                        this.params['address']=item.mywallet_url
                    }
                    this.$router.replace({
                        name: 'Withdraw',
                        query: this.params
                    })
                } else {
                    window.history.go(-1)
                }
            }
        },
        created() {
            if (this.$route.query) {
                this.params = this.$route.query
            }

            this.getAddressSource()
        }
    }
</script>

<style scoped lang="less">
  @import "wallet";
</style>
