import { useApi } from "@composables/api"

const api = useApi()

const state = {
  search: null,
  categoryId: null,
  price: null,
  price_min: null,
  price_max: null,
  offset: 0,
  limit: 10,
}

const getters = {
  filters: state => {
    return {
      title: state.search,
      categoryId: state.categoryId,
      price: state.price,
      price_min: state.price_min,
      price_max: state.price_max,
      offset: state.offset,
      limit: state.limit
    }
  }
}

const mutations = { 
  setSearch (state, search) {
    state.search = search
  },
  setOffset (state, offset) {
    state.offset = offset
  },
  setLimit (state, limit) {
    state.limit = limit
  }
}

const actions = {
  setSearch ({ commit }, search) {
    commit('setSearch', search)
  },

  setOffset ({ commit }, offset) {
    commit('setOffset', offset)
  },

  setLimit ({ commit }, limit) {
    commit('setLimit', limit)
  },

  fetchProducts ({ commit, getters }, params) {
    let filters = getters.filters

    if (params) {
      filters = params
    }

    return api.get('products', filters)
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}