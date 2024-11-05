<template>
  <v-container class="d-flex fill-height align-center justify-center flex-column text-center">
    <div class="my-4">
      <v-img src="/archer-sillhoute.svg" contain width="80%" max-width="400px" class="mx-auto"></v-img>
      <h1 class="text-h6 text-md-h5 text-lg-h4 font-weight-bold my-6">
به سامانه یکپارچه داوران ایران <br>خوش آمدید
    </h1>
    <v-btn to="/auth/login" color="primary" x-large class="rounded-lg">
      ورود به سامانه
    </v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'IndexPage',
  middleware: 'redirectDashboard'
}
</script>
