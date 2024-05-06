<template>
  <section class="d-contents">
    <div class="text-h6 font-weight-bold pa-4 pb-0">
      سمینار بروزرسانی داوران فدراسیون تیراندازی با کمان
    </div>
    <div class="text-body-2">
      اردیبهشت ماه ۱۴۰۳
    </div>
    <v-divider class="my-3" />
    <v-card-text class="d-flex flex-column">
      <v-spacer />
      <v-btn
        v-for="(item, i) in items"
        :key="`hb-${i}`"
        class="mb-4 py-4 rounded-xl"
        large
        :color="`primary darken-${i+1}`"
        :disabled="item.disabled"
        :to="item.to"
      >
        <span class="text-body-1 font-weight-bold" v-text="item.title" />
      </v-btn>
    </v-card-text>
  </section>
</template>
<script>
export default {
  layout: 'dashboard',
  data () {
    return {
      items: [
        { title: 'نتیجه آزمون', to: '/dashboard/user/result' },
        { title: 'پاسخنامه', to: '/dashboard/user/answer-sheet' },
        { title: 'گواهی سمینار', to: '', disabled: true }
      ]
    }
  }

}
</script>
<style>

</style>
