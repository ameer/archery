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
              لطفا کد ملی و گذرواژه خود را وارد نمایید
            </v-card-subtitle>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="formData.username"
                      v-to-en-digits="true"
                      dir="ltr"
                      autofocus
                      aria-autocomplete="none"
                      autocomplete="off"
                      required
                      :rules="[$rules().required, $rules().onlyEnglish]"
                      class="white-bg rounded-12 mb-4"
                      outlined
                      placeholder="کد ملی"
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
                      v-to-en-digits="true"
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
            <v-card-actions class="pb-8 flex-column">
              <v-btn
                max-width="320px"
                width="100%"
                x-large
                elevation="0"
                color="#0058CC"
                class="rounded-12 mx-auto mb-4"
                type="submit"
                :loading="loginLoading"
              >
                <span class="white--text font-weight-bold" v-text="'ورود'" />
              </v-btn>
              <v-btn
                max-width="320px"
                width="100%"
                x-large
                elevation="0"
                color="success"
                class="rounded-12 mx-auto"
                to="/auth/register"
                :loading="loginLoading"
                style="border-width: 2px;"
              >
                <span class="font-weight-bold" v-text="'ثبت نام در سامانه'" />
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
    ...mapGetters(['loading']),
    ...mapGetters('authServices', ['client_login_id'])
  },
  created () {
    this.getCaptcha()
  },
  methods: {
    ...mapActions('authServices', ['_getCaptcha']),
    async getCaptcha () {
      try {
        const blob = await this._getCaptcha()
        const reader = new FileReader()
        reader.onloadend = () => {
          this.captchaImg = reader.result
        }
        reader.readAsDataURL(blob)
      } catch (error) {
        console.log(error)
      }
    },
    async userLogin () {
      try {
        this.loginLoading = true
        const data = { ...this.formData, client_login_id: this.client_login_id }
        const response = await this.$axios.$post('/auth/login', data)
        await this.$auth.setUserToken(response.access_token, response.refresh_token)
        await this.$auth.setUser(response.user)
        this.loginLoading = false
        this.$router.push('/dashboard/user')
      } catch (err) {
        console.log(err.response)
        // this.$toast.error(err.response.message)
        await this.getCaptcha()
        this.loginLoading = false
      }
    }
  }
}
</script>
