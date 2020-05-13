<template>
  <!--用户中心-->
  <div class="area">
    <div :class="['menber-basic',local=='en'?'en':'']">
      <span :class="['u-img',isLoading?'isLoading':'']"> <img :src="figure"/><input :disabled="isLoading" type="file"
                                                                                    @change="onChooseImg"
                                                                                    accept="image/*"
                                                                                    title=" "/> </span>
      <div class="info">
        <span class="nick">{{nick==""?userInfo.uid:nick}}</span>
        <p class="link" @click="isNick=true">{{$t('common.nickTitle')}}</p>
      </div>
    </div>
    <div class="clear">
      <div class="u-left">
        <router-link to="/member/KYC" class="inner-nav" active-class="active-nav">{{$t('common.KYCTitle')}}
        </router-link>
        <router-link to="/member/TRT" class="inner-nav" active-class="active-nav">{{$t('TRT.title')}}</router-link>
        <router-link to="/member/invite" class="inner-nav" active-class="active-nav">{{$t('invite.title')}}</router-link>
        <router-link to="/member/security" class="inner-nav" active-class="active-nav">{{$t('common.account')}}</router-link>
      </div>
      <div class="u-content">
        <router-view></router-view>
      </div>
    </div>
    <!--修改昵称-->
    <el-dialog :visible.sync="isNick" v-if="isNick" :title="$t('common.nickTitle')" width="488px" top="0" :lock-scroll="false"
        :close-on-click-modal="false"       :close-on-press-escape="false">
      <modify-nick ref="modify" :placeholder="nick==''?userInfo.uid:nick"></modify-nick>
      <div slot="footer">
        <button class="client-button" @click="onModify">{{$t('common.saveTxt')}}</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import ModifyNick from './components/modifyNick'
    import uploadFile from "../../util/uploadFile";

    export default {
        name: "userCenter",
        components: {ModifyNick},
        data() {
            return {
                imgUrl: '',
                nickName:'',
                local: this.$i18n.locale,
                isNick: false,
                isLoading: false//图片上传
            }
        },
        computed: {
            userInfo: function () {
                return JSON.parse(this.$storage.get('userInfo'))
            },
            figure: function () {
                return this.imgUrl == "" ? this.userInfo.head_figure : this.imgUrl
            },
            nick:function () {
                return this.nickName == "" ? this.userInfo.nick_name : this.nickName
            }
        },
        methods: {
            //获取用户信息
            getUserInfo() {
                let _self = this;
                _self.$get("/userinfo", {}).then(res => {
                    if (res.code == 1) {
                        _self.nickName = res.data.nick_name
                        _self.imgUrl=res.data.head_figure

                        let params = {
                            uid: _self.userInfo.uid,
                            head_figure: _self.figure,
                            nick_name: _self.nick,
                        }
                        _self.$storage.set("userInfo", params)
                        _self.$bus.$emit("uInfo", params);

                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            onChooseImg(event) {
                let _self = this
                if (event.target.files[0].type.split('/')[0] != "image") {
                    _self.$toastMessage(_self.$t('common.wrongUpload'))
                    return
                }

                _self.isLoading = true
                uploadFile(event.target.files.item(0)).then(res => {
                    _self.imgUrl = res.data
                    _self.$post('/buyer/setheadfigure', {img_url: res.data}).then(data => {
                        if (data.code == 1) {
                            let params = {
                                uid: _self.userInfo.uid,
                                head_figure: res.data,
                                nick_name: _self.nick,
                            }
                            _self.$storage.set("userInfo", params)
                            _self.$bus.$emit("uInfo", params);
                        } else {
                            _self.$toastMessage(data.msg)
                        }
                        _self.isLoading = false
                    })
                })
            },
            //修改昵称
            onModify() {
                let _self = this, value = _self.$refs['modify'].$refs['nickname'].value
                if (value.length == 1) {
                    _self.$toastMessage(_self.$t('common.placeholder'))
                    return
                }
                let nickname = _self.userInfo.nick_name == "" ? _self.userInfo.uid : _self.userInfo.nick_name
                _self.$post('/buyer/setnickname', {
                    nickname: value == "" ? nickname : value
                }).then(res => {
                    if (res.code == 1) {
                        _self.nickName=value == "" ? nickname : value
                        let params = {
                            uid: _self.userInfo.uid,
                            head_figure: _self.figure,
                            nick_name: _self.nick,
                        }
                        _self.$storage.set("userInfo", params)
                        _self.$bus.$emit("uInfo", params);

                        _self.isNick = false

                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            }
        },
        created() {
            this.getUserInfo()
        }
    }
</script>

<style scoped lang="less">
  @import "user";
</style>
