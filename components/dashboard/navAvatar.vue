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
      <div class="d-flex align-center" v-bind="attrs" v-on="on">
        <v-btn
          icon
          color="grey darken-3"
          class="ml-n3"
          :ripple="false"
        >
          <v-avatar
            color=""
            size="28"
          >
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
        </v-btn>
        <span class="ms-2" v-text="username" />
      </div>
    </template>
    <v-card>
      <v-list>
        <v-list-item v-for="(link, i) in links" :key="`nal-${i}`" :to="link.to" exact color="primary">
          <v-list-item-icon class="ml-2">
            <v-icon>
              {{ link.icon }}
            </v-icon>
          </v-list-item-icon>
          {{ link.title }}
        </v-list-item>
        <v-list-item color="red darken-1" @click="logout">
          <v-list-item-icon class="ml-2 mr-0">
            <v-icon size="24" color="red darken-1">
              mdi-logout
            </v-icon>
          </v-list-item-icon>
          <span class="red--text text--darken-1 text-body-2 font-weight-medium" v-text="'خروج از حساب کاربری'" />
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
<script>
// aa
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
    },
    links () {
      const scope = this.$auth.hasScope(1) ? 'user' : 'admin'
      const links = [
        { title: 'صفحه اول', to: '/dashboard/', icon: 'mdi-home-outline', scope: 'user' },
        { title: 'آزمون‌ها', to: `/dashboard/${scope}/exams`, icon: 'mdi-text-box-check-outline', scope: 'user' },
        { title: 'کاربران', to: `/dashboard/${scope}/users`, icon: 'mdi-account-group', scope: 'admin' },
        { title: 'سوالات', to: `/dashboard/${scope}/questions`, icon: 'mdi-chat-question-outline', scope: 'admin' },
        { title: 'اطلاعات کاربری', to: '/dashboard/profile', icon: 'mdi-account-details', scope: 'user' },
        { title: 'رمز عبور', to: '/dashboard/password', icon: 'mdi-form-textbox-password', scope: 'user' }
      ]
      return links.filter(l => l.scope === scope)
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
