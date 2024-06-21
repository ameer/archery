const getProp = function (holder, propName) {
  if (!propName || !holder || typeof holder !== 'object') {
    return holder
  }
  if (propName in holder) {
    return holder[propName]
  }
  const propParts = Array.isArray(propName) ? propName : (propName + '').split('.')
  let result = holder
  while (propParts.length && result) {
    result = result[propParts.shift()]
  }
  return result
}
export default function ({ $auth }) {
  $auth.hasScope = function (scope) {
    const userScopes = $auth.user && getProp($auth.user, this.options.scopeKey)
    if (!userScopes) {
      return false
    }
    if (Array.isArray(userScopes)) {
      return userScopes.includes(scope)
    }
    if (typeof userScopes === 'string' && typeof scope === 'string') {
      return userScopes.toLowerCase() === scope.toLowerCase()
    }
    if (typeof userScopes === 'number' && typeof scope === 'number') {
      return userScopes === scope
    }
    return false
  }
}
