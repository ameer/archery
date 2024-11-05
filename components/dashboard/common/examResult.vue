<template>
  <v-container>
    <dashboard-common-custom-dt
      :table-headers="tableHeaders"
      :items="cvItems"
      :sort-by="['id']"
      class="elevation-0 mono"
      disable-sort
      disable-pagination
      hide-default-footer
    >
      <template #status="{ item }">
        <div class="text-center">
          <v-chip
            v-if="item.score >= exam.pass_score"
            color="success"
            style="min-width: 54px; justify-content: center"
          >
            قبول
          </v-chip>
          <v-chip
            v-if="item.score < exam.pass_score"
            color="error darken-1"
            style="min-width: 54px; justify-content: center"
          >
            مردود
          </v-chip>
        </div>
      </template>
    </dashboard-common-custom-dt>
  </v-container>
</template>
<script>
export default {
  props: {
    exam: {
      type: Object,
      default: () => ({}),
    },
    resp: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
  computed: {
    tableHeaders() {
      return [
        { text: "نمره تئوری", value: "theoretical_score", align: "center" },
        { text: "نمره عملی", value: "practical_score", align: "center" },
        { text: "نمره کل", value: "score", align: "center" },
        { text: "نمره قبولی آزمون", value: "pass_score", align: "center" },
        {
          text: "وضعیت",
          value: "status",
          align: "center",
          type: "customSlot",
          sortable: false,
        },
      ];
    },
    cvItems() {
      if (
        this.exam.show_practical_result === true &&
        this.exam.show_theoretical_result === true
      ) {
        return [
          {
            theoretical_score: this.resp.theoretical_score.toFixed(2),
            practical_score: this.resp.practical_score,
            score: this.resp.score,
            pass_score: this.exam.pass_score,
          },
        ];
      } else if (this.exam.show_practical_result === true) {
        return [
          {
            theoretical_score: "---",
            practical_score: this.resp.practical_score,
            score: this.resp.practical_score,
            pass_score: this.exam.pass_score,
          },
        ];
      } else if (this.exam.show_theoretical_result === true) {
        return [
          {
            theoretical_score: this.resp.theoretical_score.toFixed(2),
            practical_score: '---',
            score: this.resp.theoretical_score,
            pass_score: this.exam.pass_score,
          },
        ];
      }
    },
  },
};
</script>
<style></style>
