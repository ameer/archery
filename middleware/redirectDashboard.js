export default function ({ $auth, route, redirect }) {
  if (route.name === 'dashboard') {
    if ($auth.hasScope(3) || $auth.hasScope(2)) {
      return redirect('/dashboard/admin')
    } else if ($auth.hasScope(1)) {
      return redirect('/dashboard/admin/companies')
    }
  }
}
