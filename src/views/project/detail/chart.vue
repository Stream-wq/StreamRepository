<template>
  <div class="chart-page">
    <div data-target='itb-widget' :data-token-id='token' data-type='quick-view'></div>
  </div>
</template>

<script>
    export default {
        name: "chart",
        props: {
            token: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                //token:''
            }
        },
        created() {
            window.itb_widget=window.itb_widget||{init:t=>{const e=document.createElement("script");e.async=!0;e.type="text/javascript";e.src="https://app.intotheblock.com/widget.js";e.onload=function(){window.itbWidgetInit(t)},document.getElementsByTagName("head")[0].appendChild(e)}};

            window.itb_widget.init({
                apiKey: "44RcShYdGj8RFbojrYzTc8ATaBbBg2fl4GTFIYSD",
                language: this.$i18n.locale,
                options: {
                    loader: true
                }
            })
        }
    }
</script>

<style>
  .night-mode {
    background-color: #17181b;
  }

  .section-title{
    color:#fff !important;
  }
  .section-subtitle{
    color:#9b9b9b !important;
  }
  .itb-widget .summary{
    justify-content: space-between;
  }
  .itb-widget .summary .card-container{
    margin: 10px 5px;
    width: 30%;
    max-width: none !important;
    height: 130px !important;
    flex: none !important;
    padding: 0 !important;
  }
</style>
