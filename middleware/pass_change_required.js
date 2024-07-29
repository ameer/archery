export default function ({ $auth, app, route }) {
  if (route.name !== 'dashboard-change-password' && $auth.hasScope(1) && $auth.user.pass_change_required === true) {
    // eslint-disable-next-line camelcase
    return app.router.push({ path: '/dashboard/change-password', query: { pass_change_required: true } })
  }
}
