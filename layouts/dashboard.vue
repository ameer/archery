<template>
  <DefaultLayout>
    <v-app-bar
      fixed
      app
      color="#fcfcfc"
      flat
      extension-height="64px"
    >
      <v-container class="px-0 d-flex align-center justify-space-between">
        <nuxt-link to="/dashboard/user">
          <img src="/logo.png" alt="لوگو" height="36">
        </nuxt-link>
        <dashboard-nav-avatar />
      </v-container>
    </v-app-bar>
    <v-container :class="$route.name !== 'dashboard-user-result' ? 'h-100' : ''">
      <v-card class="text-center fill-height flex-grow-1 rounded-xl elevation-0">
        <Nuxt />
      </v-card>
    </v-container>
  </DefaultLayout>
</template>
<script>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { mapActions } from 'vuex'
import DefaultLayout from '~/layouts/default.vue'
export default {
  components: {
    DefaultLayout
  },
  middleware: 'auth',
  data () {
    return {
    }
  },
  fetch () {
    this._getUserResult()
  },
  computed: {
    fullname () {
      try {
        return [this.$auth.user.first_name, this.$auth.user.last_name].join(' ')
      } catch (error) {
        return 'کاربر عزیز'
      }
    }
  },
  methods: {
    ...mapActions('userService', ['_getUserResult'])
  }
}
</script>
<style>
</style>
