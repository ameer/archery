<template>
  <DefaultLayout>
    <v-app-bar
      fixed
      app
      color="#fcfcfc"
      flat
      extension-height="64px"
    >
      <v-container class="px-0">
        <v-row class="justify-center">
          <v-col
            class=" d-flex align-center justify-space-between"
            cols="12"
            sm="9"
            md="6"
            lg="5"
            xl="4"
          >
            <nuxt-link to="/dashboard/user" class="d-flex align-center text-decoration-none">
              <img src="/logo.png" alt="لوگو" height="36">
              <span class="mr-2 font-weight-bold">صفحه اصلی</span>
            </nuxt-link>
            <dashboard-nav-avatar />
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-container :class="$route.name !== 'dashboard-user-result' ? 'h-100' : ''">
      <v-row class="h-100 justify-center">
        <v-col
          class="h-100"
          cols="12"
          sm="9"
          md="6"
          lg="5"
          xl="4"
        >
          <v-card class="text-center fill-height flex-grow-1 rounded-xl elevation-0">
            <Nuxt />
          </v-card>
        </v-col>
      </v-row>
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
  middleware: ['auth', 'redirectDashboard'],
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
