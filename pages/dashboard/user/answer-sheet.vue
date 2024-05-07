<!-- eslint-disable camelcase -->
<template>
  <div class="d-flex flex-column">
    <v-overlay absolute :value="loading">
      <v-progress-circular indeterminate color="primary" />
    </v-overlay>
    <div class="text-h6 text--secondary pa-4 text-center">
      پاسخنامه آزمون
    </div>
    <div class="d-flex align-center justify-space-between px-4 pb-4">
      <div class="text--disabled pt-0">
        سوال
        <span class="mx-1" v-text="currentQuestion + 1" />
        از
        <span class="mx-1" v-text="questionsCount" />
      </div>
      <v-btn
        class="rounded-xl"
        outlined
        small
        color="primary darken-1"
        to="/dashboard/user/result"
      >
        <span class="text-caption font-weight-bold" v-text="'مشاهده نتیجه'" />
      </v-btn>
    </div>
    <v-divider class="mb-2" />
    <v-card-text class="text-right" style="flex: 1;">
      <div class="text--secondary text-body-2 font-weight-bold">
        متن سوال:
      </div>
      <div class="d-flex align-start mb-4">
        <!-- <span class="text-body-2 font-weight-bold ml-1" style="line-height: 25px;" v-text="currentQuestion + 1 + '-'" /> -->
        <span class="text-body-1 font-weight-bold" v-text="o.question" />
      </div>
      <!-- <v-divider class="my-3" style="border-style: dashed;" /> -->
      <div class="text--secondary text-body-2 font-weight-bold">
        پاسخ:
      </div>
      <template v-if="multiOption">
        <div class="d-flex flex-column mt-2 mb-8 px-2 py-4" style="border: 1px dashed; border-radius: 16px;">
          <div v-for="(option, i) in o.answer_option" :key="`${o.question_id}-option-${i}`" class="option" :class="i + 1 !== o.answer_option.length ? 'mb-4' : ''">
            <div class="d-flex align-center">
              <v-icon v-if="o.answer === i" color="green">
                mdi-check
              </v-icon>
              <v-icon v-else color="red">
                mdi-close
              </v-icon>
              <span class="font-weight-bold mr-2" v-text="option" />
              <div v-if="o.user_answer === i" class="d-flex align-center mr-2">
                <v-icon>mdi-arrow-right</v-icon>
                <span class="text-body-2 primary--text mr-2">پاسخ شما</span>
              </div>
            </div>
          </div>
        </div>
        <!-- <v-radio-group
          :value="o.user_answer"
          mandatory
          readonly
        >
          <v-radio
            v-for="(option, i) in o.answer_option"
            :key="`${o.question_id}-option-${i}`"
            :ripple="false"
            :value="i"
            :color="o.answer === o.user_answer ? 'green' : 'red'"
          >
            <template #label>
              <div class="d-flex align-center">
                {{ option }}
                <div v-if="o.user_answer === i" class="d-flex align-center mr-2">
                  <v-icon>mdi-arrow-right</v-icon>
                  <span class="text-body-2 primary--text mr-2">پاسخ شما</span>
                </div>
              </div>
            </template>
          </v-radio>
        </v-radio-group> -->
      </template>
      <template v-else>
        <div class="d-flex flex-column mt-2 mb-8 px-2 py-4" style="border: 1px dashed; border-radius: 16px;">
          <div class="d-flex align-center mb-4">
            <span class="ml-2 green--text">پاسخ صحیح:</span>
            <span class="text--primary" v-text="o.answer" />
          </div>
          <div class="d-flex align-center">
            <span class="ml-2" :class="o.answer == o.user_answer ? 'green--text' : 'error--text'">پاسخ شما:</span>
            <span class="text--primary" v-text="o.user_answer == '-1' ? '---' : o.user_answer" />
          </div>
        </div>
      </template>
      <div class="text--secondary text-body-2 font-weight-bold">
        مدت زمان پاسخگویی شما به سوال: <span class="text-body-1 text--primary mono" v-text="o.user_answer_time" /> ثانیه
      </div>
      <v-icon color="primary" style="cursor: help;" @click="showHelp = !showHelp">
        mdi-help-circle
      </v-icon>
      <v-expand-transition>
        <div v-show="showHelp">
          <v-divider class="my-3" style="border-style: dashed;" />
          <span class="text-caption">راهنما:</span>
          <div class="d-flex align-center justify-space-between text-caption">
            <div class="d-flex align-center">
              <v-icon color="green">
                mdi-check
              </v-icon>
              <span class="mr-1" v-text="'پاسخ صحیح'" />
            </div>
            <div class="d-flex align-center">
              <v-icon color="red">
                mdi-close
              </v-icon>
              <span class="mr-1" v-text="'پاسخ غلط'" />
            </div>
          </div>
        </div>
      </v-expand-transition>
    </v-card-text>
    <v-card-actions>
      <v-btn
        height="48"
        min-width="164"
        color="primary"
        class="rounded-pill flex-grow-1"
        outlined
        :disabled="currentQuestion <= 0"
        @click="prevStep"
      >
        <v-icon>
          mdi-chevron-right
        </v-icon>
        <span class="flex-grow-1 pl-4 text-body-1 font-weight-black">سوال قبلی</span>
      </v-btn>
      <v-spacer />
      <v-btn
        height="48"
        min-width="164"
        color="primary"
        class="rounded-pill flex-grow-1"
        :disabled="currentQuestion + 1 === questionsCount"
        @click="nextStep"
      >
        <span class="flex-grow-1 pr-4 text-body-1 font-weight-black">سوال بعدی</span>
        <v-icon>
          mdi-chevron-left
        </v-icon>
      </v-btn>
    </v-card-actions>
  </div>
</template>
<script>
// eslint-disable camelcase
import { mapGetters } from 'vuex'
export default {
  name: 'ResultPage',
  layout: 'dashboard',
  data () {
    return {
      showHelp: false,
      loading: false,
      currentQuestion: 0
    }
  },
  computed: {
    ...mapGetters('userService', ['exam', 'questionsCount']),
    o () {
      try {
        const {
          question_id,
          user_answer, user_answer_time,
          question,
          answer,
          answer_option
        } = this.exam[this.currentQuestion]
        return {
          question_id,
          user_answer,
          user_answer_time,
          question,
          answer,
          answer_option
        }
      } catch (error) {
        return {
          question_id: 0,
          user_answer: 0,
          user_answer_time: 0,
          question: '',
          answer: 0,
          answer_option: []
        }
      }
    },
    multiOption () {
      return this.o.answer_option.length > 0
    }
  },
  methods: {
    sleep (delay = 1000) { return new Promise(resolve => setTimeout(resolve, delay)) },
    async prevStep () {
      this.loading = true
      await this.sleep(500)
      if (this.currentQuestion >= 1) {
        this.currentQuestion--
      }
      this.loading = false
    },
    async nextStep () {
      this.loading = true
      await this.sleep(500)
      if (this.currentQuestion < this.questionsCount - 1) {
        this.currentQuestion++
      }
      this.loading = false
    }
  }
}
</script>
<style>

</style>
