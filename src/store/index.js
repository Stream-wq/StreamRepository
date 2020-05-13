import Vue from 'vue'
import Vuex from 'vuex'
import {fetchGet} from "../api/axios"

Vue.use(Vuex)



const Store = new Vuex.Store({
  state: {
    nationalNum: []
  },
  getters:{

  },
  mutations: {
    getNationalNum(state, item) {
      let arr = [];
      item.map(item => {
        arr.push(item)
      })
      state.nationalNum = arr
    }
  },
  actions: {
    getNationalSource({commit,state}) {
     fetchGet('/nologon/marvel/nationalitys',{}).then(res=>{
       commit("getNationalNum",res.data)
     })
    }
  }
})

export default Store
