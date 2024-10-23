<template>
  <v-container class="px-6 black--text">
    <template v-if="item.approved">
      <div>
        <div class="text-body-2">
          اطلاعات <span class="font-weight-bold" v-text="userFullName" /> قبلا تایید شده است.
        </div>
        <div class="text-body-1 mt-4">
          آیا می‌خواهید کاربر را {{ actionType }} کنید؟
        </div>
      </div>
    </template>

    <div v-else class="text-body-2">
      آیا اطلاعات <span class="font-weight-bold" v-text="userFullName" /> را تایید می‌کنید؟
    </div>
    <portal to="dialogActions">
      <v-spacer />
      <template v-if="item.approved">
        <v-btn
          text
          color="primary"
          class="px-4"
          @click="$emit('closeDialog')"
        >
          انصراف
        </v-btn>
        <v-btn
          dark
          :color="item.active ? 'red darken-2' : 'success darken-2'"
          class="px-4"
          @click="handleSubmit('update')"
        >
          {{ actionType }} کردن کاربر
        </v-btn>
      </template>
      <v-btn
        v-else
        :loading="loading"
        color="primary"
        class="px-4"
        @click="handleSubmit('approve')"
      >
        بله
      </v-btn>
    </portal>
  </v-container>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    userFullName () {
      try {
        return this.item.first_name + ' ' + this.item.last_name
      } catch (error) {
        return ''
      }
    },
    actionType () {
      return this.item.active === true ? 'غیرفعال' : 'فعال'
    }
  },
  methods: {
    ...mapActions('userManagement', ['_getAllUsers', '_approveUser', '_updateUser']),
    async handleSubmit (type = 'approve') {
      try {
        this.loading = true
        if (type === 'approve') {
          await this._approveUser(this.item.id)
        } else if (type === 'update') {
          await await this._updateUser({ id: this.item.id, data: { active: !this.item.active } })
        }
        this.$toast.success('وضعیت کاربر با موفقیت تغییر کرد.')
        this._getAllUsers()
        this.$emit('closeDialog')
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
