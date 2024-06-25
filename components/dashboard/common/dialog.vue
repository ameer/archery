<template>
  <v-dialog
    :value="value"
    :fullscreen="fullscreen"
    scrollable
    :width="width"
    v-bind="$attrs"
    persistent
    :content-class="contentClass"
    @input="$emit('input', $event)"
  >
    <v-card :min-height="fullscreen ? '100%' : null">
      <v-card-title>
        <span>{{ title }}</span>
        <v-spacer />
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-0" :style="`height: ${cardHeight};`">
        <slot name="default" />
      </v-card-text>
      <v-divider />
      <portal-target name="dialogActions" class="v-card__actions">
        <!--
  This component can be located anwhere in your App.
  The slot content of the above portal component will be rendered here.
  -->
      </portal-target>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'DashboardCommonDialog',
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
      type: String,
      default: '100vh'
    },
    contentClass: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    fullscreen () {
      return this.$vuetify.breakpoint.name === 'xs'
    }
  },
  methods: {
    closeDialog () {
      this.$emit('input', false)
    }
  }
}
</script>
  <style>

  </style>
