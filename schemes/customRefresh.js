import { RefreshScheme } from '~auth/runtime'
const DEFAULTS = {
  name: 'refresh',
  endpoints: {
    refresh: {
      url: '/api/auth/refresh',
      method: 'post'
    }
  },
  refreshToken: {
    property: 'refresh_token',
    data: 'refresh_token',
    maxAge: 60 * 60 * 24 * 30,
    required: true,
    tokenRequired: false,
    prefix: '_refresh_token.',
    expirationPrefix: '_refresh_token_expiration.'
  },
  autoLogout: false
}
// export class CustomRequestHandler extends RequestHandler {
//   _requestHasAuthorizationHeader (config) {
//     return !!config.headers[this.scheme.options.token.name]
//   }
// }
export default class CustomRefreshScheme extends RefreshScheme {
  constructor ($auth, options, ...defaults) {
    super($auth, options, ...defaults, DEFAULTS)
  }

  check (checkStatus = false) {
    const response = {
      valid: false,
      tokenExpired: false,
      refreshTokenExpired: false,
      isRefreshable: true
    }
    const token = this.token.sync()
    let refreshToken = true
    if (!this.$auth.hasScope('ADMIN')) {
      refreshToken = this.refreshToken.sync()
    }
    if (!token || !refreshToken) {
      return response
    }
    if (!checkStatus) {
      response.valid = true
      return response
    }
    const tokenStatus = this.token.status()
    const refreshTokenStatus = this.refreshToken.status()
    if (refreshTokenStatus.expired()) {
      response.refreshTokenExpired = true
      return response
    }
    if (tokenStatus.expired()) {
      response.tokenExpired = true
      return response
    }
    response.valid = true
    return response
  }
}
