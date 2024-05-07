<template>
  <v-container fluid class="fill-height glass-bg">
    <v-row justify="center">
      <v-col
        cols="12"
        sm="7"
        md="6"
        lg="4"
        xl="3"
        class="text-center"
      >
        <v-form
          ref="loginForm"
          v-model="valid"
          autocomplete="off"
          class=""
          aria-autocomplete="none"
          @submit.prevent="userLogin"
        >
          <v-card class="glass-card mx-auto" max-width="450px">
            <v-card-title class="justify-center text-h6 text-md-h5 font-weight-medium">
              پنل کاربران
            </v-card-title>
            <v-card-subtitle class="text-body-2 text-md-body-1 mt-n2">
              لطفا نام کاربری و گذرواژه خود را وارد نمایید
            </v-card-subtitle>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.username"
                      dir="ltr"
                      autofocus
                      aria-autocomplete="none"
                      autocomplete="off"
                      required
                      :rules="[$rules().required, $rules().numeric, $rules().onlyEnglish, $rules().mobilePhoneChecker]"
                      class="white-bg rounded-12 mb-4"
                      outlined
                      placeholder="نام کاربری"
                      hide-details="auto"
                      background-color="#fff"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.password"
                      dir="ltr"
                      autocomplete="new-password"
                      aria-autocomplete="none"
                      outlined
                      required
                      :rules="[v => !!v || 'این فیلد الزامی است']"
                      class="white-bg rounded-12 mb-4"
                      placeholder="گذرواژه"
                      hide-details="auto"
                      background-color="#fff"
                      :type="showPassword ? 'text' : 'password'"
                      :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                      @click:append="showPassword = !showPassword"
                    />
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                      v-model="formData.captcha"
                      :readonly="loading.getCaptcha"
                      autocomplete="new-password"
                      aria-autocomplete="none"
                      outlined
                      required
                      maxlength="5"
                      minlength="5"
                      :rules="[$rules().required, $rules(5).min, $rules(5).max]"
                      class="rounded-12 mb-4"
                      placeholder="کد امنیتی"
                      hide-details="auto"
                      background-color="#fff"
                      type="text"
                    >
                      <template #append>
                        <v-icon :class="{'rotate-anim' : loading.getCaptcha}" @click="getCaptcha">
                          mdi-refresh
                        </v-icon>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-img :src="captchaImg" contain height="60">
                      <transition name="fade-transition">
                        <v-overlay v-if="loading.getCaptcha" absolute opacity=".9" class="text-center">
                          <span class="text-body-2 pa-1">
                            در حال بارگذاری
                          </span>
                        </v-overlay>
                      </transition>
                    </v-img>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions class="pb-8">
              <v-btn
                max-width="320px"
                width="100%"
                x-large
                elevation="0"
                color="#0058CC"
                class="rounded-12 mx-auto"
                type="submit"
                :loading="loginLoading"
                :disabled="!valid"
              >
                <span class="white--text font-weight-bold" v-text="'ورود'" />
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  layout: 'auth',
  middleware: 'auth',
  auth: 'guest',
  data () {
    return {
      rules: [],
      showPassword: false,
      loginLoading: false,
      valid: false,
      captchaImg: '/img/captcha.jpg',
      formData: {
        username: '',
        password: '',
        captcha: ''
      }
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  created () {
    this.getCaptcha()
  },
  methods: {
    ...mapActions('authServices', ['_getCaptcha']),
    async getCaptcha () {
      try {
        this.captchaImg = await this._getCaptcha()
      } catch (error) {
        console.log(error)
      }
    },
    async userLogin () {
      try {
        this.loginLoading = true
        const data = { ...this.formData }
        if (data.username && data.username.startsWith('0') && data.username.length === 11) {
          data.username = data.username.substring(1)
        }
        const response = await this.$axios.$post('/auth/login', data)
        this.$auth.setUserToken(response.access_token, response.refresh_token)
        this.$auth.setUser(response.user)
        this.loginLoading = false
      } catch (err) {
        console.log(err.response)
        // this.$toast.error(err.response.message)
        this.loginLoading = false
      }
    }
  }
}
</script>
  <style>

  </style>
