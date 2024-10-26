<template>
  <div class="mono">
    <div class="px-1 d-flex flex-wrap align-center my-3">
      <v-toolbar-title>{{ tableTitle }}</v-toolbar-title>
      <v-spacer />
      <div>
        <span class="ml-2">نمره قبولی:</span>
        <span class="font-weight-bold" v-text="exam.pass_score" />
      </div>
    </div>
    <v-divider class="my-3" />
    <div class="d-flex align-center mb-3">
      <span class="ml-2">تعداد کل شرکت کنندگان:</span>
      <span class="font-weight-bold" v-text="items.length" />
      <v-spacer />
      <span class="ml-2">تعداد قبولی‌ها:</span>
      <span class="font-weight-bold" v-text="passCount" />
    </div>
    <dashboard-common-custom-dt
      :table-headers="tableHeaders"
      :items="items"
      class="elevation-1"
      :sort-by="['theoretical_score']"
      :sort-desc="true"
      :items-per-page="-1"
      :fixed-header="true"
    >
      <template #id="{index}">
        <div class="text-right">
          {{ index+1 }}
        </div>
      </template>
      <template #finalResult="{item}">
        <div>
          {{ safeFinalResult(item) }}
        </div>
      </template>
      <template #weightedTheoreticalScore="{item}">
        <div>
          {{ safeWeightedTheoreticalScore(item.theoretical_score) }}
        </div>
      </template>
      <template #status="{item}">
        <v-chip v-if="item.theoretical_score >= exam.pass_score" color="success" style="min-width: 54px;justify-content: center;">
          قبول
        </v-chip>
        <v-chip v-if="item.theoretical_score < exam.pass_score" color="error darken-1" style="min-width: 54px;justify-content: center;">
          مردود
        </v-chip>
      </template>
      <template #details="{item}">
        <v-btn icon small :to="{name: 'dashboard-admin-exams-result-id-details-userId', params: {id: item.exam_id, userId: item.user_id} }" exact>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
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
      items: [],
      exam: {}
    }
  },
  async fetch () {
    try {
      this.exam = await this._getSingleExam(this.$route.params.id)
      const items = await this._getExamResultForAdmin(this.$route.params.id)
      this.items = items.map(item => ({ ...item, theoretical_score: item.theoretical_score.toFixed(2) }))
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    theoretical_exam_weight(){
      return this.exam.theoretical_exam_weight
    },
    tableHeaders(){
      return [
        { text: '#', value: 'id', align: 'start', cellClass: 'text-right', type: 'customSlot' },
        { text: 'نام', value: 'first_name', align: 'start', cellClass: 'text-right', sortable: false },
        { text: 'نام خانوادگی', value: 'last_name', align: 'start', cellClass: 'text-right', sortable: false },
        { text: 'وضعیت', value: 'status', align: 'center', type: 'customSlot', sortable: false },
        { text: 'نمره تئوری (از 100)', value: 'theoretical_score', align: 'center' },
        { text: `نمره تئوری (از ${this.theoretical_exam_weight})`, value: 'weightedTheoreticalScore', align: 'center', type: 'customSlot' },
        { text: 'نمره عملی', value: 'practical_score', align: 'center' },
        { text: 'نمره کل', value: 'finalResult', align: 'center', type: 'customSlot' },
        { text: 'پاسخ نامه', value: 'details', align: 'center', type: 'customSlot' }
      ]
    },
    tableTitle () {
      return `نتیجه آزمون ${this.exam.title}`
    },
    passCount () {
      return this.items.filter(i => i.theoretical_score >= this.exam.pass_score).length
    }
  },
  methods: {
    ...mapActions('exams', ['_getSingleExam', '_getExamResultForAdmin']),
    safeFinalResult (item) {
      try {
        const result = parseFloat(item.theoretical_score) + parseFloat(item.practical_score)
        return isNaN(result) ? '-' : result
      } catch (error) {
        return '-'
      }
    },
    safeWeightedTheoreticalScore(theoretical_score) {
      try {
        return ((theoretical_score * this.theoretical_exam_weight) / 100).toFixed(2)
      } catch (error) {
        return 0
      }
    }
  }
}
</script>

<style>

</style>
