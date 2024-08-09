import { useApi } from "@composables/api"
import { all } from "axios"

const api = useApi()

const state = {
  categories: [],
}

const getters = {
  categories: state => {
    // Get only the first 5 categories
    return state.categories.slice(0, 5)
  },

  allCategories: state => {
    return state.categories
  }
}

const mutations = { 
  setCategories (state, categories) {
    state.categories = categories
  }
}

const actions = { 
  async fetchCategories ({ commit }) {
    await api.get('categories')
      .then(response => {
        commit('setCategories', response)
      })
      .catch(error => {
        console.error(error)
      })
  },

  async show ({ commit }, id) {
    return api.get(`categories/${id}`)
  },

  save ({ commit }, data) {
    return api.post('categories', data)
  },

  update ({ commit }, payload) {
    return api.put(`categories/${payload.id}`, payload.data)
  },

  delete ({ commit }, id) {
    return api.destroy(`categories/${id}`)
  },

  getProducts ({ commit }, category) {
    return api.get(`categories/${category}/products`)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}