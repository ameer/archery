/* eslint-disable camelcase */
export const commonAdmin = {
  getAllUsers: { m: '$get', u: 'admin/user' },
  getUnapprovedUsers: { m: '$get', u: 'admin/user/unapproved' },
  getSingleUser: user_id => ({ m: '$get', u: `admin/user/${user_id}` }),
  approveSingleUser: user_id => ({ m: '$put', u: `admin/user/${user_id}/approve` }),
  createNewUser: { m: '$post', u: 'admin/user' },
  updateUser: user_id => ({ m: '$patch', u: `admin/user/${user_id}` }),
  getAllQuestions: { m: '$get', u: 'admin/question' },
  getSingleQuestion: question_id => ({ m: '$get', u: `admin/question/${question_id}` }),
  createNewQuestion: { m: '$post', u: 'admin/question' },
  updateQuestion: question_id => ({ m: '$put', u: `admin/question/${question_id}` }),
  getAllExams: { m: '$get', u: 'admin/exam' },
  getSingleExam: exam_id => ({ m: '$get', u: `admin/exam/${exam_id}` }),
  createNewExam: { m: '$post', u: 'admin/exam' },
  updateExam: exam_id => ({ m: '$put', u: `admin/exam/${exam_id}` }),
  deleteExam: exam_id => ({ m: '$delete', u: `admin/exam/${exam_id}` }),
  getExamUsers: exam_id => ({ m: '$get', u: `admin/exam/${exam_id}/users` }),
  getAvailableUsers: exam_id => ({ m: '$get', u: `admin/exam/${exam_id}/available-users` }),
  addExamUser: exam_id => ({ m: '$post', u: `admin/exam/${exam_id}/user` }),
  deleteExamUser: exam_user_Id => ({ m: '$delete', u: `admin/exam/user/${exam_user_Id}` }),
  doneExam: exam_id => ({ m: '$post', u: `admin/exam/${exam_id}/done` }),
  undoneExam: exam_id => ({ m: '$delete', u: `admin/exam/${exam_id}/done` }),
  getExamQuestions: exam_id => ({ m: '$get', u: `admin/exam/${exam_id}/question` }),
  getExamAvailableQuestions: exam_id => ({ m: '$get', u: `admin/exam/${exam_id}/available-question` }),
  addExamQuestion: { m: '$post', u: 'admin/exam/question' },
  deleteExamQuestion: exam_question_id => ({ m: '$delete', u: `admin/exam/question/${exam_question_id}` }),
  showTheoretical: exam_id => ({ m: '$post', u: `admin/exam/${exam_id}/theoretical-results` }),
  hideTheoretical: exam_id => ({ m: '$delete', u: `admin/exam/${exam_id}/theoretical-results` }),
  showPractical: exam_id => ({ m: '$post', u: `admin/exam/${exam_id}/practical-results` }),
  hidePractical: exam_id => ({ m: '$delete', u: `admin/exam/${exam_id}/practical-results` }),
  getTheoreticalExamResultById: exam_id => ({ m: '$get', u: `result/admin/exam/${exam_id}/theoretical` }),
  getTheoreticalExamDetailsByUserId: (exam_id, user_id) => ({ m: '$get', u: `/result/admin/exam/${exam_id}/user/${user_id}/theoretical/details` }),
  deleteQuestion: question_id => ({ m: '$delete', u: `admin/question/${question_id}` }),
  getPracticalExamScores: exam_id => ({ m: '$get', u: `practical/admin/exam/${exam_id}` }),
  addPracticalExamScores: exam_id => ({ m: '$post', u: `practical/admin/exam/${exam_id}` }),
  getFingerprintByExamId: exam_id => ({ m: '$get', u: `/result/admin/exam/${exam_id}/fingerprints` }),
  updatePracticalScore: (practical_score_id, new_score) => ({ m: '$put', u: `practical/admin/exam/practical-score/${practical_score_id}/score/${new_score}` })
}
export const superadmin = {
  createNewUser: { m: '$post', u: 'super-admin/user' },
  updateUser: user_id => ({ m: '$patch', u: `super-admin/user/${user_id}` }),
  deleteUser: user_id => ({ m: '$delete', u: `super-admin/user/${user_id}` }),
  undeleteUser: user_id => ({ m: '$post', u: `super-admin/user/${user_id}/undelete` }),

  undeleteQuestion: question_id => ({ m: '$post', u: `super-admin/question/${question_id}` }),
  undeleteExam: exam_id => ({ m: '$post', u: `super-admin/exam/${exam_id}` })
}
export const user = {
  updateUser: { m: '$patch', u: '/user/me' },
  changePassword: { m: '$put', u: '/user/password' },
  pastExams: { m: '$get', u: '/exam/past' },
  availableExams: { m: '$get', u: '/exam/available' },
  sendOTP: exam_id => ({ m: '$post', u: `/exam/${exam_id}/send-otp` }),
  startExam: exam_id => ({ m: '$post', u: `/exam/${exam_id}/start` }),
  nextQuestion: session_id => ({ m: '$get', u: `/exam/session/${session_id}/next_question` }),
  submitAnswer: session_id => ({ m: '$post', u: `/exam/session/${session_id}/submit_answer` }),
  getTheoreticalResult: exam_id => ({ m: '$get', u: `/result/exam/${exam_id}/theoretical` }),
  getPracticalResult: exam_id => ({ m: '$get', u: `/result/exam/${exam_id}/practical` }),
  getBothResult: exam_id => ({ m: '$get', u: `/result/exam/${exam_id}/both` })
}
