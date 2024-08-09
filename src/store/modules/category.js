import { useApi } from "@composables/api"

const api = useApi()

const state = {
  categories: [],
}

const getters = {
  categories: state => {
    // Get only the categories with id: 1-5
    return state.categories.filter(category => category.id <= 5)
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