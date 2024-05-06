<template>
  <v-col
    cols="12"
    class="d-flex align-center py-2 pr-1 pl-2"
    :class="cssClass"
  >
    <v-icon size="16">
      {{ sensor[1] }}
    </v-icon>
    <span class="text-caption" v-text="sensor[0]" />
    <v-divider class="flex-1 mx-2" />
    <div class="ltr" dir="ltr">
      <span class="mono to-be-highlight">{{ format(sensor[6], sensor[3]) }}</span>
      <sup><small>{{ sensor[2] }}</small></sup>
    </div>
    <v-icon size="20" class="indicator mb-1">
      mdi-chevron-up
    </v-icon>
  </v-col>
</template>
<script>
/*
  Data Map Guide
  0 => Human Readable Name
  1 => Icon
  2 => Suffix
  3 => Value
  4 => Low
  5 => High
  6 => Type
  ["دما","icon-temp","°C",258,-1,-1,"T"]
*/
export default {
  props: {
    sensor: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      cssClass: 'no-change'
    }
  },
  watch: {
    sensor (n, o) {
      if (n[3] === o[3]) {
        return
      }
      if (n[3] > o[3]) {
        this.cssClass = 'positive'
      } else {
        this.cssClass = 'negative'
      }
    }
  },
  methods: {
    format (type, value) {
      try {
        if (type.toLowerCase() === 't' || type.toLowerCase() === 'p') {
          return parseInt(value) / 10
        }
        return value
      } catch (error) {
        return value
      }
    }
  }
}
</script>
<style>

</style>
