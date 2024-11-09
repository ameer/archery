<template>
  <div>
    <div class="px-1 d-flex align-center my-3">
      <v-btn text color="primary" to="/dashboard/user/exams" exact>
        <v-toolbar-title class="text-md-h6 text-body-1">
          دوره‌های در دسترس
        </v-toolbar-title>
      </v-btn>
      <v-divider class="mx-4" inset vertical />
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
      class="elevation-1 mono"
    >
      <template #actions="{ item, index }">
        <div class="d-flex align-center">
          <v-btn
          :disabled="!item.done"
          color="primary"
          :loading="loading === index"
          @click="showResultDialog(item, item.id, index)"
        >
        <v-icon left>mdi-list-box-outline</v-icon>
          نمایش نمره
        </v-btn>
        <div style="width: 12px;"></div>
        <v-btn
          disabled
          color="primary"
        >
        <v-icon left>mdi-certificate-outline</v-icon>
          نمایش گواهی
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
      loading: false,
      tableTitle: 'دوره‌های گذشته',
      tableHeaders: [
        { text: '#', value: 'id', align: 'start', cellClass: 'text-right' },
        {
          text: 'نام دوره',
          value: 'title',
          align: 'start',
          cellClass: 'text-right'
        },
        {
          text: 'تاریخ و ساعت',
          value: 'exam_start_date',
          align: 'center',
          type: 'datetime'
        },
        {
          text: 'مدت',
          value: 'exam_duration',
          align: 'right',
          cellClass: 'text-right'
        },
        {
          text: 'نوع دوره',
          value: 'exam_type',
          type: 'type',
          fa: true,
          align: 'center'
        },
        // { text: 'نمره تئوری', value: 'theoretical_exam_weight', align: 'right', cellClass: 'text-right' },
        // { text: 'نمره عملی', value: 'practical_exam_weight', align: 'right', cellClass: 'text-right' },
        // { text: 'نمره قبولی', value: 'pass_score', align: 'right', cellClass: 'text-right' },
        {
          text: 'وضعیت',
          value: 'done',
          type: 'boolean',
          booleanLabels: ['پایان یافته', 'در جریان'],
          align: 'center',
          sortable: false
        },
        {
          text: 'نتیجه',
          value: 'actions',
          align: 'center',
          sortable: false,
          type: 'customSlot'
        }
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
          done: true,
          description: 'string',
          active: true
        }
      ]
    }
  },
  async fetch () {
    try {
      this.exams = await this._getPastExams()
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    ...mapActions('exams', ['_getPastExams', '_getTheoreticalResult', '_getPracticalResult','_getBothResult']),
    async showResult (examId) {
      try {
        const resp = await this._getTheoreticalResult(examId)
        alert(`نمره تئوری شما: ${resp.theoretical_score}`)
      } catch (error) {
        console.log(error)
      }
    },
    async showResultDialog(exam, examId, index) {
      const self = this
      self.loading = index
      let comp = 'dashboard-common-exam-result'
      let data = {title: `نتیجه ${exam.title}`, cardHeight: 'auto'}
      let resp = {}
      try {
        if (exam.show_practical_result === true && exam.show_theoretical_result === true) {
          resp = await self._getBothResult(examId)
          resp.practical_score = ((resp.practical_score * exam.practical_exam_weight) / 100)
          resp.theoretical_score = ((resp.theoretical_score * exam.theoretical_exam_weight) / 100)
        } else if (exam.show_practical_result === true) {
          // Get practical result
          resp = await self._getPracticalResult(examId)
          resp.practical_score = ((resp.practical_score * exam.practical_exam_weight) / 100)
        } else if(exam.show_theoretical_result === true) {
          // Get theoretical result
          resp = await self._getTheoreticalResult(examId)
          resp.theoretical_score = ((resp.theoretical_score * exam.theoretical_exam_weight) / 100)
        } else {
          self.$toast.error('امکان نمایش نمره برای دوره انتخابی وجود ندارد.')
        }
        data = Object.assign({}, data, {exam, resp})
      if (comp !== '') {
        self.o(comp, data)
      }
      } catch (error) {
        console.log(error);
        
        self.$toast.error('خطا در دریافت اطلاعات')
      } finally {
        self.loading = -1
      }
      
    },
    o (comp, data) {
      this.loading = false
      this.$nuxt.$emit('openCommonDialog', comp, data)
    }
  }
}
</script>
  <style>
</style>
