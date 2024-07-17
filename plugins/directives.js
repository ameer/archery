import Vue from 'vue'
Vue.directive('to-en-digits', {
  bind (el, _, vnode) {
    el.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, function (a) { return a.charCodeAt(0) & 0xF })
      vnode.componentInstance.$emit('input', e.target.value)
    })
  }
})
