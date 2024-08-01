<template>
  <v-container>
    <v-form ref="otpForm" v-model="valid" @submit.prevent="handleSubmit">
      <div class="black--text d-flex flex-column align-center text-body-2 mb-4">
        <span>
          یک کد تایید جهت شروع آزمون، به شماره
        </span>
        <div dir="ltr" class="mx-2 font-weight-bold">
          {{ maskedMobileNumber }}
        </div>
        <span>
          پیامک شده است. لطفا کد را در کادر زیر وارد نمایید:
        </span>
      </div>
      <div style="max-width: 320px;" dir="ltr" class="mx-auto text-center">
        <v-text-field
          ref="otpInput"
          v-model="formData.otp"
          autofocus
          autocomplete="off"
          maxlength="6"
          :rules="[$rules().required, $rules().numeric, $rules(6).min, $rules(6).max]"
          label=""
          placeholder="- - - - - -"
          outlined
          class="rounded custom-otp-input"
          type="tel"
        />
      </div>
      <div class="mt-4 text-center">
        <div v-if="codeExpireTime !== 0">
          امکان ارسال مجدد کد پس از <span>{{ timerText }}</span>
        </div>
        <v-btn v-else text color="primary" :loading="otpLoading" @click="resendOTP">
          ارسال مجدد کد تایید
        </v-btn>
      </div>
      <div class="mt-4 text-center">
        <v-btn
          :disabled="!valid"
          :loading="loading"
          color="primary"
          class="px-4"
          @click="handleSubmit"
        >
          تایید و شروع آزمون
        </v-btn>
      </div>
    </v-form>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    maskedMobileNumber: {
      type: String,
      default: ''
    },
    fingerprint: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => {}
    },
    action: {
      type: Function,
      default: () => false
    }
  },
  data () {
    return {
      valid: true,
      loading: false,
      otpLoading: false,
      formData: {
        otp: ''
      }
    }
  },
  computed: {
    ...mapGetters('authServices', ['timerText', 'codeExpireTime', 'client_login_id'])
  },
  mounted () {
    try {
      this.$refs.otpInput.focus()
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    ...mapActions('authServices', ['_sendOTP']),
    async handleSubmit () {
      if (!this.$refs.otpForm.validate()) {
        return false
      }
      const data = {
        otp: this.formData.otp,
        client_login_id: this.client_login_id,
        fingerprint: this.fingerprint
      }
      try {
        try {
          this.loading = true
          await this.action(this.item.id, data)
          this.$emit('closeDialog')
        } catch (error) {
          console.log(error)
        } finally {
          this.loading = false
        }
      } catch (error) {

      }
    },
    async resendOTP () {
      try {
        this.formData.otp = ''
        this.otpLoading = true
        await this._sendOTP(this.item.id)
      } catch (error) {
        console.log(error)
      } finally {
        this.otpLoading = false
      }
    }
  }
}
</script>
<style>

</style>
