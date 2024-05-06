<template>
  <div class="text-center">
    <v-btn to="/auth/login">
      ورود به سامانه
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  middleware: 'redirectIndex'
}
</script>
