<template>
  <v-form ref="userForm" v-model="valid" @submit.prevent="handleSubmit">
    <v-container>
      <v-row no-gutters>
        <template v-for="(field, i) in fields">
          <v-col :key="`ufl-${i}`" cols="12" md="3">
            <label :for="field.title" class="lh-40" v-text="$t(field.title)" />
          </v-col>
          <v-col :key="`uff-${i}`" cols="12" md="6" class="pr-4">
            <v-select
              v-if="field.type === 'select'"
              v-model="formData[field.model]"
              outlined
              dense
              :rules="field.rules"
              v-bind="field"
              :items="field.items"
              :readonly="field.readonly"
            />
            <template v-else-if="field.type === 'date'">
              <div>
                <v-text-field
                  :id="field.title"
                  outlined
                  :value="dateFormat(formData[field.model])"
                  dense
                  :rules="field.rules"
                  readonly
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
            <v-text-field
              v-else
              :id="field.title"
              v-model="formData[field.model]"
              v-to-en-digits="true"
              outlined
              dense
              :rules="field.rules"
              v-bind="field"
              :readonly="field.readonly"
            />
          </v-col>
          <v-col :key="`ufs-${i}`" cols="3" />
        </template>
      </v-row>
    </v-container>
    <portal to="dialogActions">
      <v-spacer />
      <v-btn
        :disabled="!valid"
        :loading="loading"
        color="primary"
        class="px-4"
        @click="handleSubmit"
      >
        {{ btnTitle }}
      </v-btn>
    </portal>
  </v-form>
</template>
<script>
import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
import { mapActions } from 'vuex'
import { typesFa, transformer } from '~/plugins/types'
export default {
  components: {
    datePicker: VuePersianDatetimePicker
  },
  props: {
    mode: {
      type: String,
      default: 'add'
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      formData: {
      },
      valid: true,
      loading: false
    }
  },
  computed: {
    btnTitle () {
      return this.mode === 'add' ? 'افزودن کاربر' : 'ذخیره تغییرات'
    },
    fields () {
      const fields = [
        { title: 'first_name', model: 'first_name', rules: [this.$rules().required, this.$rules().onlyPersian] },
        { title: 'last_name', model: 'last_name', rules: [this.$rules().required, this.$rules().onlyPersian] },
        { title: 'national_code', model: 'national_code', rules: [this.$rules().required, this.$rules().nationalCodeChecker, this.$rules(10).min], maxlength: 10 },
        { title: 'gender', model: 'gender', type: 'select', items: transformer(typesFa.gender), rules: [this.$rules().required] },
        { title: 'birth_date', model: 'birth_date', type: 'date' },
        { title: 'province', model: 'province', type: 'select', items: transformer(typesFa.province), rules: [this.$rules().required] },
        { title: 'mobile', model: 'mobile', rules: [this.$rules().required, this.$rules().mobilePhoneChecker] },
        { title: 'email', model: 'email', rules: [this.$rules().emailChecker] },
        // { title: 'username', model: 'username', rules: [this.$rules().required, this.$rules().onlyEnglish] },
        { title: 'judge_degree', model: 'judge_degree', type: 'select', items: transformer(typesFa.judge_degree), rules: [] },
        { title: 'password', model: 'password', rules: this.mode === 'edit' ? [] : [this.$rules(8).min] },
        { title: 'user_permission', model: 'user_permission', scope: 'sa', type: 'select', items: transformer(typesFa.user_permission), readonly: this.$auth.hasScope(3) && this.item?.id === this.$auth.user.id, rules: [] },
        { title: 'role', model: 'role', scope: 'sa', type: 'select', items: transformer(typesFa.role), rules: [this.$rules().required] }
      ]
      if (this.$auth.hasScope(2)) {
        return fields.filter(f => f.scope !== 'sa')
      } else if (this.$auth.hasScope(3)) {
        return fields.filter(f => f.readonly !== true)
      } else {
        return []
      }
    }
  },
  mounted () {
    if (this.mode === 'edit') {
      const toEditFields = {}
      for (let i = 0; i < this.fields.length; i++) {
        const field = this.fields[i]
        if (field.model in this.item) {
          toEditFields[field.model] = this.item[field.model]
        }
      }
      this.formData = Object.assign({}, toEditFields)
    } else if (this.mode === 'add') {
      this.formData = Object.assign({}, {})
    }
  },
  methods: {
    ...mapActions('userManagement', ['_getAllUsers', '_updateUser', '_addUser']),
    async handleSubmit () {
      if (!this.$refs.userForm.validate()) { return false }
      try {
        this.loading = true
        if (this.mode === 'add') {
          this.formData.username = this.formData.national_code
          await this._addUser(this.formData)
        } else if (this.mode === 'edit') {
          await this._updateUser({ id: this.item.id, data: this.formData })
        }
        this.$toast.success(this.btnTitle + ' با موفقیت انجام شد.')
        this._getAllUsers()
        this.$emit('closeDialog')
      } catch (error) {

      } finally {
        this.loading = false
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
<style>

</style>
