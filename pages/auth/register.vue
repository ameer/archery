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
          ref="registerForm"
          v-model="valid"
          autocomplete="off"
          class=""
          aria-autocomplete="none"
          @submit.prevent="userRegister"
        >
          <v-card class="glass-card mx-auto" max-width="450px">
            <v-card-title class="justify-center text-h6 text-md-h5 font-weight-medium">
              ثبت نام کاربران
            </v-card-title>
            <v-card-subtitle class="text-body-2 text-md-body-1 mt-n2">
              برای ثبت نام لطفا فرم زیر را تکمیل نمایید
            </v-card-subtitle>
            <v-card-text>
              <v-container>
                <v-row dense>
                  <v-col v-for="(field, i) in fields" :key="`urf-${i}`" :cols="field.cols ?? 12">
                    <v-select
                      v-if="field.type === 'select'"
                      v-model="formData[field.model]"
                      outlined
                      :label="$t(field.title)"
                      dense
                      :rules="field.rules"
                      :items="field.items"
                      :readonly="field.readonly"
                      background-color="#fff"
                      class="rounded-12"
                    />
                    <template v-else-if="field.type === 'date'">
                      <div>
                        <v-text-field
                          :id="field.title"
                          outlined
                          :label="$t(field.title)"
                          :value="dateFormat(formData[field.model])"
                          dense
                          :rules="field.rules"
                          readonly
                          background-color="#fff"
                          class="rounded-12"
                        />
                        <date-picker
                          v-model="formData[field.model]"
                          format="YYYY-MM-DD"
                          input-format="YYYY-MM-DD"
                          display-format="jYYYY/jMM/jDD"
                          :custom-input="`#${field.title}`"
                        />
                      </div>
                    </template>
                    <template v-else>
                      <div>
                        <v-text-field
                          :id="field.title"
                          v-model="formData[field.model]"
                          v-to-en-digits="true"
                          outlined
                          :label="$t(field.title)"
                          dense
                          :maxlength="field.maxlength"
                          :type="field.model === 'password' ? 'password' : 'text'"
                          :rules="field.rules"
                          :readonly="field.readonly"
                          background-color="#fff"
                          class="rounded-12"
                        />
                        <dashboard-common-password-policy v-if="field.hasPolicy" :value="formData.password" class="mb-4 mb-md-8" />
                      </div>
                    </template>
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
                      dense
                      minlength="5"
                      :rules="[$rules().required, $rules(5).min, $rules(5).max]"
                      class="rounded-12 mt-2"
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
                color="success"
                class="rounded-12 mx-auto mb-4"
                type="submit"
                :loading="registerLoading"
              >
                <span class="font-weight-bold" v-text="'ثبت نام'" />
              </v-btn>
              <v-btn
                max-width="320px"
                width="100%"
                x-large
                text
                elevation="0"
                color="#0058CC"
                class="rounded-12 mx-auto"
                to="/auth/login"
                :loading="registerLoading"
                style="border-width: 2px;"
              >
                <span class="font-weight-bold" v-text="'ورود به سامانه'" />
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
import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
import { transformer, typesFa } from '~/plugins/types'
export default {
  nmae: 'RegisterPage',
  components: {
    datePicker: VuePersianDatetimePicker
  },
  layout: 'auth',
  middleware: 'auth',
  auth: 'guest',
  data () {
    return {
      rules: [],
      showPassword: false,
      registerLoading: false,
      valid: false,
      captchaImg: '/img/captcha.jpg',
      formData: {
      }
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapGetters('authServices', ['client_login_id']),
    fields () {
      const fields = [
        { title: 'first_name', model: 'first_name', rules: [this.$rules().required, this.$rules().onlyPersian], cols: 6 },
        { title: 'last_name', model: 'last_name', rules: [this.$rules().required, this.$rules().onlyPersian], cols: 6 },
        { title: 'national_code', model: 'national_code', rules: [this.$rules().required, this.$rules().nationalCodeChecker, this.$rules(10).min], maxlength: 10 },
        { title: 'gender', model: 'gender', type: 'select', items: transformer(typesFa.gender), rules: [this.$rules().required], cols: 6 },
        { title: 'birth_date', model: 'birth_date', type: 'date', cols: 6 },
        { title: 'province', model: 'province', type: 'select', items: transformer(typesFa.province), rules: [this.$rules().required] },
        { title: 'mobile', model: 'mobile', rules: [this.$rules().required, this.$rules().mobilePhoneChecker], maxlength: 11 },
        { title: 'email', model: 'email', rules: [this.$rules().emailChecker] },
        // { title: 'username', model: 'username', rules: [this.$rules().required, this.$rules().onlyEnglish] },
        { title: 'judge_degree', model: 'judge_degree', type: 'select', items: transformer(typesFa.judge_degree), rules: [], cols: 6 },
        { title: 'role', model: 'role', type: 'select', items: transformer(typesFa.role), rules: [this.$rules().required], cols: 6 },
        { title: 'password', model: 'password', rules: [this.$rules().passwordPolicy], hasPolicy: true }
      ]
      return fields
    }
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
    async userRegister () {
      if (!this.$refs.registerForm.validate()) {
        this.$toast.warning('لطفا تمامی موارد خواسته شده را تکمیل فرمایید.')
        return false
      }
      try {
        this.registerLoading = true
        const data = { ...this.formData, client_login_id: this.client_login_id }
        data.username = this.formData.national_code
        await this.$axios.$post('/user/register', data)
        this.registerLoading = false
        this.$router.replace('/auth/success')
      } catch (err) {
        console.log(err.response)
        // this.$toast.error(err.response.message)
        this.registerLoading = false
      }
    },
    dateFormat (value) {
      try {
        return Intl.DateTimeFormat('fa-IR').format(new Date(value))
      } catch (error) {
        return value
      }
    }
  }
}
</script>
