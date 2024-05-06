<template>
  <div class="zone-box fill-height rounded-lg">
    <v-container class="pa-0">
      <v-row align="stretch" no-gutters>
        <v-col cols="12" class="text-center pt-0 pb-2">
          <v-chip label class="zone-label">
            <span v-text="zoneBus + ' ' + zoneLabel" />
          </v-chip>
        </v-col>
        <dashboard-sensor-col
          v-for="(sensor, i) in zoneData"
          :key="`${parentKey}-sdc-${i}`"
          :sensor="sensor"
        />
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  props: {
    zoneBus: {
      type: String,
      default: ''
    },
    parentKey: {
      type: String,
      default: ''
    },
    zoneData: {
      type: Array,
      default: () => []
    },
    zoneLabel: {
      type: String,
      default: ''
    }
  }
}
</script>
<style>

</style>
