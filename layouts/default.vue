<template>
  <v-app dark>
    <v-main>
      <Nuxt v-if="!$slots.default" />
      <slot />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout'
}
</script>
