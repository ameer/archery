import { user } from './url'
function initialState () {
  return {

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
  _updateUser ({ dispatch }, data) {
    const endpoint = user.updateUser
    return dispatch('_handler', { endpoint, key: 'updateUser', data })
  },
  _changePassword ({ dispatch }, data) {
    const endpoint = user.changePassword
    return dispatch('_handler', { endpoint, key: 'changePassword', data })
  }
}
export const getters = {

}
