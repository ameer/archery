<template>
  <div class="d-contents">
    <v-row v-if="allUsers.length > 0" align="stretch">
      <v-col
        v-for="(user, i) in allUsers"
        :key="`user-card-${i}`"
        cols="12"
        sm="6"
        md="4"
        xl="3"
      >
        <v-card class="glass-card rounded-lg">
          <div class="d-flex align-center px-4">
            <v-avatar size="48" class="rounded-lg" color="primary">
              <span class="text-h6 font-weight-bold white--text">
                {{ user.name.charAt(0) }}
              </span>
            </v-avatar>
            <div style="min-width: 0;">
              <v-card-title :title="user.name">
                <span class="text-truncate d-inline-block">{{ user.name }}</span>
              </v-card-title>
              <v-card-subtitle class="disabled">
                <v-icon small>
                  mdi-briefcase-outline
                </v-icon>
                <span> {{ user.userCompanyName }} </span>
              </v-card-subtitle>
            </div>
            <v-spacer />
            <div>
              <v-btn fab icon small title="ویرایش کاربر" @click="openEditDialog(i)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4" xl="3" class="">
        <v-card class="glass-card rounded-lg fill-height">
          <div class="d-flex align-center justify-center px-4 fill-height">
            <v-btn
              outlined
              height="48"
              min-width="48"
              class="rounded-lg px-2"
              color="grey"
              disabled
            >
              <v-icon>mdi-account</v-icon>
            </v-btn>
            <div class="ms-4">
              <v-btn height="48" text color="primary" @click="openUserDialog">
                <v-icon left>
                  mdi-plus
                </v-icon>
                <span v-text="'افزودن کاربر جدید'" />
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <dashboard-empty-state :item="'کاربر'" :loading="loading.getAllUsers" @newBtnClick="openUserDialog" />
      </v-col>
    </v-row>
    <dashboard-common-dialog v-model="dialog" card-height="auto" :width="768">
      <template #dialogInner>
        <v-card-title>
          <span v-text="cardTitle" />
          <v-spacer />
          <v-btn v-if="edit && formData.userType !== 1" color="error" class="elevation-0 rounded-12 mr-auto px-8" @click="confirmDeleteUser(formData.id)">
            <v-icon left>
              mdi-account-minus
            </v-icon>
            <span>حذف کاربر</span>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-form ref="userForm" @submit.prevent="submit">
          <v-container>
            <v-row>
              <v-col v-for="(field, i) in fields" :key="`uf-${i}`" cols="12" sm="6" lg="4">
                <v-select
                  v-if="field.type === 'select'"
                  v-bind="field"
                  v-model="formData[field.name]"
                  aria-autocomplete="none"
                  autocomplete="off"
                  required
                  class="rounded-12 mb-4"
                  outlined
                  :label="field.label"
                  hide-details="auto"
                />
                <v-text-field
                  v-else
                  v-bind="field"
                  v-model="formData[field.name]"
                  autofocus
                  aria-autocomplete="none"
                  autocomplete="off"
                  required
                  class="rounded-12 mb-4"
                  outlined
                  :label="field.label"
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </v-container>
          <v-card-text />
          <v-card-actions>
            <v-btn
              dark
              x-large
              elevation="0"
              color="#0058CC"
              class="rounded-12 mr-auto px-8"
              type="submit"
              :loading="loading.createUser"
            >
              <v-icon left>
                {{ edit ? 'mdi-floppy' : 'mdi-plus' }}
              </v-icon>
              <span class="white--text font-weight-bold" v-text="btnText" />
            </v-btn>
          </v-card-actions>
        </v-form>
      </template>
    </dashboard-common-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  layout: 'dashboard',
  data () {
    return {
      dialog: false,
      formData: {},
      edit: false
    }
  },
  fetch () {
    this._getAllUsers()
    this._getUserTypes()
    if (this.allCompanies.length === 0) {
      this._getAllCompanies()
    }
  },
  computed: {
    ...mapGetters('users', ['allUsers', 'userTypes']),
    ...mapGetters('companies', ['allCompanies']),
    ...mapGetters(['loading']),
    cardTitle () {
      return this.edit ? 'ویرایش کاربر' : 'افزودن کاربر جدید'
    },
    btnText () {
      return this.edit ? 'ذخیره تغییرات' : 'افزودن کاربر'
    },
    fields () {
      return [
        { name: 'companyId', type: 'select', label: 'شرکت کاربر', items: this.allCompanies, itemText: 'name', itemValue: 'id' },
        { name: 'name', type: 'text', label: 'نام و نام خانوادگی' },
        { name: 'nationalCode', type: 'text', label: 'کد ملی' },
        { name: 'mobile', type: 'text', label: 'موبایل' },
        { name: 'email', type: 'text', label: 'ایمیل' },
        { name: 'username', type: 'text', label: 'نام کاربری', readonly: this.edit, disabled: this.edit },
        { name: 'password', type: 'password', label: 'گذرواژه' },
        { name: 'confirmPassword', type: 'password', label: 'تکرار گذرواژه' },
        { name: 'title', type: 'text', label: 'عنوان کاربر' },
        { name: 'userType', type: 'select', label: 'نوع کاربر', items: this.userTypes, itemText: 'userType' }
      ]
    }
  },
  watch: {
    dialog (n) {
      if (n === false) {
        this.$refs.userForm?.reset()
        this.edit = false
      }
    }
  },
  methods: {
    ...mapActions('users', ['_getAllUsers', '_getUserTypes', '_createUser', '_editUser', '_deleteUser']),
    ...mapActions('companies', ['_getAllCompanies']),
    openUserDialog () {
      this.dialog = true
    },
    openEditDialog (index) {
      const user = this.allUsers[index]
      if (user) {
        const obj = {}
        for (let i = 0; i < this.fields.length; i++) {
          const { name } = this.fields[i]
          obj[name] = user[name]
        }
        obj.id = user.id
        this.formData = Object.assign({}, obj)
        this.edit = true
        this.openUserDialog()
      }
    },
    confirmDeleteUser (id) {
      const answer = confirm('از حذف کاربر اطمینان دارید؟')
      if (answer) {
        const formData = { active: false }
        this._deleteUser({ formData, id }).then(this.closeRoutine)
      }
    },
    submit () {
      let action = '_createUser'
      let id = -1
      const formData = { ...this.formData }
      delete formData.confirmPassword
      if (this.edit) {
        action = '_editUser'
        id = formData.id
        delete formData.id
        delete formData.username // not editable
      }
      this[action]({ formData, id }).then(this.closeRoutine)
    },
    closeRoutine () {
      this.dialog = false
      this.$nuxt.refresh()
    }
  }
}
</script>
<style></style>
