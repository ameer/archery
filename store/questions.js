import { commonAdmin, superadmin } from './url'
function initialState () {
  return {
    questions: []
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
  _getAllQuestions ({ dispatch, commit }) {
    return dispatch('_handler', { endpoint: commonAdmin.getAllQuestions, key: 'gettingAllQuestions' }).then((resp) => {
      commit('setState', { key: 'questions', data: resp })
    })
  },
  _updateQuestion ({ dispatch }, { id, data }) {
    const endpoint = { ...commonAdmin.updateQuestion(id) }
    if (this.$auth.hasScope(3)) {
      endpoint.u = 'super-' + endpoint.u
    }
    return dispatch('_handler', { endpoint, key: 'updateQuestion', data })
  },
  _getQuestionForUpdate ({ dispatch }, id) {
    const endpoint = { ...commonAdmin.getSingleQuestion(id) }
    if (this.$auth.hasScope(3)) {
      endpoint.u = 'super-' + endpoint.u
    }
    endpoint.u = endpoint.u + '/update'
    return dispatch('_handler', { endpoint, key: 'updateQuestion' })
  },
  _createQuestion ({ dispatch }, data) {
    const endpoint = { ...commonAdmin.createNewQuestion }
    if (this.$auth.hasScope(3)) {
      endpoint.u = 'super-' + endpoint.u
    }
    return dispatch('_handler', { endpoint, key: 'createQuestion', data })
  },
  _deleteQuestion ({ dispatch }, questionId) {
    return dispatch('_handler', { endpoint: superadmin.deleteQuestion(questionId), key: 'deleteQuestion' })
  },
  _undeleteQuestion ({ dispatch }, questionId) {
    return dispatch('_handler', { endpoint: superadmin.undeleteQuestion(questionId), key: 'undeleteQuestion' })
  }
}
export const getters = {
  allQuestions: state => state.questions
}
