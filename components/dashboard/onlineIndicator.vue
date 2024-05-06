<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <span
        v-bind="attrs"
        class="connection-indicator ml-3"
        :class="cssClass"
        v-on="on"
      />
    </template>
    <span>وضعیت سوکت: {{ wsStateHR[0] }}</span>
  </v-tooltip>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      showTooltip: null
    }
  },
  computed: {
    ...mapGetters('ws', ['wsState', 'wsStateHR']),
    cssClass () {
      return this.wsStateHR[1] + ' ' + this.wsStateHR[2]
    }
  },
  watch: {
    online () {
      this.showTooltip = true
      setTimeout(() => {
        this.showTooltip = false
      }, 4000, this)
    }
  }
}
</script>

<style>
.connection-indicator {
  width: 16px;
  height: 16px;
  display: inline-block;
  border-radius: 16px;
  cursor: pointer;
}
.connection-indicator.connecting {
  box-shadow: 0 0 0 rgb(25, 118, 210, 0.4);
  animation: pulse-connecting 1.5s infinite;
}
.connection-indicator.open {
  box-shadow: 0 0 0 rgb(14, 136, 95, 0.4);
  animation: pulse 1.5s infinite;
}
@keyframes pulse-connecting {
  0% {
    -moz-box-shadow: 0 0 0 0 rgb(25, 118, 210, 0.4);
    box-shadow: 0 0 0 0 rgb(25, 118, 210, 0.4);
  }
  70% {
    -moz-box-shadow: 0 0 0 10px rgb(25, 118, 210, 0);
    box-shadow: 0 0 0 10px rgb(25, 118, 210, 0);
  }
  100% {
    -moz-box-shadow: 0 0 0 0 rgb(25, 118, 210, 0);
    box-shadow: 0 0 0 0 rgb(25, 118, 210, 0);
  }
}
@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0 rgb(14, 136, 95, 0.4);
    box-shadow: 0 0 0 0 rgb(14, 136, 95, 0.4);
  }
  70% {
    -moz-box-shadow: 0 0 0 10px rgba(204, 169, 44, 0);
    box-shadow: 0 0 0 10px rgba(204, 169, 44, 0);
  }
  100% {
    -moz-box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
    box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
  }
}
</style>
