export const $URL = {
  getCaptcha: 'auth/captcha',
  login: 'auth/login',
  logout: 'auth/logout',
  getMe: 'users/me',
  result: 'result',
  cert: 'result/cert'
}
function initialState () {
  return {
    loading: {

    }
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
  setLoading (state, { key, value }) {
    state.loading = Object.assign({}, state.loading, { [key]: value })
  }
}
export const actions = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  $get ({ commit }, { url, mutation, key, blob = false, returnHeaders = false }) {
    if (key) {
      commit('setLoading', { key, value: true })
    }
    return new Promise((resolve, reject) => {
      this.$axios.get(url, { responseType: blob ? 'blob' : 'json' }).then((response) => {
        if (returnHeaders) {
          resolve(response)
        } else {
          resolve(response.data)
        }
      }).catch((error) => {
        reject(error)
      }).finally(() => {
        commit('setLoading', { key, value: false })
      })
    })
  },
  $post ({ commit }, { url, data, mutation = false, key, returnHeaders = false }) {
    commit('setLoading', { key, value: true })
    return new Promise((resolve, reject) => {
      this.$axios.post(url, data).then((response) => {
        if (mutation) {
          commit(mutation, response.data)
        }
        if (returnHeaders) {
          resolve(response)
        } else {
          resolve(response.data)
        }
      }).catch((error) => {
        reject(error)
      }).finally(() => {
        commit('setLoading', { key, value: false })
      })
    })
  },
  $put ({ commit }, { url, data, mutation = false, key }) {
    if (key === undefined && mutation) {
      key = capitalizeFirstLetter(mutation.slice(3))
    }
    commit('setLoading', { key, value: true })
    return new Promise((resolve, reject) => {
      this.$axios.put(url, data).then((response) => {
        if (mutation) {
          commit(mutation, response.data)
        }
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      }).finally(() => {
        commit('setLoading', { key, value: false })
      })
    })
  },
  $patch ({ commit }, { url, data, mutation = false, key }) {
    if (key === undefined && mutation) {
      key = capitalizeFirstLetter(mutation.slice(3))
    }
    commit('setLoading', { key, value: true })
    return new Promise((resolve, reject) => {
      this.$axios.patch(url, data).then((response) => {
        if (mutation) {
          commit(mutation, response.data)
        }
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      }).finally(() => {
        commit('setLoading', { key, value: false })
      })
    })
  },
  $delete ({ commit }, { url, data, mutation = false, key }) {
    if (key === undefined && mutation) {
      key = capitalizeFirstLetter(mutation.slice(3))
    }
    commit('setLoading', { key, value: true })
    return new Promise((resolve, reject) => {
      this.$axios.delete(url, { data }).then((response) => {
        if (mutation) {
          commit(mutation, response.data)
        }
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      }).finally(() => {
        commit('setLoading', { key, value: false })
      })
    })
  }
}
export const getters = {
  loading: state => state.loading
}
