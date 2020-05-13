<template>
  <!--充币-->
  <div class="area">
    <div class="wallet-basic">
      <div class="top row-pack-justify flex-align-center">
        <h2 class="title">{{$t('wallet.recharge')}}</h2>
      </div>
      <div class="form-page" :class="{'en':local=='en'}">
        <div class="input-group">
          <label>{{$t('wallet.selectToken')}}</label>
          <default-select :source="groupSource" class="input" :inputVal="chargeParams.name"
                          @select="onSelect"></default-select>
        </div>
        <div class="input-group">
          <label>{{$t('wallet.rechargeAddr')}}</label>
          <input type="text" class="input-txt input" v-model="address" readonly/>
          <span class="link" @click="onCopyUrl">{{$t('invite.copyUrl')}}</span>
        </div>
        <div class="input-group">
          <img v-if="address!=''"
               :src="`/bcbuyerapihttp/wallet/qrcode?content=${address}&width=143&height=143`"
               class=""/>
        </div>
      </div>
      <div class="tip-box" v-if="chooseSource">
        <p>*{{local=="en"?`Do not recharge any crypto-currency other than
          ${chargeParams.name} into the above address. Otherwise your asset will be
          lost.`:`请勿向上述地址充币任何非${chooseSource.name}资产，否则资产将不可找回。`}}</p>
        <p>{{$t('wallet.minRechart')}}{{chooseSource.minNum}}{{chooseSource.name}}</p>
        <p>{{local=="en"?`Confirmation needed by whole network after recharging using
          the address ${chooseSource.name}, transaction will complete after ${chooseSource.miniConfirm} network
          confirmations`:`使用${chooseSource.name}地址充币后，需要整个网络节点的确认，${chooseSource.miniConfirm}次网络确认后到账。`}}</p>
      </div>
    </div>
    <div class="table-page">
      <h2 class="page-title">{{$t('wallet.rechargeTab')}}</h2>
      <div class="table" v-if="rechargeSource.length>0">
        <ul class="th-header">
          <li class="w374">{{$t('TRT.time')}}</li>
          <li class="w374">币种数量</li>
          <li class="w374">充币状态</li>
        </ul>
        <div class="t-body">
          <ul class="t-row" v-for="(item,index) in rechargeSource">
            <li class="w374">{{item.date}}</li>
            <li class="w374">{{item.amount}}</li>
            <li class="w374">{{item.state}}</li>
          </ul>
        </div>
      </div>
      <Emp v-else :type="true">{{$t('common.noData')}}</Emp>
    </div>
    <el-pagination v-if="rechargeSource.length>0"
                   :page-size="page.pageSize" :pager-count="11" :current-page="page.pageNumber"
                   layout="prev, pager, next" @current-change="onPageChange"
                   :total="page.total">
    </el-pagination>
  </div>
</template>

<script>
    import DefaultSelect from '@/components/defaultSelect/defaultSelect'
    import Emp from '@/components/empty/empty'
    import {copyLink, formatDate} from "../../util/common";

    export default {
        name: "recharge",
        components: {DefaultSelect, Emp},
        data() {
            return {
                groupSource: [],
                chargeType: '',
                rechargeSource: [],
                page: {
                    pageSize: 20,
                    pageNumber: 1,
                    total: 0
                },
                chargeParams: {
                    id: "",
                    name: "",
                    chain: ''
                },
                local: this.$i18n.locale,
                address: '',
                chooseSource: null//选中的币种类型
            }
        },
        methods: {
            onPageChange(num) {
                this.page.pageNumber = num
                this.getRecordSource(this.chooseSource.name)
            },
            //获取币种数据
            getWalletSource() {
                let _self = this;
                _self.$get('/wallet/walletinfo?is_hide_small_currency=0', {}).then(res => {
                    if (res.code == 1) {
                        // _self.account = res.data.legal_total_price
                        let arr = []
                        res.data.accountList.map(item => {
                            arr.push({
                                id: item.id,
                                name: item.currency,
                                fullname: item.full_name,
                                minNum: item.min_deposit_amount,
                                miniConfirm: item.min_confirm
                            })
                        })

                        _self.groupSource = arr
// debugger
                        _self.chooseSource = arr.filter(item => item.id == _self.chargeParams.id)[0]
                        // _self.chargeType = arr[0].name
                    }
                })
            },
            //获取钱包地址
            getWalletAddress() {
                let _self = this;
                _self.$post('/wallet/walletaddress', {
                    chain: _self.chargeParams.chain,
                    currency: _self.chargeParams.name,
                }).then(res => {
                    if (res.code == 1) {
                        _self.address = res.data.address
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            onSelect(source) {
                this.chooseSource = source
                this.getRecordSource(source.name)
            },
            onCopyUrl() {
                copyLink(this.address)
                this.$toastMessage(this.$t('invite.copySuccess'))
            },
            //获取充币记录
            getRecordSource(name) {
                let _self = this;

                document.body.scrollTop = document.documentElement.scrollTop = 0;
                _self.$get('/wallet/rechargelist?currency=' + name + '&page=' + _self.page.pageNumber + '&size=' + _self.page.pageSize + '', {}).then(res => {
                    if (res.code == 1) {
                        let arr = []
                        res.data.info.list.map(item => {
                            arr.push({
                                state: item.state == 1 ? _self.$t('common.wancheng') : _self.$t('common.fail'),
                                date: item.update_time ? formatDate(item.update_time) : formatDate(item.create_time),
                                amount: item.amount
                            })
                        })
                        _self.rechargeSource = arr
                        _self.page.total = res.data.info.total
                    }
                })
            }
        },
        created() {

            let params = this.$route.query
            if (params) {
                this.chargeParams["id"] = params.id
                this.chargeParams["name"] = params.name
                this.chargeParams["chain"] = params.chain
            }
            this.getWalletSource()
            this.getWalletAddress()
            this.getRecordSource(params.name)
        }
    }
</script>

<style scoped lang="less">
  @import "wallet";
</style>
