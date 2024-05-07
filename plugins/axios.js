export default function (ctx) {
  ctx.$axios.onError((err) => {
    if (err) { // undefined and null check
      if (!err.response) { // Network error
        ctx.$toast.error('خطا در اتصال به سرور.', { singleton: true })
      } else {
        let msg = err.response?.data.description?.fa ?? err.response?.data.message ?? err.message ?? 'خطای داخلی'
        if (Array.isArray(msg)) { msg = msg.join('\n') }
        ctx.$toast.error(msg, { singleton: true })
        throw new Error(msg)
      }
    }
    throw err
  })
}
