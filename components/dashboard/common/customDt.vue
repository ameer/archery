<template>
  <div>
    <v-text-field v-model="search" class="hide-on-print my-3" style="max-width: 320px;" dense append-icon="mdi-magnify" label="جستجو" single-line hide-details outlined clearable>
    </v-text-field>
    <v-data-table :headers="tableHeaders" :items="items" :search="search" :footer-props="{ itemsPerPageOptions: [5, 20, 50, -1] }"
      class="elevation-1" v-bind="$attrs">
      <slot :name="'top'" />
      <template #item="{ item, headers, index, isMobile }">
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
                <slot :name="header.value" :header="header" :item="item" :index="index" :value="item[header.value]" />
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
            <td v-if="header.type === undefined" :key="`cdt-simple-${i}`" :class="header.cellClass">
              <div :title="header.hasTitle ? item[header.value] : ''" :class="header.cellClass ?? 'text-center'">
                {{ item[header.value] }}
              </div>
            </td>
            <td v-else-if="header.type === 'customSlot'" :key="`cdt-cslot-${i}`" :class="header.cellClass">
              <slot :name="header.value" :header="header" :item="item" :index="index" :value="item[header.value]" />
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
  </div>
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
  data() {
    return {
      search: ''
    }
  },
  methods: {
    formatter (header, value) {
      if (typeof value !== 'boolean' && !value) {
        return '---'
      }
      if (header.type === 'boolean') {
        return value === true ? header.booleanLabels[0] : header.booleanLabels[1]
      } else if (header.type === 'time') {
        return new Date(value).toLocaleTimeString('fa', { hour: '2-digit', minute: '2-digit' })
      } else if (header.type === 'datetime') {
        return new Date(value).toLocaleTimeString('fa', { year: '2-digit', month: '2-digit', day: '2-digit', weekday: 'long', hour: '2-digit', minute: '2-digit' })
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
<style></style>
