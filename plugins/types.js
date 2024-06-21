// eslint-disable-next-line camelcase
export const typesFa = {
  province: {
    البرز: 'AL',
    اردبیل: 'AR',
    'آذربایجان شرقی': 'EA',
    'آذربایجان غربی': 'WA',
    بوشهر: 'BU',
    'چهارمحال و بختیاری': 'CB',
    فارس: 'FA',
    گیلان: 'GI',
    گلستان: 'GO',
    همدان: 'HA',
    هرمزگان: 'HO',
    ایلام: 'IL',
    اصفهان: 'IS',
    کرمان: 'KE',
    کرمانشاه: 'KS',
    'خراسان شمالی': 'NK',
    'خراسان رضوی': 'RK',
    'خراسان جنوبی': 'SK',
    خوزستان: 'KH',
    'کهگیلویه و بویراحمد': 'KB',
    کردستان: 'KU',
    لرستان: 'LO',
    مرکزی: 'MA',
    مازندران: 'MN',
    قزوین: 'QA',
    قم: 'QO',
    سمنان: 'SE',
    'سیستان و بلوچستان': 'SB',
    تهران: 'TE',
    یزد: 'YA',
    زنجان: 'ZA'
  },
  gender: {
    مرد: 1,
    زن: 2
  },
  judge_degree: {
    'ملی درجه ۱': 1,
    'ملی درجه ۲': 2,
    'ملی درجه ۳': 3,
    'قاره ای': 4,
    'بین المللی': 5
  },
  role: {
    داور: 1,
    مربی: 2,
    ورزشکار: 3,
    دیگر: 4
  },
  user_permission: {
    'کاربر عادی': 1,
    ادمین: 2
  },
  question_type: {
    'درست - نادرست': 1,
    'مجاز - غیر‌مجاز': 2,
    'چند گزینه‌ای': 3,
    'جای خالی': 4,
    تشریحی: 5
  },
  true_false: {
    درست: 1,
    نادرست: 2
  },
  allowed_disallowed: {
    مجاز: 1,
    غیرمجاز: 2
  },
  exam_type: {
    تئوری: 1,
    عملی: 2,
    'تئوری و عملی': 3
  }
}
export const transformer = (obj) => {
  return Object.keys(obj).map(key => ({ text: key, value: obj[key] }))
}

export const types = {
  province: {
    البرز: 'AL',
    اردبیل: 'AR',
    'آذربایجان شرقی': 'EA',
    'آذربایجان غربی': 'WA',
    بوشهر: 'BU',
    'چهارمحال و بختیاری': 'CB',
    فارس: 'FA',
    گیلان: 'GI',
    گلستان: 'GO',
    همدان: 'HA',
    هرمزگان: 'HO',
    ایلام: 'IL',
    اصفهان: 'IS',
    کرمان: 'KE',
    کرمانشاه: 'KS',
    'خراسان شمالی': 'NK',
    'خراسان رضوی': 'RK',
    'خراسان جنوبی': 'SK',
    خوزستان: 'KH',
    'کهگیلویه و بویراحمد': 'KB',
    کردستان: 'KU',
    لرستان: 'LO',
    مرکزی: 'MA',
    مازندران: 'MN',
    قزوین: 'QA',
    قم: 'QO',
    سمنان: 'SE',
    'سیستان و بلوچستان': 'SB',
    تهران: 'TE',
    یزد: 'YA',
    زنجان: 'ZA'
  },
  gender: {
    MALE: 1,
    FEMALE: 2
  },
  judge_degree: {
    NATIONAL_THREE: 1,
    NATIONAL_TWO: 2,
    NATIONAL_ONE: 3,
    CONTINENTAL: 4,
    INTERNATIONAL: 5
  },
  role: {
    Judge: 1,
    Coach: 2,
    Athlete: 3,
    Other: 4
  },
  user_permission: {
    USER: 1,
    ADMIN: 2,
    SUPER_ADMIN: 3
  },
  question_type: {
    TRUE_FALSE: 1,
    ALLOWED_DISALLOWED: 2,
    MULTIPLE_CHOICE: 3,
    BLANK: 4,
    ESSAY: 5
  },
  true_false: {
    TRUE: 1,
    FALSE: 2
  },
  allowed_disallowed: {
    ALLOWED: 1,
    DISALLOWED: 2
  },
  exam_type: {
    THEORETICAL: 1,
    PRACTICAL: 2,
    BOTH: 3
  }
}
export default types
