<template>
  <DefaultLayout>
    <v-main>
      <Nuxt />
    </v-main>
  </DefaultLayout>
</template>
<script>
import DefaultLayout from '~/layouts/default.vue'
export default {
  components: {
    DefaultLayout
  },
  middleware: 'auth',
  auth: 'guest'
}
</script>
<style>

</style>
