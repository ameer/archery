<template>
  <v-data-table
    :headers="tableHeaders"
    :items="items"
    class="elevation-1"
  >
    <slot :name="'top'" />
    <template #item="{item, headers, index, isMobile}">
      <tr v-if="isMobile" class="v-data-table__mobile-table-row">
        <td v-for="(header, i) in headers" :key="`cdt-mobile-${i}`" class="v-data-table__mobile-row">
          <div class="v-data-table__mobile-row__header">
            {{ header.text }}
          </div>
          <div class="v-data-table__mobile-row__cell">
            <template v-if="header.type === undefined">
              <div :title="header.hasTitle ? item[header.value] : ''" :class="header.cellClass ?? 'text-center'">
                {{ item[header.value] }}
              </div>
            </template>
            <template v-else-if="header.type === 'customSlot'">
              <slot
                :name="header.value"
                :header="header"
                :item="item"
                :index="index"
                :value="item[header.value]"
              />
            </template>
            <template v-else>
              <div :class="header.cellClass ?? 'text-center'">
                {{ formatter(header, item[header.value]) }}
              </div>
            </template>
          </div>
        </td>
      </tr>
      <tr v-else>
        <template v-for="(header, i) in headers">
          <td v-if="header.type === undefined" :key="`cdt-simple-${i}`">
            <div :title="header.hasTitle ? item[header.value] : ''" :class="header.cellClass ?? 'text-center'">
              {{ item[header.value] }}
            </div>
          </td>
          <td v-else-if="header.type === 'customSlot'" :key="`cdt-cslot-${i}`">
            <slot
              :name="header.value"
              :header="header"
              :item="item"
              :index="index"
              :value="item[header.value]"
            />
          </td>
          <td v-else :key="`cdt-has-type-${i}`" :class="header.cellClass ?? 'text-center'">
            <div>
              {{ formatter(header, item[header.value]) }}
            </div>
          </td>
        </template>
      </tr>
    </template>
  </v-data-table>
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
  },
  methods: {
    formatter (header, value) {
      if (!value) {
        return '---'
      }
      if (header.type === 'boolean') {
        return value === true ? header.booleanLabels[0] : header.booleanLabels[1]
      } else if (header.type === 'time') {
        return new Date(value).toLocaleTimeString('fa', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      } else if (header.type === 'type') {
        return this.$tt(header.value, value, header.fa ?? false)
      } else if (header.type === 'integer') {
        return isNaN(value) ? value : parseInt(value)
      } else {
        return value ?? '---'
      }
    }
  }
}
</script>
<style>

</style>
