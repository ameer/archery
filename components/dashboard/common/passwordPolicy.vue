<template>
  <div class="d-flex flex-column">
    <div v-for="(p, i) in policies" :key="`ppr-${i}`" class="password-policy-rule d-flex align-center mb-2" :class="p.validator(value) ? 'passed' : 'failed'">
      <v-icon v-if="value && value.length > 0" size="18" class="me-2" :color="p.passed ? 'secondary' : 'error'">
        {{ p.passed ? 'mdi-check-circle' : 'mdi-close-circle' }}
      </v-icon>
      <v-icon v-else size="18" class="me-2" color="gray100">
        mdi-check-circle
      </v-icon>
      <span class="text-caption" v-text="p.text" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    activePolicies: {
      type: Array,
      default: () => []
    },
    policies: {
      type: Array,
      default: () => ([
        { text: 'حداقل هشت کاراکتر', passed: false, validator (v) { this.passed = v && v.length >= 8; return this.passed } },
        { text: 'حداقل یک حرف بزرگ انگلیسی', passed: false, validator (v) { this.passed = /[A-Z]/.test(v); return this.passed } },
        { text: 'حداقل یک حرف کوچک انگلیسی', passed: false, validator (v) { this.passed = /[a-z]/.test(v); return this.passed } }
      ])
    }
  }
}
</script>
  <style>
  .password-policy-rule.passed, .password-policy-rule.passed i {
      color: #40bf6a !important;
  }
  /* .password-policy-rule.failed, .password-policy-rule.failed i {
      color: #df2040 !important;
  } */
  </style>
