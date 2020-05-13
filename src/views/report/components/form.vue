<template>
  <!--举报信息编辑-->
  <div class="page">
    <p class="cm-title">{{$t('report.report')}}</p>
    <div class="input-group">
      <input type="text" ref="url" v-model="name" @input="onInput" class="radius-input"
             :placeholder="$t('report.projectTip')"/>
    </div>
    <p class="cm-title">{{$t('report.reportContent')}}</p>
    <textarea maxlength="500" class="input-area" v-model="content" @input="onInput"
              :placeholder="$t('report.introductionPlaceholder')"></textarea>
    <p class="cm-title">{{$t('report.upEvidence')}}</p>
    <div class="flex flex-direction-row file-box">
      <p class="file-name" v-for="(item,index) in fileNames">{{item}} <i class="del" @click="onDel(index)"></i></p>
    </div>
    <div class="flex flex-direction-row flex-align-center">
      <el-button class="client-button blue" :loading="isLoading" :class="{'disable':files.length>=3}">
        <input :disabled="isLoading || files.length>=3" class="upfile" type="file"
               @change="onChooseFile"
               accept='image/*'
               title=" "/>
        {{$t('common.uploadTxt')}}
      </el-button>
      <p class="tip">{{$t('report.upTips')}}</p>
    </div>
    <p class="cm-title">{{$t('report.email')}}</p>
    <div class="input-group">
      <input type="text" ref="url" v-model="email" @input="onInput" class="radius-input"
             :placeholder="$t('common.emailTip3')"/>
    </div>
    <div class="raio">
      <ex-radio class="left" :isCheck="isCheck" @check="onCheck" color="#a0a0a0" :textStyle="textStyle">
        {{$t('project.agreeDes')}}
      </ex-radio>
      <router-link tag="a" target="_blank" to="/rules" class="xservice">{{$t('project.agreeDes2')}}</router-link>
    </div>
  </div>
</template>

<script>
    import ExRadio from '@/components/radio/radio'
    import uploadFile from "../../../util/uploadFile";

    export default {
        name: "reportform",
        components: {ExRadio},
        props: {
            isEmp: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                name: '',
                isLoading: false,
                email: '',
                content: '',
                isCheck: false,
                textStyle: {
                    fontSize: '14px',
                    color: "#9d9d9d"
                },
                files: [],
                fileNames: []
            }
        },
        methods: {
            onInput() {
                if (this.name.trim() == "" || !this.isCheck || this.content.trim() == "" || this.email.trim() == "") this.$emit('update:isEmp', true)
                else this.$emit('update:isEmp', false)
            },
            onDel(index) {
                this.fileNames.splice(index, 1)
                this.files.splice(index, 1)
            },
            onChooseFile(event) {
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
            onCheck(check) {
                this.isCheck = check
                this.onInput()
            }
        }
    }
</script>

<style scoped lang="less">
  .cm-title {
    font-size: 16px;
    color: #9d9d9d;
    margin: 14px 0;
  }

  .input-area {
    height: 184px;
  }

  .file-box {
    flex-wrap: wrap;
  }

  .file-name {
    font-size: 16px;
    color: #22a27f;
    text-decoration: underline;
    line-height: 22px;
    margin-right: 18px;

    .del {
      content: '';
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: url("../../../assets/icon/del.png") center no-repeat;
      margin-left: 10px;
      vertical-align: middle;
      cursor: pointer;
    }
  }

  .flex-direction-row {
    margin-top: 8px;
  }

  .blue {
    padding: 0 24px;
    position: relative;
    overflow: hidden;
  }

  .tip {
    font-size: 14px;
    margin-left: 15px;
    color: #9d9d9d;
  }

  .upfile {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
  }
</style>
