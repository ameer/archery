<!-- eslint-disable camelcase -->
<template>
  <div class="d-flex flex-column relative">
    <v-overlay absolute :value="loading">
      <v-progress-circular indeterminate color="primary" />
    </v-overlay>
    <v-form ref="questionForm" v-model="valid">
      <v-overlay absolute :value="$fetchState.pending">
        <v-progress-circular indeterminate color="primary" />
      </v-overlay>
      <div class="text-h6 text--secondary pa-4 text-center">
        در حال برگزاری آزمون
      </div>
      <div class="d-flex align-center justify-space-between px-4 pb-4">
        <div class="text--disabled pt-0">
          سوال
          <span class="mx-1" v-text="currentQuestion.question_number" />
          از
          <span class="mx-1" v-text="currentQuestion.total_questions" />
        </div>
        <v-spacer />
        <v-progress-circular
          :width="1"
          :size="56"
          rotate="-90"
          :color="remainingTime <= 5 ? 'red':'primary'"
          :value="remainingPercentage"
        >
          <span class="text-h6 font-weight-bold">
            {{ remainingTime }}
          </span>
        </v-progress-circular>
      </div>
      <v-divider class="mb-2" />
      <v-card-text class="text-right" style="flex: 1;">
        <div class="mr-1 text--primary text-body-1 font-weight-bold mb-4">
          {{ currentQuestion.question_text }}
        </div>
        <template v-if="currentQuestion.question_type === 3">
          <v-radio-group v-model="answer" :rules="[$rules().required]">
            <v-radio v-for="(option, i) in currentQuestion.options" :key="`cqt3-${currentQuestion.question_number}-${i}`" :label="option" :value="i+1" class="mb-4" />
          </v-radio-group>
        </template>
        <template v-else-if="currentQuestion.question_type === 1">
          <v-radio-group v-model="answer" :rules="[$rules().required]">
            <v-radio :label="'درست'" :value="1" class="mb-4" />
            <v-radio :label="'نادرست'" :value="2" />
          </v-radio-group>
        </template>
        <template v-else-if="currentQuestion.question_type === 2">
          <v-radio-group v-model="answer" :rules="[$rules().required]">
            <v-radio :label="'مجاز'" :value="1" class="mb-4" />
            <v-radio :label="'غیرمجاز'" :value="2" />
          </v-radio-group>
        </template>
        <template v-else-if="currentQuestion.question_type === 4">
          <v-text-field
            v-model="answer"
            v-to-en-digits="true"
            type="tel"
            :rules="[$rules().required, $rules().numeric]"
            outlined
            placeholder="پاسخ خود را وارد کنید"
          />
        </template>
        <template v-else-if="currentQuestion.question_type === 5">
          <v-textarea v-model="answer" v-to-en-digits="true" :rules="[$rules().required]" outlined placeholder="پاسخ خود را وارد کنید" />
        </template>
        <!-- <template v-for="(field, i) in fields">
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
        </template> -->
      </v-card-text>
      <v-card-actions>
        <!-- <v-btn
          height="48"
          min-width="164"
          color="primary"
          class="rounded-pill flex-grow-1"
          outlined
          :disabled="currentQuestion.question_number <= 1"
          @click="prevStep"
        >
          <v-icon>
            mdi-chevron-right
          </v-icon>
          <span class="flex-grow-1 pl-4 text-body-1 font-weight-black">سوال قبلی</span>
        </v-btn> -->
        <v-btn
          height="48"
          :color="submitCounter === 0 ? 'primary lighten-1' : submitCounter === 1 ? 'yellow darken-2' : 'success'"
          class="rounded-pill flex-grow-1"
          :disabled="disableNextQuestion"
          @click="nextStep"
        >
          <span v-if="disableNextQuestion" class="flex-grow-1 pr-4 text-body-1 font-weight-black" v-text="`لطفا (${disableTimer}) ثانیه صبر کنید`" />
          <span v-else class="flex-grow-1 pr-4 text-body-1 font-weight-black">ثبت پاسخ</span>
          <v-icon>
            mdi-chevron-left
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-form>
  </div>
