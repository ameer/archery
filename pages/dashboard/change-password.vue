<template>
  <div class="text-right">
    <div class="mb-4 text-h6 text-center">
      تغییر رمز عبور
    </div>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-alert v-if="showAlert" type="warning" outlined>
            جهت ادامه لطفا رمز عبور خود را بروزرسانی نمایید
          </v-alert>
          <v-form ref="changePasswordForm" v-model="valid" @submit.prevent="handleSubmit">
            <template v-for="(field, i) in fields">
              <label :key="`cpl-${i}`" :for="field.title" class="lh-40" v-text="$t(field.title)" />
              <v-text-field

                :id="field.title"
                v-bind="field"
                :key="`cpf-${i}`"
                v-model="formData[field.model]"
                v-to-en-digits="true"
                outlined
                dense
                :rules="field.rules"
                :type="field.type ?? 'text'"
                :readonly="field.readonly"
              />
              <dashboard-common-password-policy v-if="field.hasPolicy" :key="`cppf-${i}`" :value="formData.new_password" class="mb-4 mb-md-8" />
            </template>
            <div class="text-center">
              <v-btn
                :disabled="!valid"
                :loading="loading"
                color="primary"
                class="px-4"
                type="submit"
              >
                ذخیره تغییرات
              </v-btn>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  layout: 'dashboard',
  data () {
    return {
      valid: true,
      loading: false,
      formData: {
        old_password: '',
        new_password: '',
        confirmPassword: ''
      }
    }
  },
  computed: {
    showAlert () {
      return Boolean(this.$auth.user.pass_change_required) === true
    },
    fields () {
      const fields = [
        { title: 'رمز عبور فعلی', model: 'old_password', rules: [this.$rules().required], type: 'password' },
        { title: 'رمز عبور جدید', model: 'new_password', rules: [this.$rules().required, this.$rules().passwordPolicy], hasPolicy: true, type: 'password' },
        { title: 'تکرار رمز عبور جدید', model: 'confirm_password', rules: [this.$rules().required, this.$rules().passwordPolicy, this.$rules(this.formData.new_password).confirmPassword], type: 'password' }
      ]
      return fields
    }
  },
  methods: {
    ...mapActions('userService', ['_changePassword']),
    async handleSubmit () {
      if (!this.$refs.changePasswordForm.validate()) { return false }
      try {
        this.loading = true
        await this._changePassword(this.formData)
        this.$toast.success('تغییر رمز عبور با موفقیت انجام شد.')
        await this.$auth.logout()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style>

</style>
