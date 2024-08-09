import { useApi } from "@composables/api"

const api = useApi()

const state = {
  search: null,
  categoryId: null,
  price: null,
  price_min: null,
  price_max: null,
  offset: null,
  limit: null,
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
  },

  save ({ commit }, data) {
    return api.post('products', data)
  },

  update ({ commit }, payload) {
    return api.put(`products/${payload.id}`, payload.data)
  },

  delete ({ commit }, id) {
    return api.destroy(`products/${id}`)
  },
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}