<template>
  <div class="exp-basic" v-if="personInfo">
    <div class="row-pack-justify head flex-align-center">
      <div class="info-head">
        <img :src="personInfo.head_figure" class="avatar"/>
        <div class="info">
          <p class="name">{{personInfo.nick_name}}</p>
          <div class="client row-pack-justify">
            <span class="zan" :class="{'active':personInfo.is_like==1}"
                  @click="sendLike(1)">({{personInfo.good_count}})</span>
            <span class="join" :class="{'active':personInfo.is_favorite==1}"
                  @click="sendLike(2)">({{personInfo.follow_count}})</span>
          </div>
        </div>
      </div>
      <el-button v-if="isEdit" class="client-button blue" @click="onEdit">{{$t('person.editInfoBtn')}}</el-button>
    </div>
    <h4 class="tagTitle">{{$t('person.expertProcess')}}</h4>
    <div class="content">{{$t('person.expertTips')}} {{personInfo.business_auth_time}}</div>
    <h4 class="tagTitle">{{$t('person.intro')}}</h4>
    <div class="content">{{personInfo.introduction}}</div>
    <div class="counter-box">
      <div class="counter-item">
        <p class="num">{{personInfo.format_business_counter}}</p>
        <p class="txt">{{$t('common.busAnaly')}}</p>
      </div>
      <div class="counter-item">
        <p class="num">{{personInfo.format_code_counter}}</p>
        <p class="txt">{{$t('common.codeAnaly')}}</p>
      </div>
      <div class="counter-item">
        <p class="num">{{personInfo.format_good_counter}}</p>
        <p class="txt">{{$t('common.zanAnaly')}}</p>
      </div>
      <div class="counter-item">
        <p class="num">{{personInfo.format_follow_counter}}</p>
        <p class="txt">{{$t('common.favor')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
    import {checkLogin, copyLink} from "../../../../util/common";

    export default {
        name: "userInfo",
        props: {
            personId: {
                type: String,
                default: ''
            },
            isEdit: {
                type: Boolean,
                default: false
            },
            person: {
                type: Object,
                default: null
            },
            isGetSource: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                personInfo: {},
                empImg: require('@/assets/default.png'),
            }
        },
        methods: {
            //查询用户详情
            getPersonInfo() {
                let _self = this;
                _self.$post('/elites/getelitesinfo', {
                    user_id: _self.personId
                }).then(res => {
                    if (res.code != 1 && res.code != 1012) {
                        _self.$toastMessage(res.msg)
                    }
                    if (res.code == 1) {
                        _self.personInfo = res.data
                        _self.personInfo.nick_name = _self.personInfo.nick_name == "" ? res.data.user_id : _self.personInfo.nick_name
                        _self.personInfo.head_figure = _self.personInfo.head_figure == "" ||
                        _self.personInfo.head_figure == "https://img.tokenrank.co/" ? _self.empImg : _self.personInfo.head_figure

                        // _self.personInfo['contentExpan']=res.introduction.length>350?true:false
                    }
                })
            },
            //点赞专家+收藏专家
            sendLike(type) {
                if (checkLogin()) {
                    let _self = this;
                    _self.$post('/elites/seteliteslike', {
                        elites_user_id: _self.personId,
                        type_id: type
                    }).then(res => {
                        if (res.code == 1) {
                            if (type == 1) {
                                //点赞
                                _self.personInfo.good_count = _self.personInfo.good_count + 1

                                _self.personInfo.is_like = _self.personInfo.is_like == 1 ? 0 : 1
                            } else {
                                //收藏
                                _self.personInfo.follow_count = _self.personInfo.is_favorite == 1 ? _self.personInfo.follow_count - 1 : _self.personInfo.follow_count + 1

                                _self.personInfo.is_favorite = _self.personInfo.is_favorite == 1 ? 0 : 1
                            }
                        } else {
                            _self.$toastMessage(res.msg)
                        }
                    })
                }
            },
            onEdit() {
                this.$emit('click');
            }
        },
        created() {
            if (this.isGetSource) {
                this.getPersonInfo()
            } else {
                this.personInfo = this.person
            }
        }
    }
</script>

<style scoped lang="less">
  @import "../../person";
</style>
