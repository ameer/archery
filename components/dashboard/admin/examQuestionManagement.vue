<template>
  <v-form ref="examForm" :title="''">
    <v-container class=" mt-4">
      <v-row>
        <v-col
          v-for="(filter, i) in dropdownFilters"
          :key="`af-${i}`"
          cols="12"
          md="4"
        >
          <v-select
            v-model="secondaryFilters[filter.model]"
            outlined
            :label="filter.label"
            :items="filter.items"
            dense
            multiple
          >
            <template #selection="{ item: itema, index }">
              <v-chip v-if="index < 4">
                <span>{{ itema.text }}</span>
              </v-chip>
              <span
                v-if="index === 4"
                class="grey--text text-caption"
              >
                (+{{ secondaryFilters[filter.model].length - 1 }} فیلتر دیگر)
              </span>
            </template>
          </v-select>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="font-weight-bold mb-2">
            سوالات در دسترس برای {{ item.title }}
          </div>
          <dashboard-common-custom-dt
            :table-headers="tableHeaders"
            :items="secondaryFilteredItems"
            :loading="$fetchState.pending"
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
            :items="inExamQuestionsFiltered"
            :loading="$fetchState.pending"
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
                  @click="removeQuestionFromExam(item)"
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
import { transformer, typesFa } from '~/plugins/types'
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
        // { text: '#', value: 'id', align: 'start', cellClass: 'text-right' },
        { text: 'متن سوال', value: 'question_text', align: 'start', cellClass: 'text-right' },
        { text: 'تعداد دفعات استفاده', value: 'exam_count', align: 'start', cellClass: 'text-right' },
        { text: 'نوع سوال', value: 'question_type', type: 'type', fa: true, align: 'center' },
        { text: 'عملیات', value: 'actions', align: 'center', sortable: false, type: 'customSlot' }
      ],
      examQuestionTableHeaders: [
        // { text: '#', value: 'id', align: 'start', cellClass: 'text-right' },
        { text: 'متن سوال', value: 'question_text', align: 'start', cellClass: 'text-right' },
        // { text: 'تعداد دفعات استفاده', value: 'exam_count', align: 'start', cellClass: 'text-right' },
        { text: 'نوع سوال', value: 'question_type', type: 'type', fa: true, align: 'center' },
        { text: 'زمان پاسخگویی', value: 'question_time', align: 'center' },
        { text: 'نمره سوال', value: 'question_point', align: 'center' },
        { text: 'عملیات', value: 'actions', align: 'center', sortable: false, type: 'customSlot' }
      ],
      dropdownFilters: [
        { label: 'نوع سوال', model: 'question_type', items: transformer(typesFa.question_type) }
      ],
      secondaryFilters: {}
    }
  },
  async fetch () {
    await this.fetchData()
  },
  computed: {
    formattedQuestions () {
      return this.questions.map(item => ({ ...item, ...item.question }))
    },
    secondaryFilteredItems () {
      const filterValues = Object.values(this.secondaryFilters)
      try {
        if (filterValues.length === 0 || filterValues.flat().length === 0) {
          return this.availableQuestions
        } else {
          return this.availableQuestions.filter((item) => {
            return Object.keys(this.secondaryFilters).every((key) => {
              return this.secondaryFilters[key].includes(item[key])
            })
          })
        }
      } catch (error) {
        console.log(error)
        return this.availableQuestions
      }
    },
    inExamQuestionsFiltered () {
      const filterValues = Object.values(this.secondaryFilters)
      try {
        if (filterValues.length === 0 || filterValues.flat().length === 0) {
          return this.formattedQuestions
        } else {
          return this.formattedQuestions.filter((item) => {
            return Object.keys(this.secondaryFilters).every((key) => {
              return this.secondaryFilters[key].includes(item[key])
            })
          })
        }
      } catch (error) {
        console.log(error)
        return this.formattedQuestions
      }
    }
  },
  methods: {
    ...mapActions('exams', ['_getExamQuestions', '_getExamAvailableQuestions', '_deleteExamQuestion']),
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
    async closeDialog (shouldRefetch = false) {
      this.commonDialogOpen = false
      if (shouldRefetch) {
        await this.fetchData()
      }
    },
    // eslint-disable-next-line camelcase
    removeQuestionFromExam (item) {
      const self = this
      const comp = 'dashboard-common-confirm-dialog'
      // eslint-disable-next-line camelcase
      const msg = `حذف سوال ${item.id}`
      const data = {
        title: 'تایید حذف سوال از آزمون',
        item,
        cardHeight: 'auto',
        msg,
        action () {
          return new Promise((resolve, reject) => {
            self._deleteExamQuestion(item.id).then((resp) => {
              self.fetchData()
              self.$toast.success('با موفقیت حذف شد.')
              resolve(resp)
            }).catch((error) => {
              reject(error)
            })
          })
        }
      }
      this.$nuxt.$emit('openConfirmDialog', comp, data)
    }

  }
}
</script>
  <style>

  </style>
