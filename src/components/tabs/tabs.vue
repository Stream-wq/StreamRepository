<template>
  <div class="tabs-nav">
    <template v-for="(menu,i) in menuList">
      <span v-if="i!=tabsIndexHide" :class="['item',menu.activeIndex==index?'active':'']" @click="onClick($event,menu.activeIndex)">{{$t(menu.title)}}</span>
    </template>
  </div>
</template>

<script>
    export default {
        name: "tabs",
        props:{
            activeIndex:{
                type:Number,
                default:0
            },
            menuList:{
                type: Array,
                default: []
            },
            tabsIndexHide:{
                type:Number,
                default:-1
            }
        },
        data(){
            return{
               index:this.activeIndex
            }
        },
        methods:{
            onClick:function (e,index) {
                let _self=this;
                _self.index=index;
                // console.log(index)
                // this.$emit('update:activeIndex',index);
                // this.$emit("update:activeIndex",index)
                _self.$emit('groupBy',index);
            }
        },
        watch:{
            index:function (newVal, oldVal) {
                // debugger
                this.$emit("update:activeIndex",newVal)
            }
        }
    }
</script>

<style scoped>
  .tabs-nav .item {
    font-size: 18px;
    color: #fff;
    display: inline-block;
    margin-right: 44px;
    cursor: pointer;
    line-height: 18px;
  }

  .tabs-nav .item:hover, .tabs-nav .item.active {
    color: #17f0b5;
  }

  .tabs-nav .item:after, .tabs-nav .item:after {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    background-color: #17f0b5;
    margin-top: 10px;
    transition: all .3s;
    transform: scale(0, 1);
  }

  .tabs-nav .item:hover:after, .tabs-nav .item.active:after {
    transform: scale(1, 1);
  }
</style>
