<template>
  <!--联系客服-->
  <div class="area">
    <div class="user-page">
      <div class="pwd-header">{{$t('nav.contact')}}</div>
      <div class="page-form">
        <div class="input-group">
          <p class="title">{{$t('support.questionSort')}}</p>
          <div class="select" id="supportPage">
            <div class="input-box" @click="isSelected=isSelected?false:true">
              <input type="text" readonly v-model="type"/>
            </div>
            <div class="select-options" v-if="isSelected">
              <el-scrollbar style="height:100%">
                <p class="options" v-for="(item,index) in selectSource" @click="onSelect(item)">{{item}}</p>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <div class="input-group">
          <p class="title">{{$t('support.questionDes')}}</p>
          <textarea class="input-area input" maxlength="500" v-model="content" @input="validate" :placeholder="$t('support.leaveMsgTip')"></textarea>
        </div>
        <div class="input-group">
          <p class="title">{{$t('support.uploadPic')}}</p>
          <div class="file-box">
            <p class="file" v-for="(item,index) in fileNames">{{item}}<i class="del" @click="onDel(index)">{{$t('common.delete')}}</i></p>
          </div>
          <div class="flex flex-direction-row flex-align-center">
            <div class="client-button" :class="{'disable':files.length>=3}"><i class="upload"></i>{{$t('support.upload')}} <input type="file"
                                                                                                            title=" "
                                                                                                            :disabled="isLoading||files.length>=3"
                                                                                                            accept="image/*"
                                                                                                            @change="onChooseImg"/>
            </div>
            <p class="tips">{{$t('support.uploadPicTip')}}</p>
          </div>
        </div>
        <div class="input-group">
          <p class="title">{{$t('support.contactEmail')}}</p>
          <input class="input input-text" type="text" v-model="email" :placeholder="$t('common.emailTip3')" @input="validate"/>
          <p class="sm-tip">{{$t('support.questionTip3')}}</p>
        </div>
      </div>
      <div class="ft">
        <el-button class="client-button support-btn" @click="onSubmit" :class="{'disable':isEmp}">{{$t('common.submitTxt')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
    import uploadFile from "../../util/uploadFile";

    export default {
        name: "support",
        data() {
            return {
                isSelected: false,
                selectSource: [],
                type: '',
                fileNames: [],
                files: [],
                isLoading: false,
                isEmp: true,
                email: '',
                content: ''
            }
        },
        methods: {
            getSelectSource() {
                let _self = this;
                _self.$get('/nologon/marvel/questionitems', {}).then(res => {
                    if (res.code == 1) {
                        let arr = []
                        res.data.map(item => {
                            arr.push(item)
                        })
                        _self.type = arr[0]
                        _self.selectSource = arr
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            onSelect(item) {
                this.type = item
                this.isSelected = false
            },
            onChooseImg(event) {
                let _self = this;
                if (event.target.files[0].type.split('/')[0] != "image") {
                    _self.$toastMessage(_self.$t('common.wrongUpload'))
                    return
                }
                _self.isLoading = true
                uploadFile(event.target.files.item(0)).then(res => {
                    if (res.code == 1) {
                        _self.files.push(res.data)
                        _self.fileNames.push(event.target.files[0].name)
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                    _self.isLoading = false
                })
            },
            onDel(index) {
                this.fileNames.splice(index, 1)
                this.files.splice(index, 1)
            },
            validate() {
                if (this.email.trim() == "" || this.content.trim() == "") this.isEmp = true
                else this.isEmp = false
            },
            onSubmit(){
                let _self=this;
                if (_self.isEmp) return
                let err = _self.$valid.email(_self.email, _self.$t('common.emailTip'))
                if (err != "") {
                    this.$toastMessage(err)
                    return
                }

                _self.$post("/nologon/marvel/feedback",{
                    desc:_self.content,
                    email:_self.email,
                    pic:_self.files.toString(),
                    type:_self.type
                }).then(res=>{
                    if(res.code==1){
                        _self.$router.go(0)
                    }else{
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            eventListener(event){
                let sp = document.getElementById("supportPage")
                if (sp) {
                    if (!sp.contains(event.target)) {
                        this.isSelected=false
                    }
                }
            }
        },
        beforeRouteEnter(to, from, next) {
            window.document.body.style.backgroundColor = "#ffffff"
            next()
        },
        beforeRouteLeave(to, from, next) {
            window.document.body.style.backgroundColor = ""
            next()
        },
        created() {
            this.getSelectSource()
        },
        mounted() {
            window.document.body.addEventListener("click", this.eventListener)
        },
        beforeDestroy() {
            window.document.body.removeEventListener("click",this.eventListener)
        }
    }
</script>
<style>
  .select-options .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
<style scoped lang="less">
  @import "../user/user";
</style>
