<template>
  <div class="mono">
    <div class="px-1 d-flex flex-wrap align-center my-3">
      <v-toolbar-title>{{ tableTitle }}</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" class="mx-4 hide-on-print" @click="print">
        <v-icon left>mdi-printer</v-icon>
        پرینت
      </v-btn>
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
      <template #id="{ index }">
        <div class="text-right">
          {{ index + 1 }}
        </div>
      </template>
      <template #practical_score="{ item, index }">
        <div class="d-flex align-center justify-center">
          <template v-if="toBeEditedPracticalScoreIndex !== index">
            <span>{{ item.practical_score || "---" }}</span>
            <v-btn icon small @click="editPracticalScore(item, index)">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <template v-else-if="toBeEditedPracticalScoreIndex === index">
            <v-text-field
              v-to-en-digits="true"
              :ref="`practical_score-${index}`"
              dense
              solo-inverted
              single-line
              style="width: 72px"
              hide-details
              @keyup.escape="toBeEditedPracticalScoreIndex = null"
              class="ml-3 px-0"
              maxlength="3"
              max="100"
              min="0"
              type="number"
              hide-spin-buttons
              v-model="toBeEditedPracticalScore"
            ></v-text-field>
            <v-btn
              small
              icon
              color="error"
              @click="toBeEditedPracticalScoreIndex = null"
            >
              <v-icon small>mdi-close</v-icon>
            </v-btn>
            <v-btn
              small
              icon
              color="success"
              :loading="loading"
              @click="saveSinglePracticalScore(item, index)"
            >
              <v-icon small>mdi-check</v-icon>
            </v-btn>
            <v-btn
              small
              icon
              color="primary"
              v-if="index === 0"
              @click="applyPracticalScoreToAll"
            >
              <v-icon small>mdi-check-all</v-icon>
            </v-btn>
          </template>
        </div>
      </template>
      <!-- <template #finalResult="{ item }">
        <div>
          {{ safeFinalResult(item) }}
        </div>
      </template> -->
      <!-- <template #weightedTheoreticalScore="{ item }">
        <div>
          {{ safeWeightedTheoreticalScore(item, item.theoretical_score) }}
        </div>
      </template>
      <template #weightedPracticalScore="{ item }">
        <div>
          {{ safeWeightedPracticalScore(item, item.practical_score) }}
        </div>
      </template> -->
      <template #status="{ item }">
        <v-chip
          v-if="item.finalResult >= exam.pass_score"
          color="success"
          style="min-width: 54px; justify-content: center"
        >
          قبول
        </v-chip>
        <v-chip
          v-if="item.finalResult < exam.pass_score"
          color="error darken-1"
          style="min-width: 54px; justify-content: center"
        >
          مردود
        </v-chip>
      </template>
      <template #details="{ item }">
        <v-btn
          icon
          small
          :to="{
            name: 'dashboard-admin-exams-result-id-details-userId',
            params: { id: item.exam_id, userId: item.user_id },
          }"
          exact
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-icon
          class="mr-2"
          :title="item.number_of_fingerprints"
          v-if="item.number_of_fingerprints > 1"
          color="warning"
          >mdi-alert</v-icon
        >
      </template>
    </dashboard-common-custom-dt>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  layout: "dashboard",
  data() {
    return {
      items: [],
      exam: {},
      toBeEditedPracticalScoreIndex: -1,
      toBeEditedPracticalScore: 0,
      loading: false,
    };
  },
  async fetch() {
    try {
      const self = this;
      const examId = self.$route.params.id;
      self.exam = await self._getSingleExam(examId);
      const items = await self._getExamResultForAdmin(examId);
      const practicalScores = await self._getPracticalExamScores(examId);
      const fingerPrints = await self._getFingerprintByExamId(examId);
      self.items = items.map((item) => {
        let temp = {
          ...item,
          theoretical_score: item.theoretical_score.toFixed(2),
        };

        const practicalScore = practicalScores.find(
          (score) => score.user_id === item.user_id
        );
        const fingerprint = fingerPrints.find(
          (finger) => finger.user_id === item.user_id
        );
        temp = Object.assign(
          {},
          temp,
          { number_of_fingerprints: fingerprint.number_of_fingerprints },
          {
            practical_score: practicalScore.score,
            practical_score_id: practicalScore.practical_score_id,
          },
          {
            weightedTheoreticalScore: self.safeWeightedTheoreticalScore(
              temp.theoretical_score
            ),
            weightedPracticalScore: self.safeWeightedPracticalScore(
              practicalScore.score
            ),
          }
        );
        temp = Object.assign({}, temp, {
          finalResult: self.safeFinalResult(
            temp.weightedTheoreticalScore,
            temp.weightedPracticalScore
          ),
        });

        return temp;
      });
    } catch (error) {
      console.log(error);
    }
  },
  head() {
    return {
      title: this.tableTitle,
    };
  },
  computed: {
    theoretical_exam_weight() {
      return this.exam.theoretical_exam_weight;
    },
    practical_exam_weight() {
      return this.exam.practical_exam_weight;
    },
    tableHeaders() {
      return [
        {
          text: "#",
          value: "id",
          align: "center",
          cellClass: "text-center",
          type: "customSlot",
        },
        {
          text: "نام",
          value: "first_name",
          align: "start",
          cellClass: "text-right",
          sortable: false,
        },
        {
          text: "نام خانوادگی",
          value: "last_name",
          align: "start",
          class: "fill-width-on-print",
          cellClass: "text-right",
          sortable: false,
        },
        {
          text: "وضعیت",
          value: "status",
          align: "center",
          type: "customSlot",
          sortable: false,
        },
        {
          text: "نمره تئوری (از 100)",
          value: "theoretical_score",
          align: "center",
          class: 'hide-on-print',
          cellClass: 'hide-on-print',
        },
        {
          text: `نمره تئوری (از ${this.theoretical_exam_weight})`,
          value: "weightedTheoreticalScore",
          align: "center",
        },
        {
          text: "نمره عملی (از 100)",
          value: "practical_score",
          align: "center",
          type: "customSlot",
          class: 'hide-on-print',
          cellClass: 'hide-on-print',
          width: 200,
        },
        {
          text: `نمره عملی (از ${this.practical_exam_weight})`,
          value: "weightedPracticalScore",
          align: "center",
        },
        { text: "ارفاق", value: "leniency_score", align: "center shrink-on-print" },
        { text: "نمره کل", value: "finalResult", align: "center" },
        {
          text: "پاسخ نامه",
          value: "details",
          align: "center",
          class: 'hide-on-print',
          cellClass: 'hide-on-print',
          type: "customSlot",
        },
      ];
    },
    tableTitle() {
      return `نتیجه ${this.exam.title}`;
    },
    passCount() {
      return this.items.filter(
        (i) => i.finalResult >= this.exam.pass_score
      ).length;
    },
  },
  methods: {
    ...mapActions("exams", [
      "_getSingleExam",
      "_getExamResultForAdmin",
      "_getPracticalExamScores",
      "_addPracticalScore",
      "_getFingerprintByExamId",
      "_updatePracticalScore",
    ]),
    safeFinalResult(weightedTheoreticalScore, weightedPracticalScore) {
      try {
        const result =
          parseFloat(weightedTheoreticalScore) +
          parseFloat(weightedPracticalScore);
        return isNaN(result) ? "-" : parseInt(result);
      } catch (error) {
        return "-";
      }
    },
    safeWeightedTheoreticalScore(theoretical_score) {
      try {
        const score = (
          (theoretical_score * this.theoretical_exam_weight) /
          100
        ).toFixed(2);
        return score;
      } catch (error) {
        return 0;
      }
    },
    safeWeightedPracticalScore(practical_score) {
      try {
        const score = (
          (practical_score * this.practical_exam_weight) /
          100
        ).toFixed(2);

        return score;
      } catch (error) {
        return 0;
      }
    },
    editPracticalScore(item, index) {
      this.toBeEditedPracticalScoreIndex = index;
      this.toBeEditedPracticalScore = item.practical_score || 0;
      this.$nextTick(() => {
        try {
          this.$refs[`practical_score-${index}`].focus();
        } catch (error) {
          console.log(error);
        }
      });
    },
    async saveSinglePracticalScore(item, index) {
      if (item.practical_score_id === null) {
        const data = [
          {
            user_id: item.user_id,
            score: this.toBeEditedPracticalScore,
          },
        ];
        this.addPracticalScore(data);
      } else {
        try {
          this.loading = true;
          const data = {
            practical_score_id: item.practical_score_id,
            new_score: this.toBeEditedPracticalScore,
          }
          await this._updatePracticalScore({examId: this.$route.params.id, data});
          this.$nuxt.refresh();
        } catch (err) {
          console.log(err);
          this.$toast.error("اشکال در بروزرسانی نمره عملی");
        } finally {
          this.loading = false;
          this.toBeEditedPracticalScoreIndex = -1;
        }
      }
    },
    applyPracticalScoreToAll() {
      const toBeAdded = [];
      const toBeUpdated = [];

      this.items.forEach((item, index) => {
        if (item.practical_score_id === null) {
          toBeAdded.push({
            user_id: item.user_id,
            score: this.toBeEditedPracticalScore,
            type: "add",
          });
        } else {
          toBeUpdated.push({
            practical_score_id: item.practical_score_id,
            new_score: this.toBeEditedPracticalScore,
            type: "update",
          });
        }
      });

      this.sendSmartRequests(toBeAdded, toBeUpdated);
    },
    async sendSmartRequests(toBeAdded, toBeUpdated) {
      this.loading = true;
      const combinedArray = [...toBeAdded, ...toBeUpdated];
      for (const obj of combinedArray) {
        await this.sendRequest(obj);
      }
      this.$nuxt.refresh();
      this.loading = false
    },
    async sendRequest(obj) {
      let action =
        obj.type === "add" ? "_addPracticalScore" : "_updatePracticalScore";
      try {
        if(obj.type === 'add' && !(obj instanceof Array) ) {
          obj = [obj];
        }
        await this[action]({ data: obj, examId: this.$route.params.id });
      } catch (error) {
        console.log(error);
        this.$toast.error("اشکال در بروزرسانی نمره عملی");
      } finally {
        this.loading = false;
        this.toBeEditedPracticalScoreIndex = -1;
      }
    },
    async addPracticalScore(data) {
      try {
        this.loading = true;
        await this._addPracticalScore({ data, examId: this.$route.params.id });
        this.$nuxt.refresh();
      } catch (error) {
        console.log(error);
        this.$toast.error("اشکال در بروزرسانی نمره عملی");
      } finally {
        this.loading = false;
        this.toBeEditedPracticalScoreIndex = -1;
      }
    },
    print(){
      window.print()
    }
  },
};
</script>

<style></style>
