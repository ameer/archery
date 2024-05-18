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
        :loading="item.loading"
        :color="`primary darken-${i+1}`"
        :disabled="item.disabled"
        :to="item.to"
        @click="item.action ? evoke(item) : false"
      >
        <span class="text-body-1 font-weight-bold" v-text="item.title" />
      </v-btn>
    </v-card-text>
    <div v-if="certURL">
      <v-img :src="certURL" contain class="rounded" />
    </div>
  </section>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  layout: 'dashboard',
  data () {
    return {
      items: [
        { title: 'نتیجه آزمون', to: '/dashboard/user/result' },
        { title: 'پاسخنامه', to: '/dashboard/user/answer-sheet' },
        { title: 'گواهی سمینار', action: 'getCert', loading: false }
      ],
      certURL: null
    }
  },
  methods: {
    ...mapActions('userService', ['_getCertFile']),
    async evoke (item) {
      if (item.action === 'getCert') {
        try {
          item.loading = true
          const resp = await this._getCertFile()
          if (resp) {
            this.certURL = URL.createObjectURL(new Blob([resp], { type: 'image/png' }))
            const link = document.createElement('a')
            link.href = this.certURL
            link.download = 'cert.png'
            link.click()
          }
        } catch (error) {
          console.log(error)
        } finally {
          item.loading = false
        }
      }
    }
  }

}
</script>
<style>

</style>
