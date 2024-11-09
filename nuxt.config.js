import fs from 'fs'
import { TYPE } from 'vue-toastification'
// import path from 'path'
export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  server: {
    https: {
      key: fs.readFileSync(`${process.env.certPath}-key.pem`),
      cert: fs.readFileSync(`${process.env.certPath}.pem`)
    }
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  
  head: {
    titleTemplate: '%s - سامانه یکپارچه داوران ایران',
    title: 'سامانه یکپارچه داوران ایران',
    htmlAttrs: {
      lang: 'fa'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
      { name: 'apple-mobile-web-app-title', content:"My Archery" },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes:"96x96" },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'shortcut icon', href: '/favicon.ico' },
      { rel: 'shortcut icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' }
    ]
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/helpers.js',
    '~/plugins/directives.js',
    '~/plugins/datePicker.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'vue-toastification/nuxt',
    'portal-vue/nuxt'
  ],
  toast: {
    position: 'top-right',
    transition: 'Vue-Toastification__slideBlurred',
    maxToasts: 3,
    newestOnTop: true,
    closeOnClick: true,
    timeout: 5000,
    pauseOnHover: true,
    showCloseButtonOnHover: false,
    closeButton: 'button',
    toastDefaults: {
      [TYPE.SUCCESS]: {
        icon: {
          iconClass: 'v-icon notranslate mdi mdi-check'
        }
      },
      [TYPE.WARNING]: {
        icon: {
          iconClass: 'v-icon notranslate mdi mdi-shield-alert-outline'
        }
      },
      [TYPE.ERROR]: {
        icon: {
          iconClass: 'v-icon notranslate mdi mdi-shield-alert-outline'
        }
      }
    },
    rtl: true,
    filterBeforeCreate: (toast, toasts) => {
      if (toasts.filter(t => t.type === toast.type).length !== 0) {
        // Returning false discards the toast
        return false
      }
      // You can modify the toast if you want
      return toast
    }
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.BASE_URL || 'https://api.judge.myarchery.ir'
  },
  auth: {
    plugins: ['~/plugins/auth.js'],
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      callback: '/jamstack',
      home: false
    },
    scopeKey: 'user_permission',
    strategies: {
      local: {
        scheme: '~/schemes/customRefresh',
        token: {
          property: 'access_token',
          maxAge: 60 * 60 * 10,
          global: true,
          type: 'Bearer'
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          maxAge: 60 * 60 * 24 * 60
        },
        user: {
          property: false,
          autoFetch: true
        },
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          logout: { url: '/auth/logout', method: 'post' },
          refresh: { url: '/auth/refresh', method: 'post' },
          user: { url: '/user/me', method: 'get' }
        }
      }
    }
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    optionsPath: '~/plugins/vuetify.options.js',
    treeShake: true,
    defaultAssets: {
      font: false
    },
    customVariables: ['~/assets/variables.scss']
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend (config, { isDev }) {
      config.devServer = Object.assign({}, config.devServer, { hot: true })
      // Sets webpack's mode to development if `isDev` is true.
      if (isDev) {
        config.mode = 'development'
      }
    }
  }
}
