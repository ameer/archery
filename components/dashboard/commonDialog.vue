<template>
  <v-dialog
    :value="value"
    :fullscreen="fullscreen"
    :width="width"
    v-bind="$attrs"
    :content-class="contentClass"
    @input="$emit('input', $event)"
  >
    <v-card :min-height="fullscreen ? '100%' : null" :height="cardHeight">
      <slot name="dialogInner" />
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: [Number, String],
      default: 380 || '380px'
    },
    cardHeight: {
      type: [Number, String],
      default: 675 || '675px'
    },
    contentClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    fullscreen () {
      return this.$vuetify.breakpoint.name === 'xs'
    }
  }
}
</script>
<style>

</style>
