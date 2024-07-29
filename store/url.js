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
  deleteExamQuestion: exam_question_id => ({ m: '$delete', u: `admin/exam/question/${exam_question_id}` })
}
export const superadmin = {
  createNewUser: { m: '$post', u: 'super-admin/user' },
  updateUser: user_id => ({ m: '$patch', u: `super-admin/user/${user_id}` }),
  deleteUser: user_id => ({ m: '$delete', u: `super-admin/user/${user_id}` }),
  undeleteUser: user_id => ({ m: '$post', u: `super-admin/user/${user_id}/undelete` }),
  deleteQuestion: question_id => ({ m: '$delete', u: `super-admin/question/${question_id}` }),
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
  submitAnswer: session_id => ({ m: '$post', u: `/exam/session/${session_id}/submit_answer` })
}
