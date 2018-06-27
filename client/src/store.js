import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedIn:localStorage.getItem('token') ? true : false,
    username:localStorage.getItem('username')
  },
  mutations: {

  },
  actions: {

  }
})
