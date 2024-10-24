<template>
  <v-form ref="questionForm" v-model="valid" :title="''" @submit.prevent="handleSubmit">
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
            <template v-else-if="field.type === 'hidden'">
              <div class="lh-40">
                <v-input v-model="formData[field.model]" hide-details dense class="d-none" :rules="[$rules().requiredZero]" />
                <span v-if="formData[field.model] > -1" class="text-body-1 font-weight-bold success--text">گزینه {{ +formData[field.model] }}</span>
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
            <div v-else class="d-flex flex-column">
              <v-text-field
                :id="field.title"
                v-model="formData[field.model]"
                v-to-en-digits="true"
                outlined
                dense
                :rules="field.rules"
                v-bind="field"
                :readonly="field.readonly"
              />
              <div v-if="formData.question_type === 1">
                <span class="font-weight-bold text-body-1 ml-4 success--text">درست: ۱</span>
                <span class="font-weight-bold text-body-1 error--text">نادرست: ۲</span>
              </div>
              <div v-if="formData.question_type === 2">
                <span class="font-weight-bold text-body-1 ml-4 success--text">مجاز: ۱</span>
                <span class="font-weight-bold text-body-1 error--text">غیرمجاز  : ۲</span>
              </div>
            </div>
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
              <span v-if="+formData.correct_answer === i + 1" class="success--text mr-2">
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
                v-if="options > 1 && +formData.correct_answer - 1 !== i"
                icon
                color="success"
                plain
                :title="'انتخاب به عنوان گزینه صحیح'"
                @click="markAsCorrectAnswer(i+1)"
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
import { mapActions } from 'vuex'
import { typesFa, transformer } from '~/plugins/types'
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
      formData: {
        options: []
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
        { title: 'نوع سوال', model: 'question_type', type: 'select', items: transformer(typesFa.question_type), rules: [this.$rules().required] },
        { title: 'نقش سوال', model: 'question_role', scope: 'sa', type: 'select', items: transformer(typesFa.role), rules: [this.$rules().required] },
        { title: 'متن سوال', model: 'question_text', type: 'textarea', rules: [this.$rules().required, this.$rules(10).min, this.$rules(10000).max] },
        { title: 'پاسخ صحیح', model: 'correct_answer', rules: [this.$rules().required, this.$rules().numeric], type: this.isMultiOption ? 'hidden' : undefined }
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
    ...mapActions('questions', ['_getAllQuestions', '_createQuestion', '_updateQuestion']),
    async handleSubmit () {
      if (!this.$refs.questionForm.validate()) { return false }
      try {
        this.loading = true
        if (this.mode === 'add') {
          await this._createQuestion(this.formData)
        } else if (this.mode === 'edit') {
          await this._updateQuestion({ id: this.item.id, data: this.formData })
        }
        this.$toast.success(this.btnTitle + ' با موفقیت انجام شد.')
        this._getAllQuestions()
        this.$emit('closeDialog')
      } catch (error) {

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
