<template>
  <DefaultLayout>
    <v-app-bar
      fixed
      app
      color="transparent"
      flat
      class="pa-0"
      extension-height="64px"
    >
      <v-container>
        <v-row class="justify-center">
          <v-col
            class="d-flex surface align-center justify-space-between rounded-b-xl"
            cols="12"
            sm="9"
            md="8"
            lg="7"
            xl="6"
          >
            <nuxt-link to="/dashboard" class="d-flex align-center text-decoration-none">
              <img src="/logo.png" alt="لوگو" height="36">
            </nuxt-link>
            <dashboard-nav-avatar />
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container :class="$route.name !== 'dashboard-user-result' ? 'h-100' : ''">
        <v-row class="h-100 justify-center" no-gutters>
          <v-col
            class="h-100"
            cols="12"
            sm="9"
            md="8"
            lg="7"
            xl="6"
          >
            <v-card class="surface text-center fill-height flex-grow-1 rounded-xl elevation-0 pa-4">
              <Nuxt />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <!-- Start Dialogs Section -->
    <dashboard-common-dialog v-model="commonDialogOpen" :width="648" :title="componentData.title">
      <component :is="commonDialogComp" v-if="commonDialogOpen === true" v-bind="componentData" @closeDialog="closeDialog" />
    </dashboard-common-dialog>
    <!-- End Dialogs Section -->
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
      commonDialogOpen: false,
      commonDialogComp: '',
      componentData: {}
    }
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
  created () {
    this.$nuxt.$on('openCommonDialog', this.handleCommonDialog)
  },
  beforeDestroy () {
    this.$nuxt.$off('openCommonDialog', this.handleCommonDialog)
  },
  methods: {
    handleCommonDialog (component, data) {
      this.commonDialogComp = component
      this.componentData = Object.assign({}, data)
      this.$nextTick(() => {
        this.commonDialogOpen = true
      })
    },
    closeDialog () {
      this.commonDialogOpen = false
    }
  }
}
</script>
<style>
</style>
