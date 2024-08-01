import { user } from './url'
import { $URL } from '.'
function initialState () {
  return {
    client_login_id: '',
    codeExpireTime: 0,
    timerIntervalId: null
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
  },
  setExpireInterval (state, { minutes, callback }) {
    state.codeExpireTime = minutes * 60
    state.timerIntervalId = setInterval(() => {
      if (callback) {
        callback()
      }
      if (state.codeExpireTime === 0) {
        clearInterval(state.timerIntervalId)
      }
    }, 1000)
  },
  mutateTimer (state) {
    state.codeExpireTime--
  }
}
export const actions = {
  _handler ({ dispatch }, { endpoint, key, data }) {
    return dispatch(endpoint.m, { url: endpoint.u, key, data }, { root: true })
  },
  _getCaptcha ({ dispatch, commit }) {
    return dispatch('$get', { url: $URL.getCaptcha, key: 'getCaptcha', blob: true, returnHeaders: true }, { root: true }).then((resp) => {
      commit('setState', { key: 'client_login_id', data: resp.headers['client-login-id'] })
      return resp.data
    })
  },
  startCountdown ({ commit, state }, minutes = 1) {
    if (isNaN(minutes)) {
      minutes = 1
    }
    clearInterval(state.timerIntervalId)
    commit('setExpireInterval', {
      minutes,
      callback: () => commit('mutateTimer')
    })
  },
  _sendOTP ({ dispatch, commit }, examId) {
    const url = user.sendOTP(examId)
    return dispatch('$post', { url: url.u, key: 'sendOTP', returnHeaders: true }, { root: true }).then((resp) => {
      commit('setState', { key: 'client_login_id', data: resp.data.client_login_id })
      dispatch('startCountdown')
      return resp
    }).catch((err) => {
      console.log(err)
      return err
    })
  }

}
export const getters = {
  client_login_id: state => state.client_login_id,
  codeExpireTime: state => state.codeExpireTime,
  timerText: (state) => {
    if (state.codeExpireTime !== 0) {
      const minutesLeft = Math.floor(state.codeExpireTime / 60)
      const secondsLeft = state.codeExpireTime % 60
      return (
        minutesLeft + ':' + (secondsLeft < 10 ? '0' + secondsLeft : secondsLeft)
      )
    } else {
      return '00:00'
    }
  }
}
