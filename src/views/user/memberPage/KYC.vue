<template>
  <!--KYC状态-->
  <div class="member-page">
    <div class="title-box">
      <h2 class="tagTitle">{{$t('common.kycStatus')}} ：<span
        :class="[kycStatus==1?'success':kycStatus==2?'gray':kycStatus==3?'error':'']">{{kycStatus==0?$t('common.noSubmit'):kycStatus==1?$t('common.submitPass'):kycStatus==2?$t('common.waitAudit'):$t('common.submitRefuse')}}</span>
      </h2>
      <p class="err" v-if="kycStatus==3&&reason!=''">{{$t('common.reasonTitle')+reason}}</p>
    </div>
    <div :class="['form-page',local=='en'?'en':'']">
      <div class="group">
        <label>{{$t('common.realName')}}</label>
        <span class="result-txt" v-if="kycStatus==1">{{realname}}</span>
        <input type="text" :readonly="kycStatus==2" class="user-input" @input="onCheckForm" v-else v-model="realname"/>
      </div>
      <div class="group">
        <label>{{$t('common.passportCode')}}</label>
        <span class="result-txt" v-if="kycStatus==1">{{ICcard}}</span>
        <input type="text" :readonly="kycStatus==2" class="user-input" @input="onCheckForm" v-else v-model="ICcard"/>
      </div>
      <div class="group">
        <label>{{$t('common.permanentAddress')}}</label>
        <span class="result-txt" v-if="kycStatus==1">{{address}}</span>
        <input type="text" :readonly="kycStatus==2" class="user-input" @input="onCheckForm" v-else v-model="address"/>
      </div>
      <div class="group">
        <label>{{$t('common.country')}}</label>
        <!--        <input type="text" class="user-input"/>-->
        <span class="result-txt" v-if="kycStatus==1">{{country}}</span>
        <div class="input-box" v-else ref="_kyc">
          <!--          <auto-search placeholder="请输入国家关键字" :readonly="kycStatus==2" :inputVal.sync="inputVal"-->
          <!--                       :groupSource="nationalSource" @select="onSelect"-->
          <!--                       @input="onCheckForm"></auto-search>-->
          <input type="text" readonly class="user-input country-num" @click="onSlide" v-model="country"/>
          <search-group class="search-group" :isShow.sync="isShowGroup" :groupSource="nationalSource" @choose="onSelect"
                        :pageStyle="pageStyle" :textStyle="textStyle"></search-group>
        </div>
      </div>
      <template v-if='country!="中国"&&country!="China"&&country!=""'>
        <div class="group upload-group">
          <div class="flex flex-direction-row">
            <div class="col">
              <label>{{$t('common.firstPage')}}</label>
              <div class="upload">
                <img v-if="imgList.img_passport_front!=''" :src="imgList.img_passport_front"/>
                <input type="file" title=" " ref="img_passport_front" @change="onChooseImg($event,'img_passport_front')"
                       accept="image/*"/>
                <i class="close" v-if="imgList.img_passport_front!=''&&kycStatus!=2&&kycStatus!=1"
                   @click="onDel($event,'img_passport_front')"></i>
              </div>
            </div>
            <div class="col">
              <label>{{$t('common.cover')}}</label>
              <div class="upload">
                <img v-if="imgList.img_passport_after!=''" :src="imgList.img_passport_after"/>
                <input type="file" title=" " ref="img_passport_after" @change="onChooseImg($event,'img_passport_after')"
                       accept="image/*"/>
                <i class="close" v-if="imgList.img_passport_after!=''&&kycStatus!=2&&kycStatus!=1"
                   @click="onDel($event,'img_passport_after')"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="group upload-group">
          <div class="flex flex-direction-row">
            <div class="col">
              <label>{{$t('common.passport')}}</label>
              <div class="upload">
                <img v-if="imgList.img_passport_hold!=''" :src="imgList.img_passport_hold"/>
                <input type="file" title=" " ref="img_passport_hold" @change="onChooseImg($event,'img_passport_hold')"
                       accept="image/*"/>
                <i class="close" v-if="imgList.img_passport_hold!=''&&kycStatus!=2&&kycStatus!=1"
                   @click="onDel($event,'img_passport_hold')"></i>
              </div>
            </div>
            <div class="col flex flex-direction-row">
              <label>{{$t('common.proofOfAddress')}}</label>
              <div class="upload">
                <img v-if="imgList.img_address!=''" :src="imgList.img_address"/>
                <input type="file" ref="img_address" title=" " @change="onChooseImg($event,'img_address')"
                       accept="image/*"/>
                <i class="close" v-if="imgList.img_address!=''&&kycStatus!=2&&kycStatus!=1"
                   @click="onDel($event,'img_address')"></i>
              </div>
              <p class="tip">*请将您的Tokenrank账号写在纸上并手持拍照</p>
            </div>
          </div>
        </div>
      </template>
      <div class="m-footer group" v-if="kycStatus!=1">
        <el-button :class="['save',kycStatus==2?'disable':'']" @click="onSubmit(0)">{{$t('common.saTxt')}}</el-button>
        <el-button :class="['commit',isEmp||kycStatus==2?'disable':'']" :loading="isLoading" @click="onSubmit(1)">{{
          country=="中国"||country=="China"?
          $t('common.nextTxt'):$t('common.submitTxt')}}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
    import AutoSearch from '@/components/autoSearch/autoSearch'
    import SearchGroup from '@/components/searchGroup/searchGroup'
    import {getCookie} from "../../../util/cookie";
    import uploadFile from "../../../util/uploadFile";

    export default {
        name: "KYC",
        components: {SearchGroup},
        data() {
            return {
                local: this.$i18n.locale,
                isShowGroup: false,
                address: "",
                ICcard: '',
                realname: '',
                country: '',
                areaCode: '',
                kycStatus: 0,
                reason: '',
                isEmp: true,
                isLoading: false,
                imgList: {
                    img_passport_after: '',//护照反面
                    img_passport_front: '',//护照正面
                    img_passport_hold: '',//手持护照
                    img_address: ''//手持书写资料
                },
                pageStyle: {
                    top: "50px",
                    backgroundColor: '#26253a',
                    borderColor: '#777'
                },
                textStyle:{
                    fontSize:"14px",
                    color:"#ccc"
                }
            }
        },
        computed: {
            nationalSource: function () {
                if (this.$store.state.nationalNum.length <= 0) {
                    this.$store.dispatch('getNationalSource')
                }
                return this.$store.state.nationalNum
            }
        },
        methods: {
            onCheckForm(v) {
                if (typeof v == "string") {
                    this.country = v
                }
                if (this.country != '中国' && this.country != "China") {
                    for (let item in this.imgList) {
                      //  this.imgList[item] = ""
                        if (this.imgList[item] == "") {
                            this.isEmp = true
                            return
                        }
                    }
                }
                if (this.address.trim() == "" || this.ICcard.trim() == "" || this.realname.trim() == "" || this.country.trim() == "") this.isEmp = true
                else this.isEmp = false

            },
            onSlide() {
              if(this.kycStatus!=2&&this.kycStatus!=1){
                  this.isShowGroup= this.isShowGroup?false:true

                  this.$refs['_kyc'].id="groupPage"
              }
            },
            onSelect(val) {
                this.country = val.name
                this.areaCode = val.areaCode
                // this.onCheckForm()
                if (val.name != '中国' && val.name != "China") {
                    for (let item in this.imgList) {
                          this.imgList[item] = ""
                    }
                }
            },
            onChooseImg(event, emp) {
                uploadFile(event.target.files.item(0)).then(res => {
                    this.imgList[emp] = res.data
                    this.onCheckForm()
                })

            },
            onDel(event, emp) {
                this.imgList[emp] = ""
                this.$refs[emp].value = ""
                this.onCheckForm()
            },
            onSubmit(status) {
                //status=0草稿,status=1提交
                //保存草稿
                let _self = this;
                if (status == 0) {
                    if (_self.kycStatus != 0 && _self.kycStatus != 3) {
                        return;
                    }
                } else {
                    if (_self.isEmp || _self.kycStatus == 2) return
                    _self.isLoading = true
                }

                _self.$post('/buyer/setceokyc', {
                    true_name: _self.realname.trim(),
                    auth_status: status,
                    passport_code: _self.ICcard.trim(),
                    address: _self.address.trim(),
                    img_passport_front: _self.imgList.img_passport_front,
                    img_passport_after: _self.imgList.img_passport_after,
                    img_passport_hold: _self.imgList.img_passport_hold,
                    img_address: _self.imgList.img_address.trim(),
                    country: _self.country
                }).then(res => {
                    if (res.code == 1) {
                        if (status == 0) {
                            _self.$toastMessage(_self.$t('common.saved'))
                        } else {
                            if (_self.country === "中国" || _self.country === "China" || _self.country === "1") {
                                _self.$get('/buyer/kyccheckurl?channel=pc', null).then(data => {
                                    _self.isLoading = false
                                    if (data.code == 1) {
                                        window.location.href = data.data.kyc_check_url;
                                    } else {
                                        _self.$toastMessage(data.msg)
                                    }
                                })
                            } else {
                                _self.$router.go(0)
                            }
                        }

                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })

            },
            getCeoKYC() {
                let _self = this;
                _self.$get('/buyer/getceokyc', null).then(res => {
                    if (res.code == 1) {
                        // debugger
                        // console.log(res.data)
                        _self.address = res.data.address
                        _self.ICcard = res.data.passport_code
                        _self.realname = res.data.true_name
                        _self.kycStatus = res.data.auth_status

                        let country = ""
                        if (_self.local == "zh") country = "中国"
                        else country = "China"

                        _self.country = res.data.country == "" ? country : res.data.country
                        _self.areaCode = res.data.area_code == "" ? "0086" : res.data.area_code
                        _self.reason = res.data.refuse_info
                        _self.imgList.img_address = res.data.img_address
                        _self.imgList.img_passport_after = res.data.img_passport_after
                        _self.imgList.img_passport_front = res.data.img_passport_front
                        _self.imgList.img_passport_hold = res.data.img_passport_hold

                        this.onCheckForm()
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            }
        },
        created() {
            this.getCeoKYC()

        }
    }
</script>

<style scoped lang="less">
  @import "../user";

  .country-num {
    display: block;
    height: 46px;
    line-height: 46px;
    border: 1px solid #777777;
    padding: 0 20px;
    border-radius: 5px;
    overflow: hidden;
    background: url("../../../assets/icon/white-down.png") no-repeat right 18px center;
  }
</style>
