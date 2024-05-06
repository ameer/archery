<template>
  <v-card v-if="device && 'sensorData' in device" class="glass-card rounded-lg fill-height">
    <div class="d-flex align-center py-2 px-4">
      <span class="text-caption">اعتبار سیم‌کارت: <span class="text-body-2">{{ formatNumber(device.sensorData['CR']) }}</span> ریال</span>

      <v-spacer />
      <span class="ml-1">
        <v-icon>{{ device.sensorData['AC'] === 0 ? 'mdi-power-plug-off-outline' : 'mdi-power-plug-outline' }}</v-icon>
      </span>
      <span class="ml-1">
        <span class="text-caption" v-text="batteryPercent" />
        <v-icon>{{ batteryCalc(device.sensorData['BAT']) }}</v-icon>
      </span>
      <span class="ml-1">
        <v-icon>{{ device.sensorData['ETH'] === 0 ? 'mdi-ethernet-cable-off' : 'mdi-ethernet-cable' }}</v-icon>
      </span>
      <span class="ml-1">
        <span class="text-caption" v-text="signalQuality" />
        <v-icon>{{ getSignalIcon(device.sensorData['GSQ']) }}</v-icon>
      </span>
    </div>
    <div class="d-flex align-center px-4">
      <v-avatar size="48" class="rounded-lg" color="primary">
        <span class="text-h6 font-weight-bold white--text" v-text="deviceName" />
      </v-avatar>
      <div style="min-width: 0;">
        <v-card-title :title="device.name">
          <span class="text-truncate d-inline-block">{{ device.name }}</span>
        </v-card-title>
        <v-card-subtitle class="disabled">
          <v-icon small>
            mdi-domain
          </v-icon>
          <span class="font-weight-bold" v-text="device.companyName" />
        </v-card-subtitle>
      </div>
      <v-spacer />
      <v-btn
        v-if="showButton"
        outlined
        large
        color="primary"
        class="rounded-lg"
        :to="`/dashboard/user/devices/${device.id}`"
      >
        <span>ورود به پنل دستگاه</span>
      </v-btn>
    </div>
    <v-divider />
    <dashboard-latest-sensor-data :sensor-data="device.sensorData" :device-id="device.id" />
  </v-card>
</template>
<script>
export default {
  props: {
    device: {
      type: Object,
      default: () => {}
    },
    showButton: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    deviceName () {
      try {
        return this.device.name.charAt(0)
      } catch (error) {
        return ''
      }
    },
    batteryPercent () {
      return this.device.sensorData.BAT ? this.device.sensorData.BAT + '٪' : 'N/A'
    },
    signalQuality () {
      return this.device.sensorData.GSQ ? this.device.sensorData.GSQ + '٪' : 'N/A'
    }
  },
  methods: {
    formatNumber (number) {
      if (isNaN(number)) { return number }
      return Intl.NumberFormat('fa-IR').format(number).replaceAll('٬', ',').replaceAll('٫', '/')
    },
    batteryCalc (bat) {
      bat = parseInt(bat)
      let icon = ''
      if (bat < 10) {
        icon = 'battery-alert-variant-outline'
      } else if (bat >= 10 && bat < 20) {
        icon = 'battery-10'
      } else if (bat >= 20 && bat < 30) {
        icon = 'battery-20'
      } else if (bat >= 30 && bat < 40) {
        icon = 'battery-30'
      } else if (bat >= 40 && bat < 50) {
        icon = 'battery-40'
      } else if (bat >= 50 && bat < 60) {
        icon = 'battery-50'
      } else if (bat >= 60 && bat < 70) {
        icon = 'battery-60'
      } else if (bat >= 70 && bat < 80) {
        icon = 'battery-70'
      } else if (bat >= 80 && bat < 90) {
        icon = 'battery-80'
      } else if (bat >= 90 && bat < 100) {
        icon = 'battery-90'
      } else if (bat === 100) {
        icon = 'battery'
      }
      return `mdi-${icon}`
    },
    getSignalIcon (gsq) {
      if (gsq >= 75) {
        return 'mdi-signal'
      } else if (gsq >= 50) {
        return 'mdi-signal-cellular-2'
      } else if (gsq > 0) {
        return 'mdi-signal-cellular-1'
      } else {
        return 'mdi-signal-off'
      }
    }
  }
}
</script>
<style>

</style>
