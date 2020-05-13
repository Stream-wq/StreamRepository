<template>
  <!--用户评价-->
  <div class="user-page current-page">
    <div class="m-title row-pack-justify flex-align-center">
      <h2 class="tagTitle">{{$t('project.userVoice')}}</h2>
      <button class="client-button" @click="onComment">{{$t('project.userComment')}}</button>
    </div>
    <template v-if="truthSource.length>0">
      <div class="user-msg">
        <p :class="['item',item.selected?'active':'']" v-for="(item,index) in truthSource" @click="onTag(item)">
          {{item.tagName}}
          ({{item.counter}})</p>
      </div>
      <p class="all" @click="showMore" v-if="truthSource.length!=tagSource.length">{{$t('project.downAll')}}</p>
    </template>
    <Emp v-else>{{$t('message.noDataTip')}}</Emp>

    <!--用户评价-->
    <el-dialog v-if="commentShow" :visible.sync="commentShow" :title="$t('project.commentTitle')" width="488px" top="0"
               :lock-scroll="false"  :close-on-click-modal="false" :close-on-press-escape="false">
      <comment-dialog :err-msg="errMsg" @input="onInput" @check="onCheck"></comment-dialog>
      <div slot="footer">
        <el-button class="client-button" @click="sendTag" :class="{'disable':isEmp}" :loading="isLoading">
          {{$t('project.sendTxt')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {checkLogin} from "../../../util/common";
    import CommentDialog from '../dialog/commentDialog'
    import Emp from '@/components/empty/empty'

    export default {
        name: "projectUser",
        components: {CommentDialog, Emp},
        props: {
            projectId: {
                type: String,
                default: ""
            },
            tagSource: {
                type: Array,
                default: []
            },
            isShowMore: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                // tagSource: [],
                //  isShowMore: false,
                commentShow: false,//用户评价开关
                errMsg: '',
                isLoading: false,
                isEmp: true,
                inputValue: '',
                isCheck: false
            }
        },
        computed: {
            truthSource: function () {
                let arr = []
                if (this.isShowMore) {
                    arr = this.tagSource
                } else {
                    for (let i = 0; i < this.tagSource.length; i++) {
                        if (i < 30) {
                            arr.push(this.tagSource[i])
                        } else {
                            break
                        }
                    }
                }
                return arr
            }
        },
        methods: {
            //查看更多
            showMore() {
                this.$emit("update:isShowMore", this.isShowMore ? false : true)
            },
            onComment() {
                this.errMsg = ""
                this.isEmp = true
                if (checkLogin()) {
                    this.commentShow = true
                }
            },
            //点赞
            onTag(tag) {
                let _self = this;
                if (checkLogin()) {
                    _self.$post("/project/goodtag", {pid: _self.projectId, tid: tag.tid}).then(res => {
                        if (res.code == 1) {
                            tag.selected = tag.selected ? false : true
                            tag.counter = tag.selected ? tag.counter + 1 : tag.counter - 1
                        } else {
                            _self.$toastMessage(res.msg)
                        }
                    })
                }
            },
            onInput(val) {
                this.inputValue = val.trim()
                this.validForm()
            },
            onCheck(check) {
                this.isCheck = check
                this.validForm()
            },
            validForm() {
                if (this.inputValue.trim() == "" || !this.isCheck) this.isEmp = true
                else this.isEmp = false
            },
            sendTag() {
                let _self = this;
                if (_self.isEmp) return
                _self.isLoading = true
                _self.$post('/project/settag', {
                    pid: _self.projectId,
                    tag_name: _self.inputValue.trim()
                }).then(res => {
                    if (res.code == 1) {
                        _self.$toastMessage(_self.$t('message.sendTag'))
                        _self.tagSource.push({
                            counter: 0,
                            tid: res.data.tid,
                            tagName: _self.inputValue.trim(),
                            selected: false
                        })
                        _self.commentShow = false
                    } else {
                        _self.errMsg = res.msg
                    }
                    _self.isLoading = false
                })
            }
        },
        created() {
            // this.getTagSource()
        }
    }
</script>

<style scoped lang="less">
  @import "../project";
</style>
