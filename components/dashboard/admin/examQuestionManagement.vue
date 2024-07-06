<template>
  <v-form ref="examForm" :title="''">
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="font-weight-bold mb-2">
            سوالات در دسترس برای {{ item.title }}
          </div>
          <dashboard-common-custom-dt
            :table-headers="tableHeaders"
            :items="availableQuestions"
            :sort-by="['id']"
            class="elevation-1"
          >
            <template #actions="{item}">
              <div class="text-center">
                <v-btn
                  icon
                  small
                  color="success"
                  title="افزودن به آزمون"
                  @click="addQuestionToExam(item)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </template>
          </dashboard-common-custom-dt>
        </v-col>
        <v-col cols="12">
          <div class="font-weight-bold mb-2">
            سوالات موجود در آزمون {{ item.title }}
          </div>
          <dashboard-common-custom-dt
            :table-headers="examQuestionTableHeaders"
            :items="formattedQuestions"
            :sort-by="['id']"
            class="elevation-1"
          >
            <template #actions="{item}">
              <div class="text-center">
                <v-btn
                  icon
                  small
                  color="error"
                  title="حذف از آزمون"
                  @click="removeUserFromExam(item.exam_user_id)"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </div>
            </template>
          </dashboard-common-custom-dt>
        </v-col>
      </v-row>
    </v-container>
    <dashboard-common-dialog v-model="commonDialogOpen" :width="dialogWidth" :title="componentData.title" :card-height="dialogCardHeight">
      <component :is="commonDialogComp" v-if="commonDialogOpen === true" v-bind="componentData" @closeDialog="closeDialog" />
    </dashboard-common-dialog>
    <!-- <portal to="dialogActions">
      <v-spacer />
      <v-btn
        :disabled="!valid"
        :loading="loading"
        color="primary"
        class="px-4"
        @click="handleSubmit"
      >
        {{ btnTitle }}
      </v-btn>
    </portal> -->
  </v-form>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: {
    mode: {
      type: String,
      default: 'add'
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      commonDialogOpen: false,
      commonDialogComp: 'dashboard-admin-add-question-to-exam',
      componentData: {},
      dialogCardHeight: 'auto',
      dialogWidth: 648,
      questions: [],
      availableQuestions: [],
      tableHeaders: [
        { text: '#', value: 'id', align: 'start', cellClass: 'text-right' },
        { text: 'متن سوال', value: 'question_text', align: 'start', cellClass: 'text-right' },
        { text: 'نوع سوال', value: 'question_type', type: 'type', fa: true, align: 'center' },
        { text: 'عملیات', value: 'actions', align: 'center', sortable: false, type: 'customSlot' }
      ],
      examQuestionTableHeaders: [
        { text: '#', value: 'id', align: 'start', cellClass: 'text-right' },
        { text: 'متن سوال', value: 'question_text', align: 'start', cellClass: 'text-right' },
        { text: 'نوع سوال', value: 'question_type', type: 'type', fa: true, align: 'center' },
        { text: 'زمان پاسخگویی', value: 'question_time', align: 'center' },
        { text: 'نمره سوال', value: 'question_point', align: 'center' },
        { text: 'عملیات', value: 'actions', align: 'center', sortable: false, type: 'customSlot' }
      ]
    }
  },
  async fetch () {
    await this.fetchData()
  },
  computed: {
    formattedQuestions () {
      return this.questions.map(item => ({ ...item, ...item.question }))
    }
  },
  methods: {
    ...mapActions('exams', ['_getExamQuestions', '_getExamAvailableQuestions', '_addExamUser', '_deleteExamUser']),
    async fetchData () {
      this.questions = await this._getExamQuestions(this.item.id)
      this.availableQuestions = await this._getExamAvailableQuestions(this.item.id)
    },
    addQuestionToExam (item) {
      try {
        const temp = {
          title: 'افزودن سوال به آزمون',
          item,
          examId: this.item.id
        }
        this.componentData = Object.assign({}, temp)
        this.commonDialogOpen = true
      } catch (error) {

      }
    },
    // eslint-disable-next-line camelcase
    async removeUserFromExam (exam_user_id) {
      try {
        await this._deleteExamUser(exam_user_id)
        await this.fetchData()
      } catch (error) {

      }
    }

  }
}
</script>
  <style>

  </style>
