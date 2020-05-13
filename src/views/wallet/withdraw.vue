<template>
  <!--提币-->
  <div class="area">
    <div class="wallet-basic">
      <div class="top row-pack-justify flex-align-center">
        <h2 class="title">{{$t('wallet.withdraw')}}</h2>
      </div>
      <div class="form-page" :class="{'en':local=='en'}">
        <div class="input-group">
          <label>{{$t('wallet.selectToken')}}</label>
          <default-select :source="groupSource" class="input" :inputVal="chargeParams.name"
                          @select="onSelect"></default-select>
        </div>
        <div class="input-group">
          <label>{{$t('wallet.withdrawUrl')}}</label>
          <input class="input input-txt" type="text" @input="validForm" v-model="form.address"
                 :placeholder="$t('wallet.withdrawAddr_p')" autocomplete="new-password"/>
          <span class="link" @click="toAddress">{{$t('wallet.addressTitle')}}</span>
        </div>
        <div class="input-group">
          <label>{{$t('wallet.number')}}</label>
          <input class="input input-txt" v-model="form.amount" type="text" title=" " @input="onInput"
                 @keyup="form.amount=form.amount.replace(/[^0-9.]/g, '')"
                 :placeholder="chooseSource?chooseSource.totalToken:''" autocomplete="new-password"/>
          <span class="link" @click="setAll">{{$t('wallet.tabAll')}}</span>
        </div>
        <div class="input-group">
          <label>{{$t('wallet.note')}}</label>
          <input class="input input-txt" type="text" v-model="form.remark" autocomplete="new-password"
                 :placeholder="$t('wallet.nodeTip')"/>
        </div>
        <div class="input-group nomargin">
          <label>{{$t('wallet.withdrawServiceCharge')}}</label>
          <p class="result" v-if="chooseSource">{{form.amount!=""?drawfree:chooseSource.withdraw_fee}} {{chooseSource.name}}</p>
        </div>
        <div class="input-group nomargin">
          <label>{{$t('wallet.arrivalAccount')}}</label>
          <p class="result">{{form.withdraw}} {{chooseSource?chooseSource.name:chargeParams.name}}</p>
        </div>
      </div>
      <div class="tip-box" v-if="chooseSource">
        <p>{{$t('wallet.tips_content_one')}}</p>
        <p>{{$t('wallet.tips_content_two')}}</p>
        <p>{{$t('common.minbi')}}{{chooseSource.min_withdraw_amount}} {{chooseSource.name}}</p>
      </div>
      <el-button class="client-button" :class="{'disable':isEmp}" @click="onDraw">
        {{$t('wallet.withdraw')}}
      </el-button>
    </div>
    <div class="table-page">
      <h2 class="page-title">{{$t('wallet.withdrawTab')}}</h2>
      <div class="table" v-if="withdrawSource.length>0">
        <ul class="th-header">
          <li class="w374">{{$t('TRT.time')}}</li>
          <li class="w374">{{$t('common.withdrawNum')}}</li>
          <li class="w374">{{$t('common.withdrawStatus')}}</li>
        </ul>
        <div class="t-body">
          <ul class="t-row" v-for="(item,index) in withdrawSource">
            <li class="w374">{{item.date}}</li>
            <li class="w374">{{item.amount}}</li>
            <li class="w374">{{item.state}}</li>
          </ul>
        </div>
      </div>
      <Emp v-else :type="true">{{$t('common.noData')}}</Emp>
    </div>
    <el-pagination v-if="withdrawSource.length>0"
                   :page-size="page.pageSize" :pager-count="11" :current-page="page.pageNumber"
                   layout="prev, pager, next" @current-change="onPageChange"
                   :total="page.total">
    </el-pagination>
    <!--交易密码-->
    <el-dialog v-if="pwdShow" :visible.sync="pwdShow" :title="$t('common.PIN')" width="560px" top="0"
               :lock-scroll="false" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <input type="password" class="radius-input" v-model="password" @input="onKeyPwd" autocomplete="new-password"
             :placeholder="$t('common.PIN_p')" maxlength="18"/>
      <div slot="footer">
        <el-button class="client-button" @click="onSubmit" :class="{'disable':isPwdEmp}" :loading="isLoading">
          {{$t('common.confrim')}}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    import DefaultSelect from '@/components/defaultSelect/defaultSelect'
    import Emp from '@/components/empty/empty'
    import {formatDate, formateNum} from "../../util/common";

    export default {
        name: "withdraw",
        components: {DefaultSelect, Emp},
        data() {
            return {
                local: this.$i18n.locale,
                groupSource: [],
                isEmp: true,
                isLoading: false,
                withdrawSource: [],
                chooseSource: null,
                page: {
                    pageSize: 20,
                    pageNumber: 1,
                    total: 0
                },
                chargeParams: {
                    id: "",
                    name: "",
                    chain: '',
                },
                pwdShow: false,
                password: '',
                isPwdEmp: true,
                form: {
                    address: '',
                    amount: "",
                    remark: '',
                    withdraw: '0'
                },
                drawfree:0
            }
        },
        methods: {
            onPageChange(num) {
                this.page.pageNumber = num
                this.getWithdrawSource(this.chooseSource.name)
            },
            onSelect(item) {
                this.chooseSource = item
                this.getWithdrawSource(item.name.trim())
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
                                chain: item.chain,
                                fullname: item.full_name,
                                minNum: item.min_deposit_amount,
                                miniConfirm: item.min_confirm,
                                withdraw_fee: 0,
                                min_withdraw_amount: item.min_withdraw_amount,
                                totalToken: Number(item.available.replace(',', ''))
                            })
                        })

                        _self.groupSource = arr
                        _self.chooseSource = arr.filter(item => item.id == _self.chargeParams.id)[0]
                    }
                })
            },
            getWithdrawSource(name) {
                let _self = this;

                document.body.scrollTop = document.documentElement.scrollTop = 0;
                _self.$get('/wallet/withdrawlist?currency=' + name + '&page=' + _self.page.pageNumber + '&size=' + _self.page.pageSize + '', {}).then(res => {
                    if (res.code == 1) {
                        let arr = []
                        res.data.info.list.map(item => {
                            let state = [-100, -1].indexOf(Number(item.state)) > -1 ?
                                _self.$t('common.audited') :
                                Number(item.state) == 4 ?
                                    "完成" :
                                    [0, 1, 2].indexOf(Number(item.state)) > -1 ? _self.$t('common.withdrawing') : "失败"
                            arr.push({
                                state: state,
                                date: item.update_time ? formatDate(item.update_time) : formatDate(item.create_time),
                                amount: item.amount
                            })
                        })
                        _self.withdrawSource = arr
                        _self.page.total = res.data.info.total
                    }
                })
            },
            //填充全部
            setAll() {
                this.form.amount = this.chooseSource.totalToken
                if (Number(this.form.amount) > this.chooseSource.totalToken) {
                    this.$toastMessage(this.$t('common.accountBalance'))
                    return
                }
                if (Number(this.form.amount) < Number(this.chooseSource.min_withdraw_amount)) {
                    this.$toastMessage(this.local == 'en' ? 'Below minimum withdrawal amount' : '提币数量太小')
                    return
                }
                this.calcAmount()
                this.validForm()
            },
            //计算实际到账
            calcAmount() {
                let _self = this;
                _self.$post("/wallet/withdrawcalculation", {
                    amount: _self.form.amount == "" ? 0 : _self.form.amount,
                    currency: _self.chooseSource.name,
                    id: _self.chooseSource.id
                }).then(res => {
                    if (res.code == 1) {
                        _self.form.withdraw = res.data.actual_arrival
                        _self.drawfree=res.data.withdraw_fee
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            validForm() {
                if (this.form.address == "" || this.form.amount == "") this.isEmp = true
                else this.isEmp = false
            },

            onInput() {
                this.form.amount = this.form.amount.replace(/[^0-9.]/g, '')
                if (Number(this.form.amount).toString() != "NaN")
                    this.calcAmount();
                this.validForm()
            },
            //提币
            onDraw() {
                let _self = this;
                if (Number(_self.form.amount) > _self.chooseSource.totalToken) {
                    _self.$toastMessage(_self.$t('common.accountBalance'))
                    return
                }
                if (Number(_self.form.amount) < Number(_self.chooseSource.min_withdraw_amount)) {
                    _self.$toastMessage(_self.local == 'en' ? 'Below minimum withdrawal amount' : '提币数量太小')
                    return
                }
                if (_self.isEmp) {
                    return
                }

                this.pwdShow = true
            },
            onKeyPwd() {
                if (this.password == "") this.isPwdEmp = true
                else this.isPwdEmp = false
            },
            //提交提币申请
            onSubmit() {
                let _self = this;
                if (_self.isPwdEmp) return

                _self.isLoading = true
                _self.$post("/wallet/withdrawcreate", {
                    amount: _self.form.amount,
                    chain: _self.chooseSource.chain,
                    currency: _self.chooseSource.name,
                    id: _self.chooseSource.id,
                    memo: _self.form.remark,
                    to_address: _self.form.address,
                    transaction_password: _self.password
                }).then(res => {
                    if (res.code == 1) {
                        _self.$toastMessage(_self.$t('common.withdrawSubmit'))
                        setTimeout(() => {
                            _self.$toastMessage.close();
                            _self.pwdShow = false
                            _self.$router.go(0)
                        }, 1000)
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                    _self.isLoading = false
                })
            },
            //去地址簿
            toAddress() {
                this.$router.push({
                    name: 'Address',
                    query: {
                        id: this.chooseSource.id,
                        name: this.chooseSource.name,
                        chain: this.chooseSource.chain,
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

                if (params.address) {
                    this.form.address = params.address
                }
            }
            this.getWalletSource()
            this.getWithdrawSource(params.name)
        }
    }
</script>

<style scoped lang="less">
  @import "wallet";

</style>
