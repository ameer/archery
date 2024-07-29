<template>
  <div>
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
              lg="9"
              xl="8"
            >
              <nuxt-link to="/dashboard" class="d-flex align-center text-decoration-none">
                <img src="/logo.png" alt="لوگو" height="36">
              </nuxt-link>
              <dashboard-nav-avatar />
            </v-col>
          </v-row>
        </v-container>
      </v-app-bar>
      <v-main :class="mainClass">
        <v-container :class="$route.name !== 'dashboard-user-result' ? 'h-100' : ''">
          <v-row class="h-100 justify-center" no-gutters>
            <v-col
              class="h-100"
              cols="12"
              lg="9"
              xl="8"
            >
              <v-card class="surface text-center fill-height flex-grow-1 rounded-xl elevation-0 pa-4">
                <nuxt />
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
      <!-- Start Dialogs Section -->
      <dashboard-common-dialog v-model="commonDialogOpen" :width="dialogWidth" :title="componentData.title" :card-height="dialogCardHeight">
        <component :is="commonDialogComp" v-if="commonDialogOpen === true" v-bind="componentData" @closeDialog="closeDialog('common')" />
      </dashboard-common-dialog>
      <dashboard-common-dialog v-model="confirmDialogOpen" :width="confirmDialogWidth" :title="confirmDialogData.title" :card-height="confirmDialogCardHeight">
        <component :is="confirmDialogComp" v-if="confirmDialogOpen === true" v-bind="confirmDialogData" @closeDialog="closeDialog('confirm')" />
      </dashboard-common-dialog>
    <!-- End Dialogs Section -->
    </DefaultLayout>
  </div>
</template>
<script>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { mapActions } from 'vuex'
import DefaultLayout from '~/layouts/default.vue'
export default {
  components: {
    DefaultLayout
  },
  middleware: ['auth', 'pass_change_required', 'redirectDashboard'],
  data () {
    return {
      commonDialogOpen: false,
      commonDialogComp: '',
      componentData: {},
      dialogCardHeight: '100vh',
      dialogWidth: 648,
      confirmDialogOpen: false,
      confirmDialogComp: '',
      confirmDialogData: {},
      confirmDialogCardHeight: '100vh',
      confirmDialogWidth: 648
    }
  },
  computed: {
    fullname () {
      try {
        return [this.$auth.user.first_name, this.$auth.user.last_name].join(' ')
      } catch (error) {
        return 'کاربر عزیز'
      }
    },
    mainClass () {
      if (this.$auth.hasScope(3)) {
        return 'super-admin'
      } else {
        return 'admin'
      }
    }
  },
  created () {
    this.$nuxt.$on('openCommonDialog', this.handleCommonDialog)
    this.$nuxt.$on('openConfirmDialog', this.handleConfirmDialog)
  },
  beforeDestroy () {
    this.$nuxt.$off('openCommonDialog', this.handleCommonDialog)
    this.$nuxt.$off('openConfirmDialog', this.handleConfirmDialog)
  },
  methods: {
    handleCommonDialog (component, data) {
      this.commonDialogComp = component
      this.componentData = Object.assign({}, data)
      if (data.cardHeight) {
        this.dialogCardHeight = data.cardHeight
      } else {
        this.dialogCardHeight = '100vh'
      }
      if (data.dialogWidth) {
        this.dialogWidth = data.dialogWidth
      } else {
        this.dialogWidth = 648
      }
      this.$nextTick(() => {
        this.commonDialogOpen = true
      })
    },
    handleConfirmDialog (component, data) {
      this.confirmDialogComp = component
      this.confirmDialogData = Object.assign({}, data)
      if (data.cardHeight) {
        this.confirmDialogCardHeight = data.cardHeight
      } else {
        this.confirmDialogCardHeight = '100vh'
      }
      if (data.dialogWidth) {
        this.confirmDialogWidth = data.dialogWidth
      } else {
        this.confirmDialogWidth = 648
      }
      this.$nextTick(() => {
        this.confirmDialogOpen = true
      })
    },
    closeDialog (dialogName) {
      if (dialogName === 'common') { this.commonDialogOpen = false } else if (dialogName === 'confirm') { this.confirmDialogOpen = false }
    }
  }
}
</script>
<style>
</style>
