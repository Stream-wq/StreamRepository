<template>
  <!--购买-->
  <div class="area">
    <div class="wallet-basic">
      <div class="top row-pack-justify flex-align-center">
        <h2 class="title">{{$t('wallet.buyTxt')}} {{name}} </h2>
      </div>
      <div class="form-page" :class="{'en':local=='en'}">
        <div class="input-group">
          <label>{{$t('wallet.selectToken')}}</label>
          <input class="input input-txt" type="text" v-model="tokenAccept.ticker" readonly
                 :placeholder="$t('wallet.withdrawAddr_p')"
                 autocomplete="new-password"/>
        </div>
        <div class="c-group">
          <div class="input-group">
            <label>{{$t('wallet.upAmount')}}</label>
            <input class="input input-txt" v-model="form.amount" type="text"
                   @keyup="form.amount=form.amount.replace(/[^0-9.]/g, '')"
                   @input="onInput"
                   :placeholder="truthAmount" autocomplete="new-password"/>
            <span class="link" @click="setAll">{{$t('wallet.tabAll')}}</span>
          </div>
          <p class="tip">*{{$t('wallet.investmentQuantityDesc')}}</p>
        </div>
        <div class="input-group nomargin">
          <label>{{$t('wallet.ConversionRate')}}</label>
          <p class="result">1 {{tokenAccept.ticker}} = {{tokenAccept.scale}} {{name}}</p>
        </div>
        <div class="input-group nomargin">
          <label>{{$t('wallet.TotalTokensReceived')}}</label>
          <p class="result">{{buyAmount}}</p>
        </div>
      </div>
      <div class="form-page noborder" :class="{'en':local=='en'}">
        <div class="input-group">
          <label>{{$t('common.PIN')}}</label>
          <div class="input">
            <input class="input input-txt" type="password" v-model="form.password" @input="validForm"
                   :placeholder="$t('common.PIN_p')" maxlength="18"
                   autocomplete="new-password"/>
            <span @click="toSetPassword('wallet')" class="forget">{{$t('common.ForgottenPIN')}}</span>
          </div>
        </div>
        <div class="raio">
          <ex-radio class="left" @check="onCheck" :textStyle="textStyle" color="#ffffff">{{$t('common.agree')}}
          </ex-radio>
          <router-link tag="a" target="_blank" to="/rules" class="xservice">{{$t('project.agreeDes2')}}</router-link>
        </div>
      </div>
      <el-button :loading="isLoading" class="client-button" @click="onSubmit" :class="{'disable':isEmp}">
        {{$t('wallet.payTxt')}}
      </el-button>
    </div>
    <div class="table-page">
      <h2 class="page-title">{{$t('wallet.buyTab')}}</h2>
      <div class="table" v-if="checkoutSource.length>0">
        <ul class="th-header">
          <li class="w280">{{$t('wallet.buyListItem[0]')}}</li>
          <li class="w280">{{$t('wallet.buyListItem[1]')}}</li>
          <li class="w280">{{$t('wallet.buyListItem[2]')}}</li>
          <li class="w280">{{$t('wallet.buyListItem[3]')}}</li>
        </ul>
        <div class="t-body">
          <ul class="t-row" v-for="(item,index) in checkoutSource">
            <li class="w280">{{item.create_time}}</li>
            <li class="w280">{{item.buy_currency}}</li>
            <li class="w280">{{item.amount}}</li>
            <li class="w280">{{item.status==1?$t('wallet.success'):$t('wallet.fail')}}</li>
          </ul>
        </div>
      </div>
      <Emp v-else :type="true">{{$t('common.norecord')}}</Emp>
    </div>
    <el-pagination v-if="checkoutSource.length>0"
                   :page-size="page.pageSize" :pager-count="11" :current-page="page.pageNumber"
                   layout="prev, pager, next" @current-change="onPageChange"
                   :total="page.total">
    </el-pagination>

    <el-dialog v-if="success" :visible.sync="success" width="318px" top="0"
               :lock-scroll="false" :show-close="false" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <div class="success">
        <img src="@/assets/icon/success.png"/>
        <p>购买成功</p>
      </div>
      <div slot="footer" class="ft row-pack-justify">
        <router-link class="client-button" to="/" tag="a">返回首页</router-link>
        <router-link class="client-button" to="/wallet" tag="a">查看钱包</router-link>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import ExRadio from '@/components/radio/radio'
    import Emp from '@/components/empty/empty'

    export default {
        name: "shop",
        components: {ExRadio, Emp},
        data() {
            return {
                local: this.$i18n.locale,
                name: '',
                projectId: '',
                isLoading: false,
                isEmp: true,
                form: {
                    amount: "",
                    password: '',
                    isCheck: false,
                },
                textStyle: {
                    fontSize: '14px',
                    color: '#9d9d9d'
                },
                checkoutSource: [],
                page: {
                    pageNumber: 1,
                    pageSize: 20,
                    total: 0
                },
                tokenAccept: {
                    ticker: '',
                    scale: ''
                },
                walletSource: [],
                truthAmount: 0,
                buyAmount: 0,
                buy_currencyID: 0,
                currencyId: 0,
                success: false
            }
        },
        methods: {
            toSetPassword(clientType, type) {
                this.$storage.set('client', {
                    etype: type,
                    clientType: clientType,
                    expires: new Date().getTime()
                })
                this.$router.push(`/verify/${clientType}`)
            },
            validForm() {
                if (this.form.amount == "" || this.form.amount == 0 || !this.form.isCheck || this.form.password == "" || this.tokenAccept.ticker.trim() == "") this.isEmp = true
                else this.isEmp = false
            },
            setAll() {
                this.form.amount = this.truthAmount
                this.getAmount(this.form.amount)
                this.validForm()
            },
            onInput(event) {
                this.form.amount = this.form.amount.replace(/[^0-9.]/g, '')
                if (Number(this.form.amount).toString() != "NaN")
                    this.getAmount(this.form.amount)
                this.validForm()
            },
            onPageChange(num) {
                this.page.pageNumber = num
                this.getCheckoutSource()
            },
            onCheck(check) {
                this.form.isCheck = check
                this.validForm()
            },
            //获取购买记录
            getCheckoutSource() {
                let _self = this;

                document.body.scrollTop = document.documentElement.scrollTop = 0;
                _self.$get("/wallet/buylist?currency=" + _self.name + "&page=" + _self.page.pageNumber + "&size=" + _self.page.pageSize + "", {}).then(res => {
                    if (res.code == 1) {
                        let arr = []
                        res.data.info.list.map(item => {
                            arr.push(item)
                        })
                        _self.checkoutSource = arr
                        _self.page.total = res.data.info.total
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            //获取当前项目支持购买的币种
            getToken() {
                let _self = this;
                _self.$get("/project/tokenaccepts?pid=" + this.projectId + "", {}).then(res => {
                    if (res.code == 1) {
                        _self.tokenAccept['ticker'] = res.data[0].ticker
                        _self.tokenAccept['scale'] = res.data[0].scale
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            //获取币种
            getWalletSource() {
                let _self = this;
                _self.$get('/wallet/walletinfo?is_hide_small_currency=0', {}).then(data => {
                    if (data.code == 1) {
                        _self.account = data.data.legal_total_price
                        let arr = []
                        data.data.accountList.map(item => {
                            arr.push(item)
                        })
                        _self.walletSource = arr
                        let sour = arr.filter(item => _self.tokenAccept.ticker == item.currency)[0]
                        _self.truthAmount = Number(sour.available.replace(',', ''))
                        // _self.form.amount=_self.truthAmount
                        _self.currencyId = sour.id

                        _self.buy_currencyID = arr.filter(item => _self.name == item.currency)[0].id

                        // _self.getAmount(_self.truthAmount)
                    }
                })
            },
            //获取当前可兑换的代币
            getAmount(amount) {
                let _self = this;
                _self.$post("/wallet/tokenproportion", {
                    amount: amount == "" ? 0 : amount,
                    currency: _self.tokenAccept.ticker,
                    buy_currency: _self.name
                }).then(res => {
                    if (res.code == 1) {
                        _self.buyAmount = res.data.buy_amount
                    }
                })
            },
            onSubmit() {
                let _self = this;
                if (_self.isEmp) return
                _self.isLoading = true
                this.$post("/wallet/tokenbuy", {
                    amount: _self.form.amount,
                    buy_currency: _self.name.trim(),
                    buy_currency_id: _self.buy_currencyID,
                    currency: _self.tokenAccept.ticker,
                    currency_id: _self.currencyId,
                    pin: _self.form.password
                }).then(res => {
                    if (res.code == 1) {
                        // _self.success = true
                        _self.$toastMessage(_self.$t('wallet.buySuccess'))
                        setTimeout(() => {
                            _self.$toastMessage.close()
                            _self.success = false
                            _self.$router.go(0)
                        }, 1000)
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                    _self.isLoading = false
                })
            }
        },
        created() {
            if (this.$route.params) {
                this.projectId = this.$route.params.pid
                this.name = this.$route.query.name
            }
            this.getCheckoutSource()
            this.getWalletSource()
            this.getToken()

        }
    }
</script>

<style scoped lang="less">
  @import "wallet";

  .ft {
    .client-button {
      padding: 0 32px;
    }
  }

  .success {
    text-align: center;

    p {
      font-size: 16px;
      color: #333;
      margin-top: 20px;
      margin-bottom: 15px;
    }
  }
</style>
