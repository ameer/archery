import { $URL } from '.'
function initialState () {
  return {
    result: {
      exam: [],
      right_answers: 0,
      number_of_question: 0,
      result: 0
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
  setState (state, { key, data }) {
    state[key] = data
  }
}
export const actions = {
  _getUserResult ({ dispatch, commit }) {
    return dispatch('$get', { url: $URL.result, key: 'getUserResult' }, { root: true }).then((data) => {
      commit('setState', { key: 'result', data })
    })
  }
}
export const getters = {
  userResult: state => state.result,
  questionsCount: (state) => {
    try {
      return state.result.number_of_question
    } catch (error) {
      return 0
    }
  },
  exam: (state) => {
    try {
      return state.result.exam
    } catch (error) {
      return []
    }
  }
}
