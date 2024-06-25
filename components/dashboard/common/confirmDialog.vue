<template>
  <v-container class="px-6 black--text">
    <div class="text-body-2">
      آیا از <span class="font-weight-bold" v-text="msg" /> مطمئن هستید؟
    </div>
    <portal to="dialogActions">
      <v-spacer />
      <v-btn
        outlined
        color="success"
        class="px-4"
        @click="$emit('closeDialog')"
      >
        خیر
      </v-btn>
      <v-btn
        :loading="loading"
        color="error"
        class="px-4"
        @click="handleSubmit"
      >
        بله
      </v-btn>
    </portal>
  </v-container>
</template>
<script>
export default {
  props: {
    msg: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => {}
    },
    action: {
      type: Function,
      default: () => false
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async handleSubmit () {
      try {
        this.loading = true
        await this.action()
        this.$emit('closeDialog')
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
    <style>

    </style>
