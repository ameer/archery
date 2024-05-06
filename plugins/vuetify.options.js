import colors from 'vuetify/es5/util/colors'
import fa from 'vuetify/src/locale/fa'
export default {
  lang: {
    locales: { fa },
    current: 'fa'
  },
  rtl: true,
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: colors.blue.darken2,
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      }
    }
  }
}
