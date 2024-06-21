/* eslint-disable camelcase */
export const commonAdmin = {
  getAllUsers: { m: '$get', u: 'admin/user' },
  getUnapprovedUsers: { m: '$get', u: 'admin/user/unapproved' },
  getSingleUser: user_id => ({ m: '$get', u: `admin/user/${user_id}` }),
  approveSingleUser: user_id => ({ m: '$put', u: `admin/user/${user_id}/approve` }),
  createNewUser: { m: '$post', u: 'admin/user' },
  updateUser: user_id => ({ m: '$patch', u: `admin/user/${user_id}` })
}
export const superadmin = {
  createNewUser: { m: '$post', u: 'super-admin/user' },
  updateUser: user_id => ({ m: '$patch', u: `super-admin/user/${user_id}` }),
  deleteUser: user_id => ({ m: '$delete', u: `super-admin/user/${user_id}` }),
  undeleteUser: user_id => ({ m: '$post', u: `super-admin/user/${user_id}/undelete` })
}
