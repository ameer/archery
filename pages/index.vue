<template>
  <v-container class="fill-height text-center">
    <v-btn to="/auth/login" color="primary">
      از اینجا وارد شوید
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'IndexPage',
  middleware: 'redirectDashboard'
}
</script>
