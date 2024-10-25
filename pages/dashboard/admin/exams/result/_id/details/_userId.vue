<template>
  <div class="mono">
    <div class="px-1 d-flex align-center flex-wrap my-3">
      <v-btn icon small :to="{name: 'dashboard-admin-exams-result-id', params: {id: $route.params.id}}" exact>
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <v-toolbar-title class="mr-1 text-caption mono text-md-body-1">
        {{ tableTitle }} -
      </v-toolbar-title>
      <span class="mr-1 font-weight-bold">{{ user.first_name + ' ' + user.last_name }}</span>
    </div>
    <v-divider class="my-3" />
    <div class="d-flex align-center mb-3">
      <span class="ml-2">تعداد کل سوالات:</span>
      <span class="font-weight-bold" v-text="items.length" />
    </div>
    <v-card v-for="(q, j) in items" :key="`erduq-${q.question_id}`" outlined class="mb-4 rounded-lg" color="gray">
      <div class="pa-3 text-right text-body-1 mono d-flex align-start">
        <span class="ml-1" v-text="j + 1 + '-'" />
        <div v-html="n2br(q.question_text)" />
        <v-spacer class="d-none d-md-block" />
        <v-chip class="d-none d-md-flex" label small style="min-width:95px;justify-content:center;">
          {{ $t(q.question_type) }}
        </v-chip>
      </div>
      <v-divider class="mb-1" />
      <div class="px-3">
        <template v-if="q.question_type === 'MULTIPLE_CHOICE'">
          <v-radio-group hide-details :ripple="false" readonly :value="+q.correct_answer">
            <v-radio
              v-for="(option, i) in q.options"
              :key="`cqt3-${q.question_number}-${i}`"
              hide-details
              :color="+q.correct_answer === i+1 ? 'success' : 'primary'"
              :ripple="false"
              :value="i+1"
              class="mb-4"
            >
              <template #label>
                <span class="text-body-2" v-text="option" />
                <div v-if="+q.user_answer === i+1" class="d-flex align-center mr-2">
                  <v-icon>mdi-arrow-right</v-icon>
                  <span class="text-body-2 primary--text mr-2">پاسخ کاربر</span>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </template>
        <template v-else-if="q.question_type === 'TRUE_FALSE'">
          <v-radio-group :ripple="false" readonly :value="+q.correct_answer">
            <v-radio :color="+q.correct_answer === 1 ? 'success' : 'primary'" :ripple="false" :value="1" class="mb-4">
              <template #label>
                <span class="text-body-2" v-text="'درست'" />
                <div v-if="+q.user_answer === 1" class="d-flex align-center mr-2">
                  <v-icon>mdi-arrow-right</v-icon>
                  <span class="text-body-2 primary--text mr-2">پاسخ کاربر</span>
                </div>
              </template>
            </v-radio>
            <v-radio :color="+q.correct_answer === 2 ? 'success' : 'primary'" :ripple="false" :value="2">
              <template #label>
                <span class="text-body-2" v-text="'نادرست'" />
                <div v-if="+q.user_answer === 2" class="d-flex align-center mr-2">
                  <v-icon>mdi-arrow-right</v-icon>
                  <span class="text-body-2 primary--text mr-2">پاسخ کاربر</span>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </template>
        <template v-else-if="q.question_type === 'ALLOWED_DISALLOWED'">
          <v-radio-group :ripple="false" readonly :value="+q.correct_answer">
            <v-radio :label="'مجاز'" :color="+q.correct_answer === 1 ? 'success' : 'primary'" :ripple="false" :value="1" class="mb-4">
              <template #label>
                <span class="text-body-2" v-text="'مجاز'" />
                <div v-if="+q.user_answer === 1" class="d-flex align-center mr-2">
                  <v-icon>mdi-arrow-right</v-icon>
                  <span class="text-body-2 primary--text mr-2">پاسخ کاربر</span>
                </div>
              </template>
            </v-radio>
            <v-radio :label="'غیرمجاز'" :color="+q.correct_answer === 2 ? 'success' : 'primary'" :ripple="false" :value="2">
              <template #label>
                <span class="text-body-2" v-text="'غیرمجاز'" />
                <div v-if="+q.user_answer === 2" class="d-flex align-center mr-2">
                  <v-icon>mdi-arrow-right</v-icon>
                  <span class="text-body-2 primary--text mr-2">پاسخ کاربر</span>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </template>
        <template v-else-if="q.question_type === 'BLANK'">
          <div class="d-flex align-center">
            <div class="text-right py-3 ml-3">
              <span class="text-caption text-md-body-2 text--secondary">پاسخ  صحیح:</span>
              <span class="text-body-2 text-md-body-1 text--primary font-weight-bold mono">
                {{ q.correct_answer }}
              </span>
            </div>
            <div class="text-right py-3">
              <span class="text-caption text-md-body-2 text--secondary">پاسخ  کاربر:</span>
              <span class="text-body-2 text-md-body-1 text--primary font-weight-bold mono d-inline-block" dir="ltr">
                {{ q.user_answer }}
              </span>
            </div>
          </div>
        </template>
      </div>
      <v-divider class="mb-1" />
      <v-container class="text-right">
        <v-row dense>
          <v-col cols="12" md="2" class="d-flex d-md-none">
            <span class="text-caption text--secondary">نوع سوال:</span>
            <v-spacer />
            <span class="text-body-2 text--primary  mono">
              {{ $t(q.question_type) }}
            </span>
          </v-col>
          <v-col cols="6" md="2">
            <span class="text-caption text--secondary">زمان سوال:</span>
            <span class="text-body-2 text--primary font-weight-bold mono">
              {{ q.question_time }}
            </span>
          </v-col>
          <v-col cols="6" md="2" class="text-left">
            <span class="text-caption text--secondary">زمان پاسخ‌گویی شرکت‌کننده:</span>
            <span class="text-body-2 text--primary font-weight-bold mono">
              {{ q.answer_time }}
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  layout: 'dashboard',
  data () {
    return {
      tableHeaders: [
        { text: '#', value: 'id', align: 'start', cellClass: 'text-right', type: 'customSlot' },
        { text: 'نام', value: 'first_name', align: 'start', cellClass: 'text-right', sortable: false },
        { text: 'نام خانوادگی', value: 'last_name', align: 'start', cellClass: 'text-right', sortable: false },
        { text: 'وضعیت', value: 'status', align: 'center', type: 'customSlot', sortable: false },
        { text: 'نمره تئوری', value: 'theoretical_score', align: 'center' },
        { text: 'نمره عملی', value: 'practical_score', align: 'center' },
        { text: 'نمره کل', value: 'finalResult', align: 'center', type: 'customSlot' },
        { text: 'پاسخ نامه', value: 'details', align: 'center', type: 'customSlot' }
      ],
      items: [],
      exam: {},
      user: {}
    }
  },
  async fetch () {
    try {
      this.user = await this._getSingleUser(this.$route.params.userId)
      this.exam = await this._getSingleExam(this.$route.params.id)
      this.items = await this._getTheoreticalExamDetails({ examId: this.$route.params.id, userId: this.$route.params.userId })
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    tableTitle () {
      return `پاسخ‌نامه ${this.exam.title}`
    }
  },
  methods: {
    ...mapActions('exams', ['_getSingleExam', '_getTheoreticalExamDetails']),
    ...mapActions('userManagement', ['_getSingleUser']),
    n2br (text) {
      try {
        return text.replaceAll('\n', '<br>')
      } catch (error) {
        return text
      }
    }
  }
}
</script>

<style>

</style>