</template>
<script>
// eslint-disable camelcase
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'CurrentExam',
  layout: 'dashboard',
  data () {
    return {
      showHelp: false,
      loading: false,
      disableNextQuestion: true,
      answer: null,
      currentQuestion: {
        question_number: 1,
        total_questions: 50,
        question_text: 'سوال چند گزینه ای شماره ۱',
        question_type: 1,
        options: [
          'گزینه ۱',
          'گزینه ۳',
          'گزینه ۴'
        ],
        question_time: 20
      },
      responseTimerId: null,
      responseTime: 0,
      examSessionId: null,
      valid: false,
      remainingTime: 0,
      intervalID: null,
      submitCounter: 0,
      disableIntervalId: null,
      disableTimer: 2
    }
  },
  fetch () {
    // // For Dev
    // this.startCountDown(20)
    // this.startResponseTimer()
    // // End For Dev
    this.fetchNextQuestion()
  },
  computed: {
    // ...mapGetters('exams', ['examSessionId']),
    remainingPercentage () {
      return Math.floor((this.remainingTime * 100) / this.currentQuestion.question_time)
    }
  },
  mounted () {

  },
  methods: {
    ...mapActions('exams', ['_getNextQuestion', '_submitAnswer', '_generateUniqueHash']),
    async getSessionId () {
      const examSessionId = await this.$auth.$storage.getLocalStorage('examSessionId')
      return examSessionId
    },
    startCountDown (time) {
      this.disableIntervalId = setInterval(() => {
        if (this.disableTimer > 0) {
          this.disableTimer--
        } else {
          clearInterval(this.disableIntervalId)
          this.disableNextQuestion = false
        }
      }, 1000)
      const self = this
      if (self.intervalID) {
        clearInterval(self.intervalID)
      }
      self.remainingTime = time
      self.intervalID = setInterval(() => {
        if (self.remainingTime > 0) {
          self.remainingTime--
        } else {
          clearInterval(self.intervalID)
          self.intervalID = null
          this.submitAnswer()
        }
      }, 1000)
    },
    nextStep () {
      if (this.submitCounter < 1) {
        this.submitCounter++
      } else {
        this.submitAnswer()
      }
    },
    stopResponseTimer () {
      this.responseTime = 0
      if (this.responseTimerId) {
        clearInterval(this.responseTimerId)
      }
    },
    startResponseTimer () {
      this.stopResponseTimer()
      this.responseTimerId = setInterval(() => {
        if (this.responseTime < this.currentQuestion.question_time) {
          this.responseTime++
        }
      }, 1000)
    },
    async fetchNextQuestion () {
      try {
        this.examSessionId = await this.getSessionId()
        if (this.examSessionId && this.$route.name === 'dashboard-user-current-exam' && document.hasFocus()) {
          this.loading = true
          const resp = await this._getNextQuestion(this.examSessionId)
          this.loading = false
          if (resp.status < 400) {
            clearInterval(this.intervalID)
            clearInterval(this.disableIntervalId)
            clearInterval(this.responseTimerId)
            this.disableTimer = 2
            this.disableNextQuestion = true
            this.startCountDown(resp.data.question_time)
            this.startResponseTimer()
            this.submitCounter = 0
            this.answer = null
            this.$refs.questionForm.reset()

            this.currentQuestion = Object.assign({}, resp.data)
          } else {
            this.$toast.error(resp.data.detail)
            this.$router.push('/dashboard/user/exams')
          }
        } else {
          this.$router.push('/dashboard/user/exams')
        }
      } catch (error) {
        this.$toast.error('خطا در دریافت سوال')
      } finally {
        this.loading = false
      }
    },
    async submitAnswer () {
      const answer = this.answer ?? -1
      const data = {
        answer: answer.toString(),
        answer_time: this.responseTime,
        fingerprint: await this._generateUniqueHash()
      }
      try {
        this.stopResponseTimer()
        if (this.$route.name === 'dashboard-user-current-exam' && document.hasFocus()) {
          const resp = await this._submitAnswer({ sessionId: this.examSessionId, data })
          if (resp.status === 400) {
            this.$toast.error(resp.data.detail)
            this.$router.push('/dashboard/user/exams')
          } else if (resp.data.exam_ended === true) {
            clearInterval(this.intervalID)
            clearInterval(this.disableIntervalId)
            clearInterval(this.responseTimerId)
            this.$toast.success('آزمون با موفقیت به پایان رسید')
            this.$router.push('/dashboard/user/exams')
          } else { // Exam still not ended
            this.fetchNextQuestion()
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style>

</style>
