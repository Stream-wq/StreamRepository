<template>
  <!--首页-->
  <div class="page">
    <banner :bannerList="bannerList" @click="onClick"></banner>
    <div class="project-page area">
      <div class="page-top flex flex-direction-row flex-pack-justify">
        <Tabs :activeIndex="activeIndex" :menuList="menuList" @groupBy="onGroup"></Tabs>
        <Search ref="searchModel" @input="onInput" @search="onSearch"></Search>
      </div>
      <div class="project-list clear" v-if="projectSource.length>0">
        <template v-for="(item,i) in projectSource">
          <router-link tag="a" :to="`/Project/${item.pid}`" class="left">
            <a class="project-item">
              <span class="u-img"><img :src="item.img"/> </span>
              <p class="name">{{item.name}}</p>
              <p class="fullName">{{item.fullName}}</p>
              <el-rate disabled show-score :colors="colors" disabled-void-color="#49475c" v-model="item.rate"></el-rate>
              <div class="info">
                {{item.info}}
              </div>
              <div class="p-more">
                <p class="more">{{$t('common.details')}}</p>
              </div>
            </a>
          </router-link>
        </template>
        <div class="left" v-if="page.pageNumber===8">
          <div class="project-item more">
            <pre class="search-tip">{{$t('project.empTip')}}</pre>
            <p class="button" @click="goTop">{{$t('project.search')}}</p>
          </div>
        </div>
      </div>
      <Emp v-else>{{$t('message.noDataTip')}}</Emp>
    </div>
    <el-pagination v-if="projectSource.length>0"
                   :page-size="page.pageSize" :pager-count="11" :current-page="page.pageNumber"
                   layout="prev, pager, next" @current-change="onPageChange"
                   :total="page.total">
    </el-pagination>
  </div>
</template>

<script>
    import banner from '@/components/banner/banner'
    import Tabs from '@/components/tabs/tabs'
    import Search from "@/components/search/search";
    import Emp from '@/components/empty/empty'

    export default {
        name: "home",
        components: {banner, Search, Tabs, Emp},
        data() {
            return {
                bannerList: [],
                activeIndex: 0,
                value: 4.5,
                colors: ['#ffcd04', '#ffcd04', '#ffcd04'],
                menuList: [
                    {title: 'input.statusAll', activeIndex: 0},
                    {title: 'input.statusIng', activeIndex: 1},
                    {title: 'input.statusBefore', activeIndex: 2},
                    {title: 'input.statusAfter', activeIndex: 3},
                ],
                searchVal: '',
                page: {
                    pageSize: 20,
                    pageNumber: 1,
                    total: 0
                },
                projectSource: [],
                empImg: require('@/assets/default.png')
            }
        },
        methods: {
            goTop(){
                document.body.scrollTop = document.documentElement.scrollTop = 0
                this.$refs['searchModel'].$refs['search'].focus()
            },
            getBannerSource() {
                let _self = this;
                _self.$get('/ac/gethomebanner?channel_type=2', {}).then(res => {
                        if (res.code == 1) {
                            let arr = []
                            res.data.map(item => {
                                arr.push({
                                    img: item.banner_name,
                                    url: item.banner_url
                                })
                            })
                            _self.bannerList = arr

                        }
                    },
                )
            },
            //跳转至活动页
            onClick(banner) {
                // let url = banner.url.replace("http://", ""), urlArr = url.split('/')
                // this.$router.push("/activity/5")

               window.location.href = banner.url
            },
            getProjectSource(keyword, pageSize, pageNumber) {
                let _self = this;

                document.body.scrollTop = document.documentElement.scrollTop = 0;
                _self.$post('/project/search', {
                    keyword: keyword.trim(),
                    page_index: pageNumber,
                    page_size: pageSize,
                    pstatus: _self.activeIndex
                }).then(res => {
                        if (res.code == 1) {
                            let source = res.data.info.list, arr = [];
                            source.map(item => {
                                let rate = item.star.toFixed(2)
                                arr.push({
                                    pid: item.pid,
                                    name: item.ticker,
                                    fullName: item.ico_name,
                                    img: item.img_project_logo == "" ? _self.empImg : item.img_project_logo,
                                    rate: Number(rate),
                                    info: _self.$storage.get('local') == 'en' ? item.pdesc_en : item.pdesc
                                })
                            })
                            _self.page.total = res.data.info.total
                            _self.projectSource = arr
                        }
                    }
                )
            },
            onSearch(val) {
                this.page.pageNumber=1
                this.getProjectSource(val, this.page.pageSize, this.page.pageNumber)
            },
            onGroup(index) {
                this.activeIndex = index;
                this.page.pageNumber=1
                this.getProjectSource(this.$refs.searchModel.inputVal, this.page.pageSize, this.page.pageNumber);
            },
            onPageChange(num) {
                this.page.pageNumber = num;
                this.getProjectSource(this.$refs.searchModel.inputVal, this.page.pageSize, this.page.pageNumber);
            },
            onInput(v) {
                if (v == "") {
                    this.getProjectSource(this.$refs.searchModel.inputVal, this.page.pageSize, this.page.pageNumber)
                }
            }
        },
        created() {
            this.getBannerSource();
            this.getProjectSource('', this.page.pageSize, this.page.pageNumber);
        }
    }
</script>
<style scoped lang="less">
  .page-top {
    padding: 30px 0 40px;
  }

  .project-list {
    font-size: 0;
    margin-left: -20px;

    .left {
      margin-bottom: 48px;
      margin-left: 20px;
    }
  }

  .project-item {
    display: block;
    width: 266px;
    height: 300px;
    overflow: hidden;
    background-color: #26253a;
    text-align: center;
    padding: 12px 22px 20px;
    border-radius: 5px;
    &.more{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .u-img {
      transition: all .3s;
      display: block;
      width: 118px;
      height: 118px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto;
      transition: all .4s;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .name {
      margin-top: 10px;
      font-size: 20px;
      color: #fff;
      line-height: 26px;
      transition: all .3s;
    }

    .fullName {
      font-size: 16px;
      color: #9d9d9d;
      line-height: 26px;
      transition: all .3s;
    }

    .info {
      font-size: 12px;
      color: #cccccc;
      line-height: 18px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      max-height: 54px;
      margin-top: 10px;
      transition: all .3s;
      text-align: left;
    }

    .p-more {
      text-align: left;
      transition: all .3s;
      transform: translateY(35px);
      opacity: 0;
    }

    .more {
      text-align: left;
      display: inline-block;
      font-size: 12px;
      color: #17f0b5;
      padding-right: 24px;
      margin-top: 12px;
      background: url(../assets/icon/p-more.png) center right no-repeat;
    }

    &:hover {
      .u-img {
        width: 96px;
        height: 96px;
      }

      .p-more {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }

  .iconColor {
    color: #ffcd04;
  }

  .search-tip{
    text-align: center;
    font-size: 16px;
    color:#fff;
    font-family: microsoft yahei;
    text-indent: 0;
    margin: 0;
    padding: 0;
    white-space: pre-line;
    line-height: 25px;
  }
  .button{
    display: block;
    width: 104px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background-color:#22a27f;
    border-radius:30px;
    font-size: 14px;
    color:#fff;
    margin-top: 34px;
    cursor: pointer;
  }
</style>
