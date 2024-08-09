import { useApi } from "@composables/api"

const api = useApi()

const state = { }

const getters = { }

const mutations = { }

const actions = { 

  async upload ({ commit }, data) {
    return await api.post('files/upload', data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}