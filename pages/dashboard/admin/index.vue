<template>
  <div class="d-flex flex-column">
    <v-btn
      v-for="(link, i) in links"
      :key="`adl-${i}`"
      :to="link.to"
      :class="link.color"
      large
      class="mb-4 font-weight-bold rounded-xl"
    >
      <span class="white--text">
        {{ link.text }}
      </span>
    </v-btn>
  </div>
</template>
<script>
export default {
  layout: 'dashboard',
  data () {
    return {
      links: [
        { text: 'آزمون‌ها', to: '/dashboard/admin/exams', color: 'blue darken-3' },
        { text: 'مدیریت کاربران', to: '/dashboard/admin/users', color: 'green' },
        { text: 'سوالات', to: '/dashboard/admin/questions', color: 'teal darken-2' }
      ]
    }
  }
}
</script>
<style>

</style>
