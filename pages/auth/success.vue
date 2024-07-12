<template>
  <v-container fluid class="fill-height glass-bg">
    <v-row justify="center">
      <v-col
        cols="12"
        sm="7"
        md="6"
        lg="4"
        xl="3"
        class="text-center"
      >
        <v-card class="glass-card mx-auto py-4 px-6 text-center" max-width="450px">
          <v-avatar tile>
            <v-img src="/logo.png" />
          </v-avatar>
          <h1 class="font-weight-bold text-h5 mt-6 success--text">
            ثبت‌نام شما با موفقیت انجام شد!
          </h1>
          <div class="mt-4">
            لطفا تا تایید ثبت‌نام توسط مدیریت سامانه، شکیبا باشید.
          </div>
          <v-btn
            max-width="320px"
            width="100%"
            x-large
            text
            elevation="0"
            color="#0058CC"
            class="rounded-12 mx-auto"
            to="/auth/login"
            style="border-width: 2px;"
          >
            <span class="font-weight-bold" v-text="'ورود به سامانه'" />
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>

export default {
  nmae: 'SuccessPage',
  layout: 'auth',
  middleware: 'auth',
  auth: 'guest'
}
</script>
