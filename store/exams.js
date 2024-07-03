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
  _updateExam ({ dispatch }, { id, data }) {
    const endpoint = { ...commonAdmin.updateExam(id) }
    if (this.$auth.hasScope(3)) {
      endpoint.u = 'super-' + endpoint.u
    }
    return dispatch('_handler', { endpoint, key: 'updateExam', data })
  },
  _getExamForUpdate ({ dispatch }, id) {
    const endpoint = { ...commonAdmin.getSingleExam(id) }
    if (this.$auth.hasScope(3)) {
      endpoint.u = 'super-' + endpoint.u
    }
    endpoint.u = endpoint.u + '/update'
    return dispatch('_handler', { endpoint, key: 'updateExam' })
  },
  _createExam ({ dispatch }, data) {
    const endpoint = { ...commonAdmin.createNewExam }
    if (this.$auth.hasScope(3)) {
      endpoint.u = 'super-' + endpoint.u
    }
    return dispatch('_handler', { endpoint, key: 'createExam', data })
  },
  _deleteExam ({ dispatch }, examId) {
    return dispatch('_handler', { endpoint: superadmin.deleteExam(examId), key: 'deleteExam' })
  },
  _undeleteExam ({ dispatch }, examId) {
    return dispatch('_handler', { endpoint: superadmin.undeleteExam(examId), key: 'undeleteExam' })
  }
}
export const getters = {
  allExams: state => state.exams
}
