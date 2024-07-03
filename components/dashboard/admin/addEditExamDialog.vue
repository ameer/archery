<template>
  <v-form ref="examForm" v-model="valid" :title="''" @submit.prevent="handleSubmit">
    <v-container>
      <v-row no-gutters>
        <template v-for="(field, i) in fields">
          <v-col :key="`ufl-${i}`" cols="12" md="3">
            <label :for="field.title" class="lh-40" v-text="$t(field.title)" />
          </v-col>
          <v-col :key="`uff-${i}`" cols="12" md="6" class="pr-4">
            <v-select
              v-if="field.type === 'select'"
              v-model="formData[field.model]"
              outlined
              dense
              :rules="field.rules"
              v-bind="field"
              :items="field.items"
              :readonly="field.readonly"
            />
            <v-textarea
              v-else-if="field.type === 'textarea'"
              :id="field.title"
              v-model="formData[field.model]"
              outlined
              dense
              :rules="field.rules"
              v-bind="field"
              :readonly="field.readonly"
            />
            <template v-else-if="field.type === 'datetime'">
              <div :title="field.title" class="mb-4">
                <v-text-field
                  :id="field.title"
                  outlined
                  :value="formatDateTime(formData[field.model])"
                  dense
                  :rules="field.rules"
                  readonly
                  type="hidden"
                  class="d-none"
                />
                <date-picker
                  v-model="formData[field.model]"
                  class="v-input v-input--dense theme--light v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined"
                  style="height:40px;"
                  type="datetime"
                  simple
                  format="YYYY-MM-DDTHH:mm:ss.ms"
                  input-format="YYYY-MM-DD"
                  display-format="jYYYY/jMM/jDD HH:mm:ss"
                />
              </div>
            </template>
            <v-switch
              v-else-if="field.type === 'switch'"
              v-model="formData[field.model]"
              outlined
              :true-value="true"
              :false-value="false"
              dense
              :rules="[$rules().requiredSwitch]"
              v-bind="field"
              :readonly="field.readonly"
            />
            <v-text-field
              v-else
              :id="field.title"
              v-model="formData[field.model]"
              outlined
              dense
              :rules="field.rules"
              v-bind="field"
              :readonly="field.readonly"
            />
          </v-col>
          <v-col :key="`ufs-${i}`" cols="3" />
        </template>
        <template v-if="isMultiOption">
          <v-col cols="12" class="d-flex align-center mb-4">
            <span>پاسخ‌ها</span>
            <v-divider class="mr-3" />
            <v-btn icon :title="'افزودن پاسخ'" @click="addOption">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
          <template v-for="(option, i) in options">
            <v-col :key="`qol-${i}`" cols="12" md="3">
              <label :for="`option-${i}`" class="lh-40" v-text="`گزینه ${option}`" />
              <span v-if="+formData.correct_answer === i" class="success--text mr-2">
                گزینه صحیح
              </span>
            </v-col>
            <v-col :key="`qof-${i}`" cols="12" md="6" class="pr-4">
              <v-text-field
                :id="`option-${i}`"
                v-model="formData['options'][i]"
                outlined
                :title="`متن گزینه ${option}`"
                :placeholder="`متن گزینه ${option}`"
                dense
                :rules="[$rules().required]"
              />
            </v-col>
            <v-col :key="`qos-${i}`" cols="3" class="text-left">
              <v-btn
                v-if="options > 2"
                icon
                color="error"
                plain
                title="حذف گزینه"
                @click="removeOption(i)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-btn
                v-if="options > 1 && +formData.correct_answer !== i"
                icon
                color="success"
                plain
                :title="'انتخاب به عنوان گزینه صحیح'"
                @click="markAsCorrectAnswer(i)"
              >
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </v-col>
          </template>
        </template>
      </v-row>
    </v-container>
    <portal to="dialogActions">
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
    </portal>
  </v-form>
