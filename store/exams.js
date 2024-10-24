import { commonAdmin, superadmin, user } from './url'
function initialState () {
  return {
    exams: [],
    examSessionId: null
  }
}
async function generateUniqueHash (userAgent, resolution, nationalId) {
  const crypto = require('crypto')
  const hash = await crypto.createHash('sha256')

  // Combine user agent, resolution, and national ID
  const combinedString = `${userAgent}${resolution}${nationalId}`

  // Update the hash with the combined string
  hash.update(combinedString)

  // Get the hexadecimal representation of the hash
  const uniqueHash = hash.digest('hex')

  return uniqueHash
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
  _handler ({ dispatch }, { endpoint, key, data, returnHeaders = false }) {
    return dispatch(endpoint.m, { url: endpoint.u, key, data, returnHeaders }, { root: true })
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
  _getSingleExam ({ dispatch }, id) {
    return dispatch('_handler', { endpoint: commonAdmin.getSingleExam(id), key: 'updateExam' })
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
    return dispatch('_handler', { endpoint: commonAdmin.deleteExam(examId), key: 'deleteExam' })
  },
  _undeleteExam ({ dispatch }, examId) {
    return dispatch('_handler', { endpoint: superadmin.undeleteExam(examId), key: 'undeleteExam' })
  },
  _getExamUsers ({ dispatch }, examId) {
    return dispatch('_handler', { endpoint: commonAdmin.getExamUsers(examId), key: 'getExamUsers' })
  },
  _getExamAvailableUsers ({ dispatch }, examId) {
    return dispatch('_handler', { endpoint: commonAdmin.getAvailableUsers(examId), key: 'getExamAvailableUsers' })
  },
  _addExamUser ({ dispatch }, { examId, data }) {
    return dispatch('_handler', { endpoint: commonAdmin.addExamUser(examId), key: 'addExamUser', data })
  },
  _deleteExamUser ({ dispatch }, examUserId) {
    const endpoint = { ...commonAdmin.deleteExamUser(examUserId) }
    if (this.$auth.hasScope(3)) {
      endpoint.u = 'super-' + endpoint.u
    }
    return dispatch('_handler', { endpoint, key: 'deleteExamUser' })
  },
  _getExamQuestions ({ dispatch }, examId) {
    return dispatch('_handler', { endpoint: commonAdmin.getExamQuestions(examId), key: 'getExamQuestions' })
  },
  _getExamAvailableQuestions ({ dispatch }, examId) {
    return dispatch('_handler', { endpoint: commonAdmin.getExamAvailableQuestions(examId), key: 'getExamAvailableQuestions' })
  },
  _addQuestionToExam ({ dispatch }, data) {
    return dispatch('_handler', { endpoint: commonAdmin.addExamQuestion, key: 'addQuestionToExam', data })
  },
  _deleteExamQuestion ({ dispatch }, examQuestionId) {
    const endpoint = { ...commonAdmin.deleteExamQuestion(examQuestionId) }
    if (this.$auth.hasScope(3)) {
      endpoint.u = 'super-' + endpoint.u
    }
    return dispatch('_handler', { endpoint, key: 'deleteExamQuestion' })
  },
  _toggleExamDone ({ dispatch }, { examId, done }) {
    const endpoint = done ? { ...commonAdmin.doneExam(examId) } : { ...commonAdmin.undoneExam(examId) }
    return dispatch('_handler', { endpoint, key: 'toggleExam' })
  },
  _getPastExams ({ dispatch }) {
    return dispatch('_handler', { endpoint: user.pastExams, key: 'pastExams' })
  },
  _getAvailableExams ({ dispatch }) {
    return dispatch('_handler', { endpoint: user.availableExams, key: 'availableExams' })
  },
  _startExam ({ dispatch, commit }, { examId, data }) {
    const self = this
    return dispatch('_handler', { endpoint: user.startExam(examId), data, key: 'startExam' }).then((resp) => {
      commit('setState', { key: 'examSessionId', data: resp.exam_session_id })
      self.$auth.$storage.setLocalStorage('examSessionId', resp.exam_session_id)
      return resp
    })
  },
  _getNextQuestion ({ dispatch }, sessionId) {
    return dispatch('_handler', { endpoint: user.nextQuestion(sessionId), key: 'nextQuestion', returnHeaders: true }).catch(err => err)
  },
  _submitAnswer ({ dispatch }, { sessionId, data }) {
    return dispatch('_handler', { endpoint: user.submitAnswer(sessionId), data, key: 'startExam', returnHeaders: true }).catch(err => err)
  },
  _toggleTheoreticalResult ({ dispatch }, { examId, show }) {
    const endpoint = show ? { ...commonAdmin.showTheoretical(examId) } : { ...commonAdmin.hideTheoretical(examId) }
    return dispatch('_handler', { endpoint, key: 'toggleTheoretical' })
  },
  _togglePracticalResult ({ dispatch }, { examId, show }) {
    const endpoint = show ? { ...commonAdmin.showPractical(examId) } : { ...commonAdmin.hidePractical(examId) }
    return dispatch('_handler', { endpoint, key: 'togglePractical' })
  },
  _getResultTheoretical ({ dispatch }, examId) {
    return dispatch('_handler', { endpoint: user.getTheoreticalResult(examId), key: 'getTheoreticalResult' })
  },
  _getExamResultForAdmin ({ dispatch }, examId) {
    return dispatch('_handler', { endpoint: commonAdmin.getTheoreticalExamResultById(examId), key: 'getTheoreticalResult' })
  },
  _generateUniqueHash () {
    const userAgent = navigator.userAgent // Get the user agent string
    const nativeResolution = `${screen.width}x${screen.height}` // Get the device resolution
    const nationalId = this.$auth.user.national_code
    return generateUniqueHash(userAgent, nativeResolution, nationalId)
  }
}
export const getters = {
  allExams: state => state.exams,
  examSessionId: state => state.examSessionId
}
