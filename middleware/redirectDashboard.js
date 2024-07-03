export default function ({ $auth, route, app }) {
  if (route.name === 'dashboard') {
    if ($auth.hasScope(3) || $auth.hasScope(2)) {
      return app.router.push('/dashboard/admin')
    } else if ($auth.hasScope(1)) {
      return app.router.push('/dashboard/user')
    }
  }
}
