<template>
  <v-form ref="questionForm" v-model="valid" :title="''" @submit.prevent="handleSubmit">
    <v-container>
      <v-row no-gutters>
        <v-col cols="12" md="3">
          متن سوال
        </v-col>
        <v-col cols="12" md="9" class="text-body-2 text--primary mb-6">
          {{ item.question_text }}
        </v-col>
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
            <template v-else-if="field.type === 'hidden'">
              <div class="lh-40">
                <v-input v-model="formData[field.model]" hide-details dense class="d-none" :rules="[$rules().requiredZero]" />
                <span v-if="formData[field.model] > -1" class="text-body-1 font-weight-bold success--text">گزینه {{ +formData[field.model] + 1 }}</span>
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
              v-else-if="field.type === 'number'"
              :id="field.title"
              v-model.number="formData[field.model]"
              v-to-en-digits="true"
              outlined
              dense
              :rules="field.rules"
              v-bind="field"
              :readonly="field.readonly"
            />
            <v-text-field
              v-else
              :id="field.title"
              v-model="formData[field.model]"
              v-to-en-digits="true"
              outlined
              dense
              :rules="field.rules"
              v-bind="field"
              :readonly="field.readonly"
            />
          </v-col>
          <v-col :key="`ufs-${i}`" cols="3" />
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
    },
    examId: {
      type: [String, Number],
      default: '-1'
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
      return this.mode === 'add' ? 'افزودن سوال' : 'ذخیره تغییرات'
    },
    isMultiOption () {
      return this.formData.question_type === 3
    },
    fields () {
      const fields = [
        { title: 'زمان سوال (به ثانیه)', model: 'question_time', rules: [this.$rules().required, this.$rules().numeric, this.$rules(7).gt, this.$rules(600).lt], type: 'number' },
        { title: 'نمره سوال', model: 'question_point', rules: [this.$rules().required, this.$rules().numeric, this.$rules().intOnly, this.$rules(1).gt, this.$rules(10).lt], type: 'number' },
        { title: 'توضیحات سوال', model: 'question_text' }

      ]
      if (this.mode === 'edit') {
        fields.unshift({ title: 'وضعیت سوال', model: 'active', type: 'switch', rules: [this.$rules().required] })
      }
      if (this.$auth.hasScope(2)) {
        return fields.filter(f => f.scope !== 'sa')
      } else if (this.$auth.hasScope(3)) {
        return fields.filter(f => f.readonly !== true)
      } else {
        return []
      }
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
      toEditFields.options = [...this.item.options]
      this.options = toEditFields.options.length
      this.formData = Object.assign({}, toEditFields)
    } else if (this.mode === 'add') {
      this.formData = Object.assign({}, { options: [] })
    }
  },
  methods: {
    ...mapActions('exams', ['_addQuestionToExam', '_createQuestion', '_updateQuestion']),
    async handleSubmit () {
      if (!this.$refs.questionForm.validate()) { return false }
      try {
        this.loading = true
        if (this.mode === 'add') {
          const data = { ...this.formData }
          data.exam_id = this.examId
          data.question_id = this.item.id
          await this._addQuestionToExam(data)
        } else if (this.mode === 'edit') {
          await this._updateQuestion({ id: this.item.id, data: this.formData })
        }
        this.$toast.success(this.btnTitle + ' با موفقیت انجام شد.')
        this.$emit('closeDialog', true) // True means refetch data
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    addOption () {
      if (this.options < 4) {
        this.options++
      }
    },
    removeOption (index) {
      this.formData.options.splice(index, 1)
      this.options--
    },
    markAsCorrectAnswer (index) {
      this.formData = Object.assign({}, this.formData, { correct_answer: '' + index })
    }
  }
}
</script>
  <style>

  </style>
