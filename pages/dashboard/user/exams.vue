<template>
  <div>
    <div
      class="px-1 d-flex align-center my-3"
    >
      <v-btn text color="primary" to="/dashboard/user/exams" exact>
        <v-toolbar-title class="text-md-h6 text-body-1">
          دوره‌های در دسترس
        </v-toolbar-title>
      </v-btn>
      <v-divider
        class="mx-4"
        inset
        vertical
      />
      <v-btn text color="secondary" to="/dashboard/user/past-exams" exact>
        <v-toolbar-title class="text-md-h6 text-body-1">
          دوره‌های گذشته
        </v-toolbar-title>
      </v-btn>
    </div>
    <v-divider class="mt-3" />
    <dashboard-common-custom-dt
      :table-headers="tableHeaders"
      :items="exams"
      :sort-by="['id']"
      class="elevation-1"
    >
      <template #status="{item}">
        <div v-if="item.done === true" class="">
          پایان یافته
        </div>
        <div v-else-if="item.in_progress === true" class="">
          در جریان
        </div>
        <div v-else class="">
          شروع نشده
        </div>
      </template>
      <template #actions="{item}">
        <div v-if="item.active && !item.done" class="d-flex align-center justify-space-between justify-md-end">
          <v-btn
            v-for="(btn, i) in actions"
            :key="`audt-${i}`"
            icon
            small
            :loading="loading === `${btn.action}-${item.id}`"
            class="mx-md-2"
            :class="btn.class"
            :color="btn.color"
            :title="btn.title"
            @click="actionHandler(btn.action, item)"
          >
            <v-icon>{{ btn.icon }}</v-icon>
          </v-btn>
        </div>
      </template>
    </dashboard-common-custom-dt>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  layout: 'dashboard',
  data () {
    return {
      tableTitle: 'دوره‌های در دسترس',
      tableHeaders: [
        { text: '#', value: 'id', align: 'start', cellClass: 'text-right' },
        { text: 'نام دوره', value: 'title', align: 'start', cellClass: 'text-right' },
        { text: 'تاریخ و ساعت', value: 'exam_start_date', align: 'center', type: 'datetime' },
        { text: 'مدت', value: 'exam_duration', align: 'right', cellClass: 'text-right' },
        { text: 'نوع دوره', value: 'exam_type', type: 'type', fa: true, align: 'center' },
        { text: 'نمره تئوری', value: 'theoretical_exam_weight', align: 'right', cellClass: 'text-right' },
        { text: 'نمره عملی', value: 'practical_exam_weight', align: 'right', cellClass: 'text-right' },
        { text: 'نمره قبولی', value: 'pass_score', align: 'right', cellClass: 'text-right' },
        { text: 'وضعیت', value: 'status', type: 'customSlot', align: 'center', sortable: false },
        { text: 'عملیات', value: 'actions', align: 'center', sortable: false, type: 'customSlot' }
      ],
      actions: [
        { title: 'شروع آزمون', action: 'startExam', icon: 'mdi-timer-play-outline', color: 'success' }
      ],
      exams: [],
      sample: [
        {
          id: 0,
          title: 'string',
          exam_type: 1,
          theoretical_exam_weight: 0,
          practical_exam_weight: 0,
          pass_score: 0,
          exam_start_date: '2024-07-27T00:10:24.593Z',
          exam_duration: 0,
          done: false,
          description: 'string',
          active: true
        }
      ],
      loading: false
    }
  },
  async fetch () {
    try {
      this.exams = await this._getAvailableExams()
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    maskedMobileNumber () {
      const mobile = this.$auth.user.mobile
      return mobile.replace(/^(\d{4})\d+(\d{4})$/, '$1***$2')
    }
  },
  methods: {
    ...mapActions('exams', ['_getAvailableExams', '_sendOTP', '_startExam', '_generateUniqueHash']),
    ...mapActions('authServices', ['_sendOTP']),
    async actionHandler (action, item = {}) {
      const self = this
      let comp = ''
      let data = {}
      if (action === 'generateUniqueHash') {
        try {
          const resp = await this._sendOTP(item.id)
          if (resp.status === 200) {
            comp = 'dashboard-otp-input'
            data = {
              title: 'تایید پیامکی',
              cardHeight: 'auto',
              item,
              maskedMobileNumber: this.maskedMobileNumber,
              fingerprint: await this._generateUniqueHash(),
              action (examId, data) {
                return new Promise((resolve, reject) => {
                  self._startExam({ examId, data }).then((resp) => {
                    self.$router.push({ name: 'dashboard-user-current-exam', params: { ...resp } })
                    resolve(resp)
                  }).catch((error) => {
                    reject(error)
                  })
                })
              }
            }
          } else {
            throw new Error('خطا در ارسال پیامک')
          }
        } catch (error) {
          this.$toast.error('خطا در ارسال پیامک')
          return false
        }
      }
      if (action === 'startExam') {
        comp = 'dashboard-common-confirm-dialog'
        const msg = `شروع دوره‌ی ${item.title}`
        data = {
          title: `دوره‌ی ${item.title}`,
          item,
          cardHeight: 'auto',
          msg,
          action () {
            return new Promise((resolve, reject) => {
              self.actionHandler('generateUniqueHash', item).then((resp) => {
                resolve(resp)
              }).catch((error) => {
                reject(error)
              })
            })
          }
        }
      }
      if (comp !== '') {
        this.o(comp, data)
      }
    },
    o (comp, data) {
      this.$nuxt.$emit('openCommonDialog', comp, data)
    }
  }
}
</script>
<style>

</style>
