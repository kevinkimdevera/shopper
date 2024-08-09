import { useApi } from "@composables/api"

const api = useApi()

const state = { 
  items: [],
}

const getters = {
  items: state => {
    return state.items
  },

  items_count: state => {
    return state.items.length
  },

  total: state => {
    let total = state.items.reduce((acc, item) => acc + parseFloat(item.price), 0)

    return parseFloat(total).toLocaleString('en-US', { minimumFractionDigits: 2 })
  },

  exists: (state) => (id) => {
    return state.items.find(item => item.id === id)
  }
}

const mutations = { 
  addItem (state, item) {
    // Check id already exists
    let exists = state.items.find(i => i.id === item.id)

    if (exists) {
      return
    }

    state.items.push(item)
  },
  removeItem (state, id) {
    state.items = state.items.filter(item => item.id !== id)
  }
}

const actions = {
  addItem ({ commit }, item) {
    commit('addItem', item)
  },

  removeItem ({ commit }, id) {
    commit('removeItem', id)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}