<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-menu
    v-model="menu"
    content-class="profile-popup-menu"
    :open-on-hover="openOnHover"
    :close-on-content-click="false"
    :nudge-bottom="12"
    min-width="164"
    offset-y
    right
  >
    <template #activator="{ on, attrs }">
      <div class="d-flex align-center">
        <v-btn
          text
          v-bind="attrs"
          color="grey darken-3"
          class="ml-n3"
          v-on="on"
        >
          <v-avatar
            color=""
            size="28"
          >
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
          <span class="ms-2" v-text="username" />
          <v-icon right size="22">
            mdi-chevron-down
          </v-icon>
        </v-btn>
      </div>
    </template>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-action>
            <v-btn
              text
              :ripple="false"
              color="red darken-1"
              @click="logout"
            >
              <v-icon left size="24">
                mdi-logout
              </v-icon>
              <span class="text-body-2 font-weight-medium" v-text="'خروج از حساب کاربری'" />
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
<script>
export default {
  data () {
    return {
      menu: false,
      openOnHover: false
    }
  },
  computed: {
    username () {
      try {
        return [this.$auth.user.first_name, this.$auth.user.last_name].join(' ')
      } catch (error) {
        return 'کاربر سامانه'
      }
    },
    initials () {
      const tempArr = this.username.split(' ')
      return tempArr[0].charAt(0) + '.' + tempArr[1]?.charAt(0)
    }
  },
  methods: {
    logout () {
      this.$auth.logout()
    }
  }
}
</script>
<style>
.profile-popup-menu .v-card {
    border-radius: 10px !important;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.05), 0 7px 15px 0 rgba(0, 0, 0, 0.23) !important;
}
</style>
