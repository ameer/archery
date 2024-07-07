import translateObject from './translateObject'
import { flippedTypes, flippedTypesFa } from './types'

export default (context, inject) => {
  const rules = (args = 1, msg = null) => {
    return {
      required: v => !!v || 'وارد کردن این فیلد الزامی است.',
      requiredSwitch: v => (v !== null && typeof v !== 'undefined') || 'وارد کردن این فیلد الزامی است.',
      requiredFalse: v => (typeof v === 'boolean') || 'وارد کردن این فیلد الزامی است.',
      requiredZero: v => (v !== null && typeof v !== 'undefined') || 'وارد کردن این فیلد الزامی است.',
      numeric: (v) => {
        const value = _d(v)
        return (
          /^\d*\.?\d*$/.test(value) || 'این فیلد تنها باید شامل ارقام باشد.'
        )
      },
      onlyEnglish: v =>
        /^[a-zA-Z0-9!@#$%^&*(){}|\\/:;'"`~.?\s]*$/.test(_d(v)) ||
        'این فیلد تنها باید شامل کاراکترهای انگلیسی یا علائم و نمادها باشد.',
      min: v =>
        (v && _d(v).length >= args) || `حداقل ${args} کاراکتر باید وارد شود`,
      max: v =>
        (v && _d(v).length <= args) || `حداکثر ${args} کاراکتر باید وارد شود`,
      nationalCodeChecker: (v) => {
        if (typeof v === 'undefined') {
          return 'کد ملی وارد شده اشتباه است.'
        }
        if (v === null) {
          return false
        }
        if (v.length === 0) {
          return false
        } else {
          const a = _d(v).split('')
          if (a.length !== 10) {
            return 'کد ملی وارد شده اشتباه است.'
          }
          const controlDigit = parseInt(a[a.length - 1])
          let total = 0
          for (let i = 0; i < a.length - 1; i++) {
            total += a[i] * (10 - i)
          }
          const remainder = total % 11
          if (remainder < 2 && remainder === controlDigit) {
            return true
          } else if (remainder >= 2 && controlDigit === 11 - remainder) {
            return true
          } else {
            return 'کد ملی وارد شده اشتباه است.'
          }
        }
      },
      onlyPersian: v =>
        /^[\u0600-\u06EF\s]+$/u.test(v) || 'فقط حروف فارسی مجاز است',
      mobilePhoneChecker: (v) => {
        return !v || /^09\d{9}$/.test(_d(v)) || 'شماره تلفن معتبر نیست'
      },
      emailChecker: (v) => {
        return (
          !v ||
          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$/.test(_d(v)) ||
          'ایمیل معتبر نیست'
        )
      },
      confirmPassword: (v) => {
        return v === args || 'تکرار رمز عبور با رمز عبور وارد شده مطابقت ندارد'
      },
      gt: (v) => {
        v = removeTSP(v)
        if (_d(v) >= args) {
          return true
        } else if (msg) {
          return msg
        } else {
          return `ورودی باید بزرگتر از ${addTSP(args)} باشد.`
        }
        // return _d(v) >= args || (msg !== null ?? `ورودی باید بزرگتر از ${addTSP(args)} باشد.`)
      },
      lt: (v) => {
        v = removeTSP(v)
        if (_d(v) <= args) {
          return true
        } else if (msg) {
          return msg
        } else {
          return `ورودی باید کوچک‌تر از ${addTSP(args)} باشد.`
        }
        // return _d(v) <= args || (msg !== null ?? `ورودی باید کوچک‌تر از ${addTSP(args)} باشد.`)
      },
      passwordPolicy: (v) => {
        return (v && v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v)) || 'شرایط تعیین رمز عبور رعایت نشده است'
      },
      intOnly: (v) => {
        v = +v
        return (Number(v) && Number.isInteger(v)) || 'ورودی باید عدد صحیح باشد.'
      }
    }
  }
  inject('rules', rules)
  const _d = (s) => {
    // Convert Persian Number to English Numbers
    return s && s.length > 0
      ? s.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, function (a) {
        return a.charCodeAt(0) & 0xF
      })
      : s
  }
  inject('_d', _d)
  const pushHistory = (currentStepIndex) => {
    const stepIndex = currentStepIndex + 1
    history.pushState(
      {},
      null,
      context.route.path + '#' + encodeURIComponent('step-' + stepIndex)
    )
  }
  inject('pushHistory', pushHistory)
  const ph2 = (hash) => {
    try {
      context.app.router.push({
        path: context.route.path,
        replace: true,
        hash: encodeURIComponent(hash)
      })
    } catch (error) {}
  }
  inject('ph2', ph2)
  const addTSP = (number, isFloat = false, absolute = false) => {
    let result = isFloat ? parseFloat(number) : parseInt(number)
    result = absolute ? Math.abs(number) : number
    if (isNaN(result)) {
      return number
    }
    return Intl.NumberFormat('fa-IR').format(result)
  }
  inject('addTSP', addTSP)
  const removeTSP = (str) => {
    const thousandsSeparator = Intl
      ? Intl.NumberFormat('fa-IR').formatToParts(1000)[1].value
      : '٬'
    try {
      return str.toString().replaceAll(thousandsSeparator, '')
    } catch (error) {
      return str
    }
  }
  inject('removeTSP', removeTSP)
  const dtf = (timestamp, options = { dateStyle: 'short' }) => {
    try {
      return Intl.DateTimeFormat('fa-IR', options).format(timestamp)
    } catch (error) {
      return timestamp
    }
  }
  inject('dtf', dtf)
  const longDTF = (timestamp) => {
    try {
      const parts = Intl.DateTimeFormat('fa-IR', { dateStyle: 'full', timeStyle: 'short' }).formatToParts(timestamp)
      const obj = parts.reduce((acc, item) => {
        acc[item.type] = item.value
        return acc
      }, {})
      const dts = `${obj.weekday} ${obj.day} ${obj.month} ${obj.year} ساعت ${obj.hour}:${obj.minute}`
      return dts
    } catch (error) {
      return timestamp
    }
  }
  inject('longDTF', longDTF)
  const t = (key) => {
    try {
      return translateObject[key] ?? key
    } catch (error) {
      return key
    }
  }
  inject('t', t)

  // Type Translator
  const tt = (mainKey, subKey, fa = false) => {
    try {
      if (fa) {
        return flippedTypesFa[mainKey][subKey]
      } else {
        return flippedTypes[mainKey][subKey]
      }
    } catch (error) {
      return subKey
    }
  }
  inject('tt', tt)
}
