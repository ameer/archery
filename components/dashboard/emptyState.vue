<template>
  <v-card class="glass-card" height="400px">
    <v-card-text class="fill-height d-flex align-center justify-center">
      <div v-if="loading" class="text-center">
        <v-progress-circular indeterminate />
      </div>
      <div v-else class="text-center">
        <div class="text-h6 mb-4">
          {{ message }}
        </div>
        <v-btn outlined color="primary" @click="$emit('newBtnClick')">
          <v-icon left>
            mdi-plus
          </v-icon>
          <span v-text="btnText" />
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    item: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    message () {
      return `شما هنوز ${this.item}ی ایجاد نکرده‌اید.`
    },
    btnText () {
      return `ایجاد ${this.item} جدید`
    }
  }
}
</script>
<style>

</style>
