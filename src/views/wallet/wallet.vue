<template>
  <div class="area">
    <div class="wallet-basic">
      <div class="top row-pack-justify flex-align-center">
        <h2 class="title">{{$t('wallet.totalAssets')}}</h2>
        <button v-if="!isLogin" class="client-button" @click="onLog">{{$t('wallet.createAccount')}}</button>
      </div>
      <p class="counter"><i class="fu">≈</i>{{isHide?'****':'$ '+account}} <i class="eye" @click="onHide"
                                                                              :class="{'bi':isHide}"></i></p>
    </div>
    <div class="wallet-list">
      <div class="row-pack-justify flex-align-center">
        <checkbox :label="$t('wallet.isShowSmallCurrency')" @check="onCheck"></checkbox>
        <search @search="onSearch" @input="onInput" ref="searchModel"></search>
      </div>

      <emp v-if="!isLogin">{{$t('message.noDataTip')}}</emp>

      <div class="line-table" v-else>
        <ul class="t-header">
          <li class="w280">{{$t('common.Currency')}}</li>
          <li class="w280">{{$t('wallet.canUse')}}</li>
          <li class="w180">{{$t('common.EstimatedAmount')}} $</li>
          <li class="w380">{{$t('wallet.matters')}}</li>
        </ul>
        <div class="tbody" v-if="truthSource.length>0">
          <ul class="row" v-for="(item,index) in truthSource">
            <li class="w280">
              <img :src="item.currency_img_url" class="logo"/>
              <span class="ticker">{{item.currency}}</span>
              <span class="fullname">({{item.full_name}})</span>
            </li>
            <li class="w280"><span class="value">{{item.available}}</span></li>
            <li class="w180"><span class="value">≈${{item.legal_price}}</span></li>
            <li class="w380">
              <span class="client" @click="toRecharge(item)">{{$t('wallet.recharge')}}</span>
              <span class="client" @click="onCheckKYC(1,item)">{{$t('wallet.withdraw')}}</span>
              <span class="client" v-if="item.is_transaction==1"
                    @click="onCheckKYC(2,item)">{{$t('wallet.buyTxt')}}</span>
            </li>
          </ul>
        </div>
        <emp v-else>{{$t('message.noDataTip')}}</emp>
      </div>
    </div>
    <!--kyc验证-->
    <el-dialog :visible.sync="checkShow" :title="$t('project.checkTitle')" width="318px" top="0" :lock-scroll="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false">
      <KYC :walletCheck="walletCheck"></KYC>
    </el-dialog>
  </div>
</template>

<script>
    import Search from '@/components/search/search'
    import Checkbox from '@/components/checkbox/checkbox'
    import Emp from '@/components/empty/empty'
    import KYC from '../project/dialog/kycCheck'
    import {checkLogin} from "../../util/common";

    export default {
        name: "wallet",
        components: {Search, Checkbox, Emp, KYC},
        data() {
            return {
                isHide: false,
                // searchVal: '',
                walletSource: [],
                isCheck: false,
                account: 0,
                truthSource: [],
                checkShow: false,
                walletCheck: {
                    kycStatus: 0,
                    passwordStatus: 0
                },
            }
        },
        computed: {
            isLogin: function () {
                return this.$storage.get("isLogin")
            }
        },
        methods: {
            onHide() {
                this.isHide = this.isHide ? false : true
            },
            onSearch(val) {
                let arr = []
                this.walletSource.filter(item => {
                    if (item.currency.toUpperCase().indexOf(val.toUpperCase()) != -1 || item.full_name.toUpperCase().indexOf(val.toUpperCase()) != -1)
                        arr.push(item)
                })
                this.truthSource = val.trim() == "" ? this.walletSource : arr
            },
            onCheck(check) {
                this.isCheck = check
                this.getWalletSource();
            },
            onLog() {
                this.$emit('update:dialog', true)
                this.$emit('update:dialogType', 'log')
            },
            onInput(v) {
                if (v == "") {
                    this.getWalletSource()
                }
            },
            getWalletSource() {
                let _self = this;
                _self.$get('/wallet/walletinfo?is_hide_small_currency=' + (_self.isCheck ? 1 : 0) + '', {}).then(res => {
                    if (res.code == 1) {
                        _self.account = res.data.legal_total_price
                        let arr = []
                        res.data.accountList.map(item => {
                            arr.push(item)
                        })
                        _self.walletSource = arr

                        if (_self.$refs.searchModel) {
                            _self.onSearch(_self.$refs.searchModel.inputVal)
                        }
                    }
                })
            },
            //kyc验证
            walletCheckMethod() {
                let _self = this;
                if (checkLogin()) {
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
            onCheckKYC(type, item) {//type==1提币，type==2购买
                if (this.walletCheck.passwordStatus == 1 && this.walletCheck.kycStatus == 1) {
                    if (type == 1) {
                        this.$router.push({
                            name: 'Withdraw', query: {
                                id: item.id,
                                name: item.currency,
                                chain: item.chain,
                            }
                        })
                    } else {
                        this.$router.push({path: `/wallet/projectcheckout/${item.pid}`, query: {name: item.currency}})
                    }
                } else {
                    this.checkShow = true
                }
            },
            toRecharge(item) {
                this.$router.push({
                    name: "Recharge",
                    query: {
                        name: item.currency,
                        id: item.id,
                        chain: item.chain
                    }
                })
            }
        },
        created() {
            if (this.isLogin) {
                this.getWalletSource()

                this.walletCheckMethod()
            }
        }
    }
</script>

<style scoped lang="less">
  @import "wallet";
</style>
