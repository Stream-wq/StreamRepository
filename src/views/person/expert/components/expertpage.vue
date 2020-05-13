<template>
  <!--专家列表-->
  <div class="page">
    <div class="page-top flex flex-direction-row flex-pack-justify">
      <Tabs :activeIndex="activeIndex" :menuList="menuList" @groupBy="onGroup"></Tabs>
      <Search ref="searchModel" @input="onInput" @search="onSearch"></Search>
    </div>
    <div class="person-list clear" v-if="personSource.length>0">
      <div class="person-item" v-for="(item,index) in personSource">

        <router-link :to="`/personnel/detail/${item.user_id}`">
          <div class="person-head">
            <img :src="item.head_figure" class="avatar" @click="href(item.user_id)"/>
            <div class="info">
              <p class="name" @click="href(item.user_id)">{{item.nick_name}}</p>

            </div>
          </div>
          <p class="counter">{{$t('person.businessCount')}}：{{item.business_counter}}</p>
          <p class="counter">{{$t('person.codeCount')}}：{{item.code_counter}}</p>
          <div class="content">{{item.introduction}}</div>
          <div class="button-box">
            <p class="client-button" :class="{'disable':item.is_business_status!=1}">
              {{$t('project.applyBusinessTitle')}}</p>
            <p class="client-button" :class="{'disable':item.is_code_status!=1}">{{$t('project.applyCodeTitle')}}</p>
          </div>
        </router-link>
        <div class="client row-pack-justify">
          <span class="zan" @click="sendLike(1,item)" :class="{'active':item.is_like==1}">({{item.good_count}})</span>
          <span class="join" :class="{'active':item.is_favorite==1}" @click="sendLike(2,item)">({{item.follow_count}})</span>
        </div>

      </div>
    </div>
    <Emp v-else>{{emp}}</Emp>

    <el-pagination v-if="personSource.length>0"
                   :page-size="page.pageSize" :pager-count="11" :current-page="page.pageNumber"
                   layout="prev, pager, next" @current-change="onPageChange"
                   :total="page.total">
    </el-pagination>
  </div>
</template>

<script>
    import Tabs from '@/components/tabs/tabs'
    import Search from "@/components/search/search";
    import Emp from '@/components/empty/empty'
    import {checkLogin} from "../../../../util/common";

    export default {
        name: "expertpage",
        components: {Search, Tabs, Emp},
        props: {
            isFavor: {
                type: Number,
                default: 0
            },
            emp:{
                type:String,
                default:""
            },
        },
        data() {
            return {
                activeIndex: 0,
                menuList: [
                    {title: 'input.statusAll', activeIndex: 0},
                    {title: 'project.applyBusinessTitle', activeIndex: 1},
                    {title: 'project.applyCodeTitle', activeIndex: 2},
                ],
                searchVal: '',
                page: {
                    pageSize: 20,
                    pageNumber: 1,
                    total: 0
                },
                personSource: [],
                empUrl: require('@/assets/default.png'),
            }
        },
        methods: {
            getPersonSource(keyword, pageSize, pageNumber) {
                let _self = this;

                document.body.scrollTop = document.documentElement.scrollTop = 0;
                _self.$post("/elites/geteliteslist", {
                    is_business_status: _self.activeIndex == 1 ? 1 : 0,
                    is_code_status: _self.activeIndex == 2 ? 1 : 0,
                    is_favorite: _self.isFavor,
                    keyword: keyword.trim(),
                    page_index: pageNumber,
                    page_size: pageSize
                }).then(res => {
                    if (res.code == 1) {
                        let arr = [];
                        res.data.list.map(item => {
                            arr.push({
                                business_counter: item.business_counter,
                                code_counter: item.code_counter,
                                follow_count: item.follow_count,
                                good_count: item.good_count,
                                head_figure: item.head_figure == "" ? _self.empUrl : 'https://img.tokenrank.co/' + item.head_figure,
                                introduction: item.introduction,
                                is_business_status: item.is_business_status,
                                is_code_status: item.is_code_status,
                                is_favorite: item.is_favorite,
                                is_like:item.is_like,
                                nick_name: item.nick_name==""?item.user_id:item.nick_name,
                                user_id: item.user_id
                            })
                        })
                        _self.personSource = arr
                        _self.page.total = res.data.total
                    } else {
                        _self.$toastMessage(res.msg)
                    }
                })
            },
            onInput(val){
                if(val==""){
                    this.getPersonSource(this.$refs.searchModel.inputVal, this.page.pageSize, this.page.pageNumber);
                }
            },
            onSearch(val) {
                this.page.pageNumber=1
                this.getPersonSource(val, this.page.pageSize, this.page.pageNumber)
            },
            onGroup(index) {
                this.activeIndex = index;
                this.getPersonSource(this.$refs.searchModel.inputVal, this.page.pageSize, this.page.pageNumber);
            },
            onPageChange(num) {
                this.page.pageNumber = num;
                this.getPersonSource(this.$refs.searchModel.inputVal, this.page.pageSize, this.page.pageNumber);
            },
            href(id) {
                this.$router.push({path: `/personnel/detail/${id}`})
            },
            //点赞+收藏
            sendLike(type, item) {
                if (checkLogin()) {
                    let _self = this;
                    _self.$post('/elites/seteliteslike', {
                        elites_user_id: item.user_id,
                        type_id: type
                    }).then(res => {
                        if (res.code == 1) {
                            if (type == 1) {
                                //点赞

                                item.good_count = item.good_count + 1
                                item.is_like = item.is_like == 1 ? 0 : 1
                            } else {
                                //收藏
                                // if(_self.isFavor==1){
                                //     _self.getPersonSource(this.$refs.searchModel.inputVal, this.page.pageSize, this.page.pageNumber)
                                //
                                // }else{
                                    item.follow_count = item.is_favorite == 1 ? item.follow_count - 1 : item.follow_count + 1

                                    item.is_favorite = item.is_favorite == 1 ? 0 : 1
                              //  }

                            }
                        } else {
                            _self.$toastMessage(res.msg)
                        }
                    })
                }
            },
        },
        created() {
            this.getPersonSource('', this.page.pageSize, this.page.pageNumber);
        }
    }
</script>

<style scoped lang="less">
  @import "../../person";
</style>
