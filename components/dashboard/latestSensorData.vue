<template>
  <v-container>
    <v-row dense>
      <v-col
        v-for="(value, key, i) in zdd"
        :key="`${deviceId}-zdc-${i}`"
        cols="12"
        :md="isDualBus ? 6 : 12"
        class="py-2"
      >
        <v-row dense>
          <v-col cols="12" class="text-center d-flex flex-column">
            <h3 class="text-h6 font-weight-bold" v-text="translateLabel(key)" />
            <span v-text="Intl.DateTimeFormat('fa-IR', {dateStyle: 'short', timeStyle: 'medium'}).format(new Date(sensorData.DT))" />
          </v-col>
          <v-col
            v-for="(zoneData, zoneLabel, j) in value"
            :key="`dzb-${i}-${j}`"
            cols="12"
            md="6"
          >
            <dashboard-zone-box
              :zone-label="translateLabel(zoneLabel)"
              :zone-data="zoneData"
              :parent-key="`${deviceId}-zdc-${i}`"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    deviceId: {
      type: [Number, String],
      default: 0
    },
    sensorData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    zdd () {
      const regex = /^B\d+_/
      const result = Object.entries(this.sensorData).sort(([a], [b]) => {
        const numA = parseInt(a.replace(/\D/g, ''), 10)
        const numB = parseInt(b.replace(/\D/g, ''), 10)
        if (numA < numB) {
          return -1
        }
        if (numA > numB) {
          return 1
        }
        return 0
      }).reduce((acc, [key, value]) => {
        if (regex.test(key)) {
          const [bus, zone, type, valueType] = key.split('_')
          // const zoneLabel = this.sensorData[zone + '_LB'] // Comment for now! Maybe later they add the label again!
          const zoneLabel = zone
          if (type !== 'LB' && valueType === 'N') {
            const deviceTypeName = this.getDeviceTypeNameIcon(type)
            if (!(bus in acc)) {
              acc[bus] = {}
            }
            if (!(zoneLabel in acc[bus])) {
              acc[bus][zoneLabel] = []
            }
            const low = -1 // this.sensorData[zone + '_' + type + '_L'] ?? false
            const high = -1 // this.sensorData[zone + '_' + type + '_H'] ?? false
            acc[bus][zoneLabel].push([...deviceTypeName, Number(value), low, high, type])
          }
        }
        return acc
      }, {})
      return result
    },
    isDualBus () {
      return Object.keys(this.zdd).length > 1
    }
  },
  methods: {
    getDeviceTypeNameIcon (type) {
      switch (type) {
        case 'H':
          return ['رطوبت', 'icon-drop', '%']
        case 'T':
          return ['دما', 'icon-temp', '°C']
        case 'L':
          return ['روشنایی', 'icon-light', 'LUX']
        case 'C':
          return ['CO2', 'icon-co2', 'ppm']
        case 'V':
          return ['TVOC', 'icon-tvoc', 'ppb']
        case 'P':
          return ['PT100', 'icon-pt100', '°C']
        default:
          return [type, '', '']
      }
    },
    translateLabel (label) {
      try {
        // Replace 'b' with 'Bus' and 'z' with 'Zone'
        const translatedLabel = label.replace(/(b|z)/i, (match) => {
          return match.toLowerCase() === 'b' ? 'Bus ' : 'Zone '
        })

        return translatedLabel
      } catch (error) {
        return label
      }
    }
  }
}
</script>
<style lang="">

</style>