</template>
<script>
import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
import { mapActions } from 'vuex'
import { typesFa, transformer } from '~/plugins/types'
export default {
  components: {
    datePicker: VuePersianDatetimePicker
  },
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
      formData: {

      },
      valid: true,
      loading: false,
      options: 1
    }
  },
  computed: {
    btnTitle () {
      return this.mode === 'add' ? 'افزودن آزمون' : 'ذخیره تغییرات'
    },
    isMultiOption () {
      return this.formData.question_type === 3
    },
    fields () {
      // const sample = {
      //   title: 'string',
      //   exam_type: 3,
      //   theoretical_exam_weight: 0,
      //   practical_exam_weight: 0,
      //   pass_score: 0,
      //   exam_start_date: '2024-06-25T22:47:07.398Z',
      //   exam_duration: 'PT30M',
      //   exam_start_interval: 'PT10M',
      //   certificate: true,
      //   user_see_details: true,
      //   description: 'string',
      //   exam_participation_role: 1
      // }
      const fields = [
        { title: 'نام دوره', model: 'title', rules: [this.$rules().required] },
        { title: 'تاریخ و ساعت برگزاری', model: 'exam_start_date', type: 'datetime', rules: [this.$rules().required] },
        { title: 'مدت زمان آزمون', model: 'exam_duration', rules: [this.$rules().numeric], suffix: 'دقیقه' },
        { title: 'بازه شروع آزمون', model: 'exam_start_interval', rules: [this.$rules().numeric], suffix: 'دقیقه' },
        { title: 'نوع آزمون', model: 'exam_type', type: 'select', items: transformer(typesFa.exam_type), rules: [this.$rules().required] },
        { title: 'درصد تئوری', model: 'theoretical_exam_weight', rules: [this.$rules().numeric], suffix: '%' },
        { title: 'درصد عملی', model: 'practical_exam_weight', rules: [this.$rules().numeric], suffix: '%' },
        { title: 'نمره قبولی', model: 'pass_score', rules: [this.$rules().numeric] },
        { title: 'گواهینامه حضور', model: 'certificate', type: 'select', items: [{ text: 'دارد', value: true }, { text: 'ندارد', value: false }], rules: [this.$rules().requiredFalse] },
        { title: 'کاربر می‌تواند جزییات را ببیند', model: 'user_see_details', type: 'switch', rules: [this.$rules().required] },
        { title: 'توضیحات', model: 'description', rules: [] },
        { title: 'نقش کاربران آزمون', model: 'exam_participation_role', scope: 'sa', type: 'select', items: transformer(typesFa.role), rules: [this.$rules().required] }
      ]
      if (this.mode === 'edit') {
        fields.unshift({ title: 'وضعیت آزمون', model: 'active', type: 'switch', rules: [this.$rules().required] })
      }
      if (this.$auth.hasScope(2)) {
        return fields.filter(f => f.scope !== 'sa')
      } else if (this.$auth.hasScope(3)) {
        return fields.filter(f => f.readonly !== true)
      } else {
        return []
      }
    },
    formattedFormData () {
      const temp = {
        ...this.formData
      }
      if ('exam_duration' in temp) {
        temp.exam_duration = 'PT' + this.formData.exam_duration + 'M'
      }
      if ('exam_start_interval' in temp) {
        temp.exam_start_interval = 'PT' + this.formData.exam_start_interval + 'M'
      }
      return temp
    }
  },
  mounted () {
    if (this.mode === 'edit') {
      const toEditFields = {}
      for (let i = 0; i < this.fields.length; i++) {
        const field = this.fields[i]
        if (field.model in this.item) {
          toEditFields[field.model] = this.item[field.model]
        }
      }
      if ('exam_duration' in toEditFields) {
        toEditFields.exam_duration = Number(toEditFields.exam_duration.replaceAll(/\D/g, ''))
      }
      if ('exam_start_interval' in toEditFields) {
        toEditFields.exam_start_interval = Number(toEditFields.exam_start_interval.replaceAll(/\D/g, ''))
      }
      this.formData = Object.assign({}, toEditFields)
    } else if (this.mode === 'add') {
      this.formData = Object.assign({}, {})
    }
  },
  methods: {
    ...mapActions('exams', ['_getAllExams', '_createExam', '_updateExam']),
    async handleSubmit () {
      if (!this.$refs.examForm.validate()) { return false }
      try {
        this.loading = true
        if (this.mode === 'add') {
          await this._createExam(this.formattedFormData)
        } else if (this.mode === 'edit') {
          await this._updateExam({ id: this.item.id, data: this.formattedFormData })
        }
        this.$toast.success(this.btnTitle + ' با موفقیت انجام شد.')
        this._getAllExams()
        this.$emit('closeDialog')
      } catch (error) {

      } finally {
        this.loading = false
      }
    },
    formatDateTime (value) {
      return value
    }
  }
}
</script>
  <style>

  </style>
