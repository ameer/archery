// eslint-disable-next-line camelcase
export const typesFa = {
  province: {
    'آذربایجان شرقی': 'EA',
    'آذربایجان غربی': 'WA',
    اردبیل: 'AR',
    اصفهان: 'IS',
    البرز: 'AL',
    ایلام: 'IL',
    بوشهر: 'BU',
    تهران: 'TE',
    'چهارمحال و بختیاری': 'CB',
    'خراسان جنوبی': 'SK',
    'خراسان رضوی': 'RK',
    'خراسان شمالی': 'NK',
    خوزستان: 'KH',
    زنجان: 'ZA',
    سمنان: 'SE',
    'سیستان و بلوچستان': 'SB',
    فارس: 'FA',
    قزوین: 'QA',
    قم: 'QO',
    کردستان: 'KU',
    کرمان: 'KE',
    کرمانشاه: 'KS',
    'کهگیلویه و بویراحمد': 'KB',
    گلستان: 'GO',
    گیلان: 'GI',
    لرستان: 'LO',
    مازندران: 'MN',
    مرکزی: 'MA',
    هرمزگان: 'HO',
    همدان: 'HA',
    یزد: 'YA'
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
export const flippedTypesFa = {
  province: {
    EA: 'آذربایجان شرقی',
    WA: 'آذربایجان غربی',
    AR: 'اردبیل',
    IS: 'اصفهان',
    AL: 'البرز',
    IL: 'ایلام',
    BU: 'بوشهر',
    TE: 'تهران',
    CB: 'چهارمحال و بختیاری',
    SK: 'خراسان جنوبی',
    RK: 'خراسان رضوی',
    NK: 'خراسان شمالی',
    KH: 'خوزستان',
    ZA: 'زنجان',
    SE: 'سمنان',
    SB: 'سیستان و بلوچستان',
    FA: 'فارس',
    QA: 'قزوین',
    QO: 'قم',
    KU: 'کردستان',
    KE: 'کرمان',
    KS: 'کرمانشاه',
    KB: 'کهگیلویه و بویراحمد',
    GO: 'گلستان',
    GI: 'گیلان',
    LO: 'لرستان',
    MN: 'مازندران',
    MA: 'مرکزی',
    HO: 'هرمزگان',
    HA: 'همدان',
    YA: 'یزد'
  },
  gender: {
    1: 'مرد',
    2: 'زن'
  },
  judge_degree: {
    3: 'ملی درجه ۳',
    2: 'ملی درجه ۲',
    1: 'ملی درجه ۱',
    4: 'قاره ای',
    5: 'بین المللی'
  },
  role: {
    1: 'داور',
    2: 'مربی',
    3: 'ورزشکار',
    4: 'دیگر'
  },
  user_permission: {
    1: 'کاربر عادی',
    2: 'ادمین',
    3: 'مدیریت'
  },
  question_type: {
    1: 'درست - نادرست',
    2: 'مجاز - غیر‌مجاز',
    3: 'چند گزینه‌ای',
    4: 'جای خالی',
    5: 'تشریحی'
  },
  true_false: {
    1: 'درست',
    2: 'نادرست'
  },
  allowed_disallowed: {
    1: 'مجاز',
    2: 'غیرمجاز'
  },
  exam_type: {
    1: 'تئوری',
    2: 'عملی',
    3: 'تئوری و عملی'
  }
}
export const transformer = (obj, hasAll = false) => {
  const finalArray = Object.keys(obj).map(key => ({ text: key, value: obj[key] }))
  if (hasAll) {
    finalArray.unshift({ text: 'همه', value: 'all' })
  }
  return finalArray
}

export const types = {
  province: {
    AL: 'البرز',
    AR: 'اردبیل',
    EA: 'آذربایجان شرقی',
    WA: 'آذربایجان غربی',
    BU: 'بوشهر',
    CB: 'چهارمحال و بختیاری',
    FA: 'فارس',
    GI: 'گیلان',
    GO: 'گلستان',
    HA: 'همدان',
    HO: 'هرمزگان',
    IL: 'ایلام',
    IS: 'اصفهان',
    KE: 'کرمان',
    KS: 'کرمانشاه',
    NK: 'خراسان شمالی',
    RK: 'خراسان رضوی',
    SK: 'خراسان جنوبی',
    KH: 'خوزستان',
    KB: 'کهگیلویه و بویراحمد',
    KU: 'کردستان',
    LO: 'لرستان',
    MA: 'مرکزی',
    MN: 'مازندران',
    QA: 'قزوین',
    QO: 'قم',
    SE: 'سمنان',
    SB: 'سیستان و بلوچستان',
    TE: 'تهران',
    YA: 'یزد',
    ZA: 'زنجان'
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
export const flippedTypes = {
  gender: {
    1: 'MALE',
    2: 'FEMALE'
  },
  judge_degree: {
    1: 'NATIONAL_THREE',
    2: 'NATIONAL_TWO',
    3: 'NATIONAL_ONE',
    4: 'CONTINENTAL',
    5: 'INTERNATIONAL'
  },
  role: {
    1: 'Judge',
    2: 'Coach',
    3: 'Athlete',
    4: 'Other'
  },
  user_permission: {
    1: 'USER',
    2: 'ADMIN',
    3: 'SUPER_ADMIN'
  },
  question_type: {
    1: 'TRUE_FALSE',
    2: 'ALLOWED_DISALLOWED',
    3: 'MULTIPLE_CHOICE',
    4: 'BLANK',
    5: 'ESSAY'
  },
  true_false: {
    1: 'TRUE',
    2: 'FALSE'
  },
  allowed_disallowed: {
    1: 'ALLOWED',
    2: 'DISALLOWED'
  },
  exam_type: {
    1: 'THEORETICAL',
    2: 'PRACTICAL',
    3: 'BOTH'
  }
}
export default types
