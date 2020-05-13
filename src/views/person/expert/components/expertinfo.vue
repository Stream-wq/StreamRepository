<template>
  <!--完善专家信息表单-->
  <div class="form-page">
    <p class="cm-title">{{$t('person.formLinkedIn')}}</p>
    <div class="input-group">
      <input type="text" ref="url" maxlength="200" v-model="url" @input="onInput" class="radius-input"
             :placeholder="$t('person.linkedInPlaceholder')"/>
    </div>
    <p class="cm-title">{{$t('person.resume')}}</p>
    <div class="input-group">
      <p class="file-name" v-if="filename!=''">{{filename}} <i class="del" @click="onDel"></i></p>
      <div class="flex flex-direction-row flex-align-center">
        <el-button class="client-button blue" :loading="isLoading" :class="{'disable':filename!=''}">
          <input :disabled="isLoading || filename!=''" class="upfile" type="file"
                 @change="onChooseFile"
                 accept='.pdf'
                 title=" "/>
          {{$t('common.uploadTxt')}}
        </el-button>
        <p class="tip">{{$t('person.uploadTxt')}}</p>
      </div>
    </div>
    <p class="cm-title">{{$t('person.formSelfIntroduction')}}</p>
    <div class="input-group">
      <textarea ref="areaValue" v-model="areaValue" :placeholder="$t('person.introductionPlaceholder')"
                class="input-area"
                :maxlength="300" @input="onInput"></textarea>
    </div>
  </div>
</template>

<script>
    import uploadFile from "../../../../util/uploadFile";

    export default {
        name: "expertinfo",
        props: {
            params: {
                type: Object,
                default: null
            },
            isEmp: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                url: this.params.linkurl,
                areaValue: this.params.adesc,
                filename: this.params.filename,
                file: this.params.file,
                isLoading: false
            }
        },
        methods: {
            onInput() {
                if ((this.url.trim() == "" || this.areaValue.trim() == "") && (this.file == "" || this.areaValue.trim() == "")) {
                    this.$emit('update:isEmp', true)
                } else {
                    this.$emit("update:isEmp", false)
                }
            },
            onDel() {
                this.file = ''
                this.filename = ""
            },
            onChooseFile(event) {
                let _self = this;
                if (event.target.files[0].type.split('/')[1] != "pdf") {
                    _self.$toastMessage(_self.$t('common.uploadPDF'))
                    return
                }
                _self.isLoading = true
                uploadFile(event.target.files.item(0)).then(res => {
                    if(res.code==1){
                        _self.file = res.data
                        _self.filename = event.target.files[0].name
                    }else{
                        _self.$toastMessage(res.msg)
                    }

                    _self.isLoading = false
                })
            }
        }
    }
</script>

<style scoped lang="less">
  .form-page {
    margin-top: -20px;
  }

  .cm-title {
    font-size: 16px;
    color: #9d9d9d;
    margin: 14px 0;
  }

  .file-name {
    font-size: 16px;
    color: #22a27f;
    text-decoration: underline;
    line-height: 20px;

    .del {
      content: '';
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: url("../../../../assets/icon/del.png") center no-repeat;
      margin-left: 10px;
      vertical-align: middle;
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

  .input-area {
    height: 254px;
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
