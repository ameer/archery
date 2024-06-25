import { commonAdmin, superadmin } from './url'
function initialState () {
  return {
    exams: []
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
  _getAllExams ({ dispatch, commit }) {
    return dispatch('_handler', { endpoint: commonAdmin.getAllExams, key: 'gettingAllExams' }).then((resp) => {
      commit('setState', { key: 'exams', data: resp })
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
    return dispatch('_handler', { endpoint, key: 'updateQuestion', data })
  },
  _createQuestion ({ dispatch }, data) {
    const endpoint = { ...commonAdmin.createNewQuestion }
    if (this.$auth.hasScope(3)) {
      endpoint.u = 'super-' + endpoint.u
    }
    return dispatch('_handler', { endpoint, key: 'createQuestion', data })
  },
  _deleteQuestion ({ dispatch }, examId) {
    return dispatch('_handler', { endpoint: superadmin.deleteQuestion(examId), key: 'deleteQuestion' })
  },
  _undeleteQuestion ({ dispatch }, examId) {
    return dispatch('_handler', { endpoint: superadmin.undeleteQuestion(examId), key: 'undeleteQuestion' })
  }
}
export const getters = {
  allExams: state => state.exams
}
