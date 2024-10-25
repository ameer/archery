import { commonAdmin, superadmin } from './url'
function initialState () {
  return {
    users: []
  }
}
export const state = initialState
export const mutations = {
  resetState (state) {
    // acquire initial state
    const s = initialState()
    Object.keys(s).forEach((key) => {
      state[key] = s[key]
    })
  },
  setState (state, { key, data }) {
    state[key] = data
  }
}
export const actions = {
  _handler ({ dispatch }, { endpoint, key, data }) {
    return dispatch(endpoint.m, { url: endpoint.u, key, data }, { root: true })
  },
  _getAllUsers ({ dispatch, commit }) {
    return dispatch('_handler', { endpoint: commonAdmin.getAllUsers, key: 'gettingAllUsers' }).then((resp) => {
      commit('setState', { key: 'users', data: resp })
    })
  },
  _getSingleUser ({ dispatch }, userId) {
    return dispatch('_handler', { endpoint: commonAdmin.getSingleUser(userId), key: 'getSingleUser' })
  },
  _updateUser ({ dispatch }, { id, data }) {
    const endpoint = { ...commonAdmin.updateUser(id) }
    if (this.$auth.hasScope(3)) {
      endpoint.u = 'super-' + endpoint.u
    }
    return dispatch('_handler', { endpoint, key: 'updateUser', data })
  },
  _addUser ({ dispatch }, data) {
    const endpoint = { ...commonAdmin.createNewUser }
    if (this.$auth.hasScope(3)) {
      endpoint.u = 'super-' + endpoint.u
    }
    return dispatch('_handler', { endpoint, key: 'updateUser', data })
  },
  _approveUser ({ dispatch }, userId) {
    return dispatch('_handler', { endpoint: commonAdmin.approveSingleUser(userId), key: 'approveUser' })
  },
  _deleteUser ({ dispatch }, userId) {
    return dispatch('_handler', { endpoint: superadmin.deleteUser(userId), key: 'deleteUser' })
  },
  _undeleteUser ({ dispatch }, userId) {
    return dispatch('_handler', { endpoint: superadmin.undeleteUser(userId), key: 'undeleteUser' })
  }
}
export const getters = {
  allUsers: state => state.users
}
