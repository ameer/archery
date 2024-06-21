<template>
  <v-app>
    <Nuxt v-if="!$slots.default" />
    <slot />
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout'
}
</script>
