// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ({ $auth, route, redirect }) {
  console.log($auth.hasScope('SUPER_ADMIN'))
  // if (route.name === 'dashboard') {
  //   if ($auth.hasScope('COMPANY_ADMIN')) {
  //     return redirect('/dashboard/user/devices')
  //   } else if ($auth.hasScope('ADMIN')) {
  //     return redirect('/dashboard/admin/companies')
  //   }
  // }
}
