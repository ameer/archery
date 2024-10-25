<template>
  <div>
    <v-btn-toggle
      v-model="statusFilters"
      multiple
      class="w-100"
    >
      <v-btn :value="'active:true'" class="flex-grow-1">
        سوالات فعال
      </v-btn>
      <v-btn :value="'active:false'" class="flex-grow-1">
        سوالات غیرفعال
      </v-btn>
    </v-btn-toggle>
    <v-container class="px-0 mt-4">
      <v-row>
        <v-col
          v-for="(filter, i) in dropdownFilters"
          :key="`af-${i}`"
          cols="12"
          md="6"
        >
          <v-select
            v-model="secondaryFilters[filter.model]"
            outlined
            :label="filter.label"
            :items="filter.items"
            dense
            multiple
          >
            <template #selection="{ item, index }">
              <v-chip v-if="index < 4">
                <span>{{ item.text }}</span>
              </v-chip>
              <span
                v-if="index === 4"
                class="grey--text text-caption"
              >
                (+{{ secondaryFilters[filter.model].length - 1 }} فیلتر دیگر)
              </span>
            </template>
          </v-select>
        </v-col>
      </v-row>
    </v-container>
    <v-divider class="mt-3" />
    <div
      class="px-1 d-flex align-center my-3"
    >
      <v-toolbar-title>{{ tableTitle }}</v-toolbar-title>
      <v-divider
        class="mx-4"
        inset
        vertical
      />
      <v-spacer />
      <v-btn color="primary" @click="actionHandler('addQuestion')">
        افزودن سوال
      </v-btn>
    </div>
    <dashboard-common-custom-dt
      :table-headers="tableHeaders"
      :items="secondaryFilteredItems"
      :sort-by="['id']"
      class="elevation-1"
    >
      <template #actions="{item}">
        <div v-if="!item.is_deleted" class="d-flex align-center justify-space-between justify-md-end">
          <v-btn
            v-for="(btn, i) in actions"
            :key="`audt-${i}`"
            icon
            small
            class="mx-md-2"
            :class="btn.class"
            :color="btn.color"
            :title="btn.title"
            @click="actionHandler(btn.action, item)"
          >
            <v-icon>{{ btn.icon }}</v-icon>
          </v-btn>
        </div>
        <div v-else-if="item.is_deleted" class="d-flex align-center justify-end">
          <span class="text-caption error--text">حذف شده</span>
          <v-btn
            v-for="(btn, i) in deletedItemActions"
            :key="`audt-${i}`"
            icon
            small
            class="mx-md-2"
            :class="btn.class"
            :color="btn.color"
            :title="btn.title"
            @click="actionHandler(btn.action, item)"
          >
            <v-icon>{{ btn.icon }}</v-icon>
          </v-btn>
        </div>
      </template>
    </dashboard-common-custom-dt>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { transformer, typesFa } from '~/plugins/types'
export default {
  layout: 'dashboard',
  data () {
    return {
      tableHeaders: [
        { text: '#', value: 'id', align: 'start', cellClass: 'text-right' },
        { text: 'متن سوال', value: 'question_text', align: 'start', cellClass: 'text-right' },
        { text: 'نوع سوال', value: 'question_type', type: 'type', fa: true, align: 'center' },
        { text: 'عملیات', value: 'actions', align: 'center', sortable: false, type: 'customSlot' }
      ],
      actions: [
        { title: 'ویرایش', action: 'editQuestion', icon: 'mdi-pencil-outline', color: '' },
        { title: 'حذف', action: 'deleteQuestion', icon: 'mdi-delete', color: 'error', class: '' }
      ],
      deletedItemActions: [
        { title: 'بازگردانی', action: 'undeleteQuestion', icon: 'mdi-delete-off', color: 'primary', class: 'sa-only' }
      ],
      tableTitle: 'مدیریت سوالات',
      statusFilters: [],
      dropdownFilters: [
        { label: 'نوع سوال', model: 'question_type', items: transformer(typesFa.question_type) }
      ],
      secondaryFilters: {}
    }
  },
  async fetch () {
    try {
      await this._getAllQuestions()
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    ...mapGetters('questions', ['allQuestions']),
    filteredItems () {
      if (this.statusFilters.length === 0) {
        return this.allQuestions
      } else {
        return this.allQuestions.filter((item) => {
          if (this.statusFilters.includes('active:true') && item.active) {
            return true
          } else if (this.statusFilters.includes('active:false') && !item.active) {
            return true
          } else {
            return false
          }
        })
      }
    },
    secondaryFilteredItems () {
      const filterValues = Object.values(this.secondaryFilters)

      try {
        if (filterValues.length === 0 || filterValues.flat().length === 0) {
          return this.filteredItems
        } else {
          return this.filteredItems.filter((item) => {
            return Object.keys(this.secondaryFilters).every((key) => {
              return this.secondaryFilters[key].includes(item[key])
            })
          })
        }
      } catch (error) {
        console.log(error)
        return this.filteredItems
      }
    }
  },
  methods: {
    ...mapActions('questions', ['_getAllQuestions', '_getQuestionForUpdate', '_deleteQuestion', '_undeleteQuestion']),
    async actionHandler (action, item = {}) {
      const self = this
      let comp = ''
      let data = {}
      if (action === 'editQuestion') {
        try {
          const id = item.id
          const resp = await this._getQuestionForUpdate(id)
          if (resp) {
            item = resp
            item.id = id
          }
        } catch (error) {
          console.log(error)
        }
        comp = 'dashboard-admin-add-edit-question-dialog'
        data = { title: 'ویرایش سوال', mode: 'edit', item }
      } else if (action === 'addQuestion') {
        comp = 'dashboard-admin-add-edit-question-dialog'
        data = { title: 'افزودن سوال', mode: 'add' }
      } else if (action === 'deleteQuestion') {
        comp = 'dashboard-common-confirm-dialog'
        const msg = `غیرفعال کردن سوال شماره ${item.id}`
        data = {
          title: 'تایید غیرفعال کردن سوال',
          item,
          cardHeight: 'auto',
          msg,
          action () {
            return new Promise((resolve, reject) => {
              self._deleteQuestion(item.id).then((resp) => {
                self._getAllQuestions()
                resolve(resp)
              }).catch((error) => {
                reject(error)
              })
            })
          }
        }
      } else if (action === 'undeleteQuestion') {
        comp = 'dashboard-common-confirm-dialog'
        const msg = `بازگردانی سوال ${item.id}`
        data = {
          title: 'تایید بازگردانی سوال',
          item,
          cardHeight: 'auto',
          msg,
          action () {
            return new Promise((resolve, reject) => {
              self._undeleteQuestion(item.id).then((resp) => {
                self._getAllQuestions()
                this.$toast.success('با موفقیت بازگردانی شد.')
                resolve(resp)
              }).catch((error) => {
                reject(error)
              })
            })
          }
        }
      }
      if (comp !== '') {
        this.o(comp, data)
      }
    },
    // Open Common Dialog
    o (comp, data) {
      this.$nuxt.$emit('openCommonDialog', comp, data)
    }
  }
}
</script>
  <style>

  </style>
