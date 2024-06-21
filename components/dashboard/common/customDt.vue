<template>
  <v-data-table
    :headers="tableHeaders"
    :items="items"
    class="elevation-1"
  />
</template>
<script>
export default {
  props: {
    tableHeaders: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style>

</style>
