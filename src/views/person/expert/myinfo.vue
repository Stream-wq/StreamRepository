<template>
  <!--我的专家信息-->
  <div class="person-page">
    <div class="tabs-box row-pack-justify flex-align-center">
      <div class="item-box">
        <template v-if="busStatus!=1">
          <div class="tabs-item">
            <div class="box">
              <pre class="txt" :class="{'en':local=='en'}">{{$t('person.defaultBusTab')}}</pre>
              <button class="client-button" :class="{'disable':busStatus==2}" @click="onApply(1,busStatus)">
                {{busStatus==3?$t('person.btnTxt[3]'):busStatus==2?$t('person.btnTxt[2]'):
                $t('person.defaultButtonTxt')}}
              </button>
            </div>
          </div>

        </template>
        <p class="isBus" v-else :class="{'en':local=='en'}"></p>
      </div>
      <div class="item-box">
        <template v-if="codeStatus!=1">
          <div class="tabs-item">
            <div class="box">
              <pre class="txt" :class="{'en':local=='en'}">{{$t('person.defaultCodeTab')}}</pre>
              <button class="client-button" :class="{'disable':codeStatus==2}" @click="onApply(2,codeStatus)">
                {{codeStatus==3?$t('person.btnTxt[3]'):codeStatus==2?$t('person.btnTxt[2]'):
                $t('person.defaultButtonTxt')}}
              </button>
            </div>
          </div>

        </template>
        <p class="isCode" v-else :class="{'en':local=='en'}"></p>
      </div>
    </div>
    <div class="err-box row-pack-justify flex-align-center">
      <div class="item">
        <p class="err" v-if="busStatus==3">{{$t('person.refuseReson')}}：{{personInfo.business_status_refuse}}</p>
      </div>
      <div class="item">
        <p class="err" v-if="codeStatus==3">{{$t('person.refuseReson')}}：{{personInfo.code_status_refuse}}</p>
      </div>
    </div>
    <Emp v-if="busStatus!=1&&codeStatus!=1">{{$t('common.noAnaly')}}</Emp>
    <template v-else>
      <user-info v-if="personInfo" ref="userinfo" :person="personInfo" :isGetSource="false" :person-id="userInfo.uid"
                 :is-edit="true"
                 @click="onApply(0)"></user-info>
      <project-page :person-id="userInfo.uid" :is-edit="true" @edit="onEdit"></project-page>
    </template>

    <!--修改个人信息-->
    <el-dialog v-if="isDialog" :visible.sync="isDialog" :title="$t('person.formTitle')" width="560px" top="0"
               :lock-scroll="false" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <expert-info ref="expertinfo" :params="infoParams" :isEmp.sync="isEmp"></expert-info>
      <div slot="footer">
        <el-button class="client-button" :class="{'disable':isEmp}" @click="onSaveInfo">{{$t('person.saveBtn')}}
        </el-button>
      </div>
    </el-dialog>

    <!--修改分析-->
    <el-dialog v-if="analyShow" :visible.sync="analyShow" :title="$t('project.inputAnalysis')" width="560px"
               :lock-scroll="false" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <analysis-dialog ref="analyDialog" :params="analysisParams" :isEmp.sync="isEmp"></analysis-dialog>
      <div slot="footer">
        <el-button :class="['client-button',isEmp?'disable':'']" @click="onSendAnalysis"
                   :loading="isLoading">
          {{$t('project.submitAnalysis')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import Emp from '@/components/empty/empty'
    import ExpertInfo from './components/expertinfo'
    import UserInfo from './components/userInfo'
    import ProjectPage from './components/projectpage'
    import AnalysisDialog from '../../project/dialog/analysisDialog'

    export default {
        name: "myinfo",
        components: {Emp, ExpertInfo, UserInfo, ProjectPage, AnalysisDialog},
        data() {
            return {
                local: this.$i18n.locale,
                isDialog: false,
                busStatus: false,
                codeStatus: false,
                isEmp: true,
                analyShow: false,
                isLoading: false,
                personInfo: null,
                dialogType: 0,
                empImg: require('@/assets/default.png'),
                infoParams: {
                    linkurl: '',
                    file: '',
                    adesc: '',
                    filename: ''
                },
                analysisParams: {
                    areaValue: '',
                    url: '',
                }
            }
        },
        computed: {
            userInfo: function () {
                return JSON.parse(this.$storage.get("userInfo"))
            }
        },
        methods: {
            onSendAnalysis() {
                let _self=this;
                if(_self.isEmp) return
                _self.isLoading=true

                _self.$post('/elites/setanalysis', {
                    adesc:_self.$refs['analyDialog'].areaValue.trim(),
                    pid: _self.analysisParams.pid,
                    type_id: _self.analysisParams.type,
                    video_url: _self.$refs['analyDialog'].url.trim()
                }).then(res => {
                    if (res.code == 1) {

                        _self.analyShow = false

                        _self.$router.go(0)
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                    _self.isLoading = false
                })
            },
            //申请成为专家
            onApply(type, status) {
                if (status == 1) return
                this.isDialog = true

                this.dialogType = type
                if (type == 0 || status == 3) {
                    this.infoParams['linkurl'] = this.personInfo.linkedin
                    this.infoParams['file'] = this.personInfo.resume
                    this.infoParams['adesc'] = this.personInfo.introduction
                    this.infoParams['filename'] = this.personInfo.resume_name

                    this.isEmp = false

                } else {
                    for (let item in this.infoParams) {
                        this.infoParams[item] = ""
                        this.isEmp = true
                    }
                }
            },
            //保存个人信息
            onSaveInfo() {
                let _self = this;
                if (_self.isEmp) return
                let info = _self.$refs['expertinfo']
                _self.isLoading = true
                _self.$post('/elites/applyelits', {
                    introduction: info.areaValue.trim(),
                    linkedin: info.url.trim(),
                    resume: info.file,
                    resume_name: info.filename,
                    type_id: _self.dialogType
                }).then(res => {
                    if (res.code == 1) {

                        _self.$toastMessage(_self.dialogType == 0 ? _self.$t('common.modifySuccess') : _self.$t('common.applicationSubmit'))

                        if (_self.dialogType != 0) {
                            let timer = setTimeout(() => {
                                _self.$toastMessage.close()
                                _self.$router.go(0)

                            }, 1000)
                        } else {
                            _self.personInfo.introduction = info.areaValue
                        }

                        _self.isDialog = false
                    } else {
                        _self.$toastMessage(res.msg)
                    }

                    _self.isLoading = false
                })
            },
            //查询用户详情
            getPersonInfo() {
                let _self = this;
                _self.$post('/elites/getelitesinfo', {
                    user_id: _self.userInfo.uid
                }).then(res => {
                    if (res.code != 1 && res.code != 1012) {
                        _self.$toastMessage(res.msg)
                    }
                    if (res.code == 1) {

                        _self.personInfo = res.data

                        _self.busStatus = res.data.is_business_status
                        _self.codeStatus = res.data.is_code_status

                        _self.personInfo.nick_name = _self.personInfo.nick_name == "" ? res.data.user_id : _self.personInfo.nick_name
                        _self.personInfo.head_figure = _self.personInfo.head_figure == "" ||
                        _self.personInfo.head_figure == "https://img.tokenrank.co/" ? _self.empImg : _self.personInfo.head_figure

                    }
                })
            },
            //編輯分析
            onEdit(source) {
                let _self = this;
                _self.analyShow = true

                _self.analysisParams['url'] = source.video_url
                _self.analysisParams['areaValue'] = source.adesc

                _self.analysisParams['pid']=source.pid
                _self.analysisParams['type']=source.type_id

                this.isEmp = false
            }
        },
        created() {
            this.getPersonInfo()
        }
    }
</script>

<style scoped lang="less">
  @import "../person";
</style>
