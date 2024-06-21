<template>
  <div>
    <v-data-table
      :headers="tableHeaders"
      :items="allUsers"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>{{ tableTitle }}</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer />
          <v-btn color="primary" @click="actionHandler('addUser')">
            افزودن کاربر
          </v-btn>
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{item}">
        <div class="d-flex align-center justify-space-between">
          <v-btn
            v-for="(btn, i) in actions"
            :key="`audt-${i}`"
            icon
            small
            :color="btn.color"
            :title="btn.title"
            @click="actionHandler(btn.action, item)"
          >
            <v-icon>{{ btn.icon }}</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  layout: 'dashboard',
  data () {
    return {
      tableHeaders: [
        { text: 'نام', value: 'first_name' },
        { text: 'نام خانوادگی', value: 'last_name' },
        { text: 'استان', value: 'province' },
        { text: 'درجه', value: 'judge_degree' },
        { text: 'سطح دسترسی', value: 'user_permission' },
        { text: 'عملیات', value: 'actions', align: 'center', sortable: false }
      ],
      users: [],
      actions: [
        { title: 'ویرایش', action: 'editUser', icon: 'mdi-account-edit-outline', color: '' },
        { title: 'تغییر وضعیت', action: 'toggleUserActive', icon: 'mdi-list-status', color: 'primary' },
        { title: 'حذف', action: 'deleteUser', icon: 'mdi-delete', color: 'error' }
      ],
      tableTitle: 'مدیریت کاربران'
    }
  },
  async fetch () {
    try {
      await this._getAllUsers()
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    ...mapGetters('userManagement', ['allUsers'])
  },
  methods: {
    ...mapActions('userManagement', ['_getAllUsers']),
    actionHandler (action, item = {}) {
      let comp = ''
      let data = {}
      if (action === 'editUser') {
        comp = 'dashboard-admin-add-edit-user-dialog'
        data = { title: 'ویرایش کاربر', mode: 'edit', item }
      } else if (action === 'addUser') {
        comp = 'dashboard-admin-add-edit-user-dialog'
        data = { title: 'ویرایش کاربر', mode: 'add' }
      }
      this.o(comp, data)
    },
    // Open Common Dialog
    o (comp, data) {
      this.$nuxt.$emit('openCommonDialog', comp, data)
    }
  }
}
</script>
<style>

</style>
