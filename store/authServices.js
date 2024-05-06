import { $URL } from '.'
export const actions = {
  _getCaptcha ({ dispatch }) {
    return dispatch('$get', { url: $URL.getCaptcha, key: 'getCaptcha' }, { root: true })
  }
}
