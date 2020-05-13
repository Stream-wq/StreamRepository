<template>
  <!--地址编辑-->
  <div class="page">
    <p class="cm-title">{{$t('wallet.withdrawUrl')}}</p>
    <div class="input-group">
      <input type="text" ref="url" maxlength="42" v-model="url" @input="onInput" class="radius-input"
             :placeholder="$t('wallet.withdrawAddr_p')"/>
    </div>
    <p class="cm-title">{{$t('wallet.note')}}</p>
    <div class="input-group">
      <input type="text" ref="url" maxlength="500" v-model="note" @input="onInput" class="radius-input"
             :placeholder="$t('wallet.nodeTip')"/>
    </div>
  </div>
</template>

<script>
    export default {
        name: "addressEdit",
        props: {
            isEmp: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                url: '',
                note: ''
            }
        },
        methods: {
            onInput() {
                if (this.url.trim() == "") this.$emit("update:isEmp", true)
                else this.$emit("update:isEmp", false)
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
</style>
