<template>
  <div>
    <v-btn-toggle
      v-model="statusFilters"
      multiple
      class="w-100"
    >
      <v-btn :value="'active:true'" class="flex-grow-1" :active-class="'blue lighten-3'">
        کاربران فعال
      </v-btn>
      <v-btn :value="'active:false'" class="flex-grow-1" :active-class="'blue lighten-3'">
        کاربران غیرفعال
      </v-btn>
      <v-btn :value="'approved:false'" class="flex-grow-1" :active-class="'blue lighten-3'">
        کاربران در انتظار تایید
      </v-btn>
    </v-btn-toggle>
    <v-container class="px-0 mt-4">
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
            :label="filter.label"
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
      <template #active="{item}">
        <div>
          <v-icon v-if="item.active" color="success">
            mdi-check-circle
          </v-icon>
          <v-icon v-else color="error">
            mdi-close-circle
          </v-icon>
        </div>
      </template>
      <template #actions="{item}">
        <div v-if="!item.is_deleted" class="d-flex align-center justify-space-between">
          <v-btn
            v-for="(btn, i) in actions"
            :key="`audt-${i}`"
            icon
            small
            :class="btn.class"
            :color="btn.color"
            :title="btn.title"
            @click="actionHandler(btn.action, item)"
          >
            <v-icon>{{ btn.icon }}</v-icon>
          </v-btn>
        </div>
        <div v-else-if="item.is_deleted" class="d-flex align-center justify-space-between">
          <span class="text-caption error--text">حذف شده</span>
          <v-btn
            v-for="(btn, i) in deletedItemActions"
            :key="`audt-${i}`"
            icon
            small
            :class="btn.class"
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
        { text: 'وضعیت', value: 'active', align: 'center', type: 'customSlot' },
        { text: 'جنسیت', value: 'gender', align: 'center', type: 'type', fa: true },
        { text: 'سطح دسترسی', value: 'user_permission', align: 'center', type: 'type', fa: true },
        { text: 'عملیات', value: 'actions', align: 'center', sortable: false, type: 'customSlot' }
      ],
      users: [],
      actions: [
        { title: 'ویرایش', action: 'editUser', icon: 'mdi-account-edit-outline', color: '' },
        { title: 'تغییر وضعیت', action: 'approveUser', icon: 'mdi-list-status', color: 'primary' },
        { title: 'حذف', action: 'deleteUser', icon: 'mdi-delete', color: 'error', class: 'sa-only' }
      ],
      deletedItemActions: [
        { title: 'بازگردانی', action: 'undeleteUser', icon: 'mdi-delete-off', color: 'primary', class: 'sa-only' }
      ],
      tableTitle: 'مدیریت کاربران',
      statusFilters: [],
      dropdownFilters: [
        { label: 'استان', model: 'province', items: transformer(typesFa.province, true) },
        { label: 'درجه', model: 'judge_degree', items: transformer(typesFa.judge_degree, true) },
        { label: 'جنسیت', model: 'gender', items: transformer(typesFa.gender, true) }
      ],
      secondaryFilters: {
        province: 'all',
        judge_degree: 'all',
        gender: 'all'
      }
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
        const keys = Object.keys(this.secondaryFilters)
        if (keys.length === 0) {
          return this.filteredUsers
        } else {
          return this.filteredUsers.filter((user) => {
            return keys.every((key) => {
              if (this.secondaryFilters[key] === 'all') {
                return true
              }
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
    ...mapActions('userManagement', ['_getAllUsers', '_deleteUser', '_undeleteUser']),
    actionHandler (action, item = {}) {
      const self = this
      let comp = ''
      let data = {}
      if (action === 'editUser') {
        comp = 'dashboard-admin-add-edit-user-dialog'
        data = { title: 'ویرایش کاربر', mode: 'edit', item }
      } else if (action === 'addUser') {
        comp = 'dashboard-admin-add-edit-user-dialog'
        data = { title: 'افزودن کاربر', mode: 'add' }
      } else if (action === 'approveUser') {
        comp = 'dashboard-admin-approve-user'
        data = { title: 'تایید اطلاعات کاربر', item, cardHeight: 'auto' }
      } else if (action === 'deleteUser') {
        comp = 'dashboard-common-confirm-dialog'
        const msg = `حذف حساب کاربری ${item.first_name} ${item.last_name}`
        data = {
          title: 'تایید حذف کاربر',
          item,
          cardHeight: 'auto',
          msg,
          action () {
            return new Promise((resolve, reject) => {
              self._deleteUser(item.id).then((resp) => {
                self._getAllUsers()
                this.$toast.success('با موفقیت حذف شد.')
                resolve(resp)
              }).catch((error) => {
                reject(error)
              })
            })
          }
        }
      } else if (action === 'undeleteUser') {
        comp = 'dashboard-common-confirm-dialog'
        const msg = `بازگردانی حساب کاربری ${item.first_name} ${item.last_name}`
        data = {
          title: 'تایید بازگردانی کاربر',
          item,
          cardHeight: 'auto',
          msg,
          action () {
            return new Promise((resolve, reject) => {
              self._undeleteUser(item.id).then((resp) => {
                self._getAllUsers()
                this.$toast.success('با موفقیت بازگردانی شد.')
                resolve(resp)
              }).catch((error) => {
                reject(error)
              })
            })
          }
        }
      }
      if (comp !== '') {
        this.o(comp, data)
      }
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
