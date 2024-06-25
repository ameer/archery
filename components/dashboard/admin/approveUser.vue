<template>
  <v-container class="px-6 black--text">
    <div v-if="item.approved" class="text-body-2">
      اطلاعات <span class="font-weight-bold" v-text="userFullName" /> قبلا تایید شده است.
    </div>
    <div v-else class="text-body-2">
      آیا اطلاعات <span class="font-weight-bold" v-text="userFullName" /> را تایید می‌کنید؟
    </div>
    <portal to="dialogActions">
      <v-spacer />
      <v-btn
        v-if="item.approved"
        color="primary"
        class="px-4"
        @click="$emit('closeDialog')"
      >
        متوجه شدم
      </v-btn>
      <v-btn
        v-else
        :loading="loading"
        color="primary"
        class="px-4"
        @click="handleSubmit"
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
    }
  },
  methods: {
    ...mapActions('userManagement', ['_getAllUsers', '_approveUser']),
    async handleSubmit () {
      try {
        this.loading = true
        await this._approveUser(this.item.id)
        this.$toast.success('کاربر با موفقیت تایید شد.')
        this._getAllUsers()
        this.$emit('closeDialog')
      } catch (error) {

      } finally {
        this.loading = false
      }
    }
  }
}
</script>
  <style>

  </style>
