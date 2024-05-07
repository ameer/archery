<template>
  <div>
    <div class="d-flex align-center justify-space-between pa-4 pb-0">
      <div class="text-h6 font-weight-bold text-center">
        نتیجه آزمون
      </div>
      <v-btn
        class="rounded-xl"
        outlined
        small
        color="primary darken-1"
        to="/dashboard/user/answer-sheet"
      >
        <span class="text-caption font-weight-bold" v-text="'مشاهده پاسخ‌نامه'" />
      </v-btn>
    </div>
    <v-card-text class="text-right">
      <v-divider class="mb-3" />
      <!-- <div class="d-flex align-center justify-space-between mb-4">
        <span class="text--secondary text-body-2">نمره تئوری:</span>
        <span class="text--primary text-h6 font-weight-bold" v-text="Intl.NumberFormat('fa-IR').format(theoryScore)" />
      </div>
      <div class="d-flex align-center justify-space-between mb-4">
        <span class="text--secondary text-body-2">نمره عملی:</span>
        <span class="text--primary text-h6 font-weight-bold" v-text="Intl.NumberFormat('fa-IR').format(actionScore)" />
      </div>
      <v-divider class="my-3" style="border-width: 2px;border-style: dashed;" /> -->
      <div class="d-flex align-center justify-space-between">
        <span class="text--secondary text-body-2">نمره کل:</span>
        <span class="text--primary text-h6 font-weight-bold" v-text="Intl.NumberFormat('fa-IR').format(score)" />
      </div>
    </v-card-text>
    <v-alert
      v-if="passed"
      color="green"
      dark
      icon="mdi-check"
      prominent
      class="rounded-t-0 rounded-b-xl"
    >
      <h3 class="text-body-1 font-weight-medium">
        شما موفق به کسب حد نصاب نمره قبولی شدید
      </h3>
    </v-alert>
    <v-alert
      v-else
      color="error"
      dark
      icon="mdi-close"
      prominent
      class="rounded-t-0 rounded-b-xl"
    >
      <h3 class="text-body-1 font-weight-medium">
        شما موفق به کسب حد نصاب نمره قبولی نشدید
      </h3>
    </v-alert>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ResultPage',
  layout: 'dashboard',
  computed: {
    ...mapGetters('userService', ['userResult']),
    theoryScore () {
      return this.userResult.right_answers
    },
    actionScore () {
      return 30
    },
    score () {
      return this.userResult.right_answers + this.actionScore
    },
    passed () {
      return this.score >= 70
    }
  }
}
</script>
<style>

</style>
