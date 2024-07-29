<!-- eslint-disable camelcase -->
<template>
  <div class="d-flex flex-column">
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
        <div class="mr-1 text--primary text-body-1 font-weight-bold">
          {{ currentQuestion.question_text }}
        </div>
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
          <span class="flex-grow-1 pr-4 text-body-1 font-weight-black">ثبت پاسخ</span>
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
      currentQuestion: {
        question_number: 1,
        total_questions: 50,
        question_text: 'string',
        question_type: 1,
        options: 'string',
        question_time: 20
      },
      examSessionId: null,
      valid: false,
      remainingTime: 0,
      intervalID: null,
      submitCounter: 0
    }
  },
  async fetch () {
    try {
      this.examSessionId = await this.getSessionId()
      if (this.examSessionId) {
        const resp = await this._getNextQuestion(this.examSessionId)
        this.startCountDown(resp.question_time)
        this.currentQuestion = Object.assign({}, resp)
      } else {
        this.$router.push('/dashboard/user/exams')
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      this.$toast.error('خطا در دریافت سوال')
    }
  },
  computed: {
    // ...mapGetters('exams', ['examSessionId']),
    remainingPercentage () {
      return Math.floor((this.remainingTime * 100) / this.currentQuestion.question_time)
    }
  },
  created () {

  },
  methods: {
    ...mapActions('exams', ['_getNextQuestion']),
    async getSessionId () {
      const examSessionId = await this.$auth.$storage.getLocalStorage('examSessionId')
      return examSessionId
    },
    startCountDown (time) {
      setTimeout(() => {
        this.disableNextQuestion = false
      }, 3000)
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
        }
      }, 1000)
    },
    nextStep () {
      if (this.submitCounter < 2) {
        this.submitCounter++
      } else {
        this.submitCounter = 0
      }
    }
  }
}
</script>
<style>

</style>
