import { $URL } from '.'
function initialState () {
  return {
    client_login_id: ''
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
  _getCaptcha ({ dispatch, commit }) {
    return dispatch('$get', { url: $URL.getCaptcha, key: 'getCaptcha', blob: true, returnHeaders: true }, { root: true }).then((resp) => {
      commit('setState', { key: 'client_login_id', data: resp.headers['client-login-id'] })
      return resp.data
    })
  }
}
export const getters = {
  client_login_id: state => state.client_login_id
}
