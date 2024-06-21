<template>
  <div>
    <v-btn v-for="(link, i) in links" :key="`adl-${i}`" :to="link.to">
      {{ link.text }}
    </v-btn>
  </div>
</template>
<script>
export default {
  layout: 'dashboard',
  data () {
    return {
      links: [
        { text: 'مدیریت کاربران', to: '/dashboard/admin/users' }
        // {text: '', to: ''}
      ]
    }
  }
}
</script>
<style>

</style>
