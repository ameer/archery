<template>
  <div>
    <v-btn-toggle
      v-model="statusFilters"
      multiple
      class="w-100"
    >
      <v-btn :value="'active:true'" class="flex-grow-1">
        کاربران فعال
      </v-btn>
      <v-btn :value="'active:false'" class="flex-grow-1">
        کاربران غیرفعال
      </v-btn>
      <v-btn :value="'approved:false'" class="flex-grow-1">
        کاربران در انتظار تایید
      </v-btn>
    </v-btn-toggle>
    <v-container class="px-0">
      <v-row>
        <v-col
          v-for="(filter, i) in dropdownFilters"
          :key="`af-${i}`"
          cols="6"
          md="4"
          lg="3"
        >
          <v-select
            v-model="secondaryFilters[filter.model]"
            outlined
            :items="filter.items"
            dense
          />
        </v-col>
      </v-row>
    </v-container>
    <v-divider class="mt-3" />
    <div
      class="px-1 d-flex align-center my-3"
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
    </div>
    <dashboard-common-custom-dt
      :table-headers="tableHeaders"
      :items="secondaryFilteredUsers"
      class="elevation-1"
    >
      <template #actions="{item}">
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
    </dashboard-common-custom-dt>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { transformer, typesFa } from '~/plugins/types'
export default {
  layout: 'dashboard',
  data () {
    return {
      tableHeaders: [
        { text: 'نام', value: 'first_name', align: 'center' },
        { text: 'نام خانوادگی', value: 'last_name', align: 'center' },
        { text: 'استان', value: 'province', align: 'center', type: 'type', fa: true },
        { text: 'درجه', value: 'judge_degree', align: 'center', type: 'type', fa: true },
        { text: 'سطح دسترسی', value: 'user_permission', align: 'center', type: 'type', fa: true },
        { text: 'عملیات', value: 'actions', align: 'center', sortable: false, type: 'customSlot' }
      ],
      users: [],
      actions: [
        { title: 'ویرایش', action: 'editUser', icon: 'mdi-account-edit-outline', color: '' },
        { title: 'تغییر وضعیت', action: 'toggleUserActive', icon: 'mdi-list-status', color: 'primary' },
        { title: 'حذف', action: 'deleteUser', icon: 'mdi-delete', color: 'error' }
      ],
      tableTitle: 'مدیریت کاربران',
      statusFilters: [],
      dropdownFilters: [
        { label: 'استان', model: 'province', items: transformer(typesFa.province) },
        { label: 'درجه', model: 'judge_degree', items: transformer(typesFa.judge_degree) }
      ],
      secondaryFilters: {}
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
    ...mapGetters('userManagement', ['allUsers']),
    filteredUsers () {
      if (this.statusFilters.length === 0) {
        return this.allUsers
      } else {
        return this.allUsers.filter((user) => {
          if (this.statusFilters.includes('approved:false') && !user.approved) {
            return true
          } else if (this.statusFilters.includes('active:true') && user.active) {
            return true
          } else if (this.statusFilters.includes('active:false') && !user.active) {
            return true
          } else {
            return false
          }
        })
      }
    },
    secondaryFilteredUsers () {
      try {
        if (Object.keys(this.secondaryFilters).length === 0) {
          return this.filteredUsers
        } else {
          return this.filteredUsers.filter((user) => {
            return Object.keys(this.secondaryFilters).every((key) => {
              return user[key] === this.secondaryFilters[key]
            })
          })
        }
      } catch (error) {
        console.log(error)
        return this.filteredUsers
      }
    }
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
