<template>
  <div>
    <h3 class="text-h6 font-weight-bold">
      اطلاعات کاربری
    </h3>
    <v-divider class="my-3" />
    <v-form
      ref="editProfileForm"
      v-model="valid"
      autocomplete="off"
      class=""
      aria-autocomplete="none"
      @submit.prevent="editProfile"
    >
      <v-container>
        <v-row dense>
          <div v-for="(field, i) in fields" :key="`urf-${i}`" class="col" :class="field.cols ?? 'col-12'">
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
                  :value="$dateFormat(formData[field.model])"
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
          </div>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn color="primary" class="rounded-xl" x-large type="submit" :loading="loading">
              ذخیره اطلاعات
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { transformer, typesFa } from '~/plugins/types'
export default {
  name: 'ProfilePage',
  layout: 'dashboard',
  data () {
    return {
      valid: true,
      loading: false,
      formData: {

      }
    }
  },
  computed: {
    fields () {
      const fields = [
        { title: 'first_name', model: 'first_name', cols: 'col-md-6 col-12', readonly: true },
        { title: 'last_name', model: 'last_name', cols: 'col-md-6 col-12', readonly: true },
        { title: 'national_code', model: 'national_code', readonly: true },
        { title: 'gender', model: 'gender', type: 'select', items: transformer(typesFa.gender), cols: 'col-12', readonly: true },
        { title: 'province', model: 'province', type: 'select', items: transformer(typesFa.province), cols: 'col-12', readonly: true },
        { title: 'mobile', model: 'mobile', readonly: true },
        { title: 'judge_degree', model: 'judge_degree', type: 'select', items: transformer(typesFa.judge_degree), readonly: true, cols: 'col-md-6 col-12' },
        { title: 'father_name', model: 'father_name', rules: [this.$rules().onlyPersian], cols: 'col-md-6 col-12' },
        { title: 'birth_date', model: 'birth_date', type: 'date', cols: 'col-md-6 col-12' },
        { title: 'city', model: 'city', rules: [this.$rules().onlyPersian], cols: 'col-md-6 col-12' },
        { title: 'club', model: 'club', rules: [this.$rules().onlyPersian], cols: 'col-md-6 col-12' },
        { title: 'address', model: 'address', rules: [this.$rules(4).min, this.$rules(255).max] },
        { title: 'postal_code', model: 'postal_code', rules: [this.$rules(10).min, this.$rules(10).max], maxlength: 10 },
        { title: 'email', model: 'email', rules: [this.$rules().emailChecker] }
      ]
      return fields
    }
  },
  created () {
    this.formData = Object.assign({}, this.$auth.user)
  },
  methods: {
    ...mapActions('userService', ['_updateUser']),
    async editProfile () {
      if (!this.$refs.editProfileForm.validate()) { return false }
      try {
        const data = {
          father_name: this.formData.father_name,
          birth_date: this.formData.birth_date,
          city: this.formData.city,
          club: this.formData.club,
          address: this.formData.address,
          postal_code: this.formData.postal_code,
          emai: this.formData.email
        }
        await this._updateUser(data)
        this.$toast.success('تغییرات با موفقیت انجام شد.')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style>

</style>
