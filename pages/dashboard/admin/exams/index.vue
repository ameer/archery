<template>
  <div>
    <v-btn-toggle v-model="statusFilters" multiple class="w-100">
      <v-btn :value="'done:true'" class="flex-grow-1">
        برگزار شده
      </v-btn>
      <v-btn :value="'done:false'" class="flex-grow-1">
        در انتظار برگزاری
      </v-btn>
      <v-btn :value="'is_deleted:true'" class="flex-grow-1">
        حذف شده
      </v-btn>
    </v-btn-toggle>
    <!-- <v-container class="px-0 mt-4">
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
    </v-container> -->
    <v-divider class="mt-3" />
    <div class="px-1 d-flex align-center my-3">
      <v-toolbar-title>{{ tableTitle }}</v-toolbar-title>
      <v-divider class="mx-4" inset vertical />
      <v-spacer />
      <v-btn color="primary" @click="actionHandler('addExam')">
        افزودن آزمون
      </v-btn>
    </div>
    <dashboard-common-custom-dt
      :table-headers="tableHeaders"
      :items="secondaryFilteredItems"
      class="elevation-1"
    >
      <template #result="{ item }">
        <div v-if="!item.is_deleted">
          <v-btn icon small :to="{name: 'dashboard-admin-exams-result-id', params: {id: item.id} }">
            <v-icon>mdi-file-find</v-icon>
          </v-btn>
        </div>
      </template>
      <template #actions="{ item }">
        <div
          v-if="!item.is_deleted"
          class="d-flex align-center justify-space-between justify-md-end"
        >
          <v-btn
            v-for="(btn, i) in actions"
            :key="`audt-${i}`"
            icon
            small
            :loading="loading === `${btn.action}-${item.id}`"
            class="mx-md-2"
            :class="btn.class"
            :color="btn.color"
            :title="btn.title"
            @click="actionHandler(btn.action, item)"
          >
            <v-icon>{{ btn.icon }}</v-icon>
          </v-btn>
        </div>
        <div
          v-else-if="item.is_deleted"
          class="d-flex align-center justify-end"
        >
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
        { text: 'نام دوره', value: 'title', align: 'start', cellClass: 'text-right' },
        { text: 'تاریخ و ساعت', value: 'exam_start_date', align: 'center', type: 'datetime' },
        { text: 'مدت', value: 'exam_duration', align: 'right', cellClass: 'text-right' },
        { text: 'نوع آزمون', value: 'exam_type', type: 'type', fa: true, align: 'center' },
        { text: 'وضعیت', value: 'done', type: 'boolean', booleanLabels: ['پایان یافته', 'در جریان'], align: 'center', sortable: false },
        { text: 'نتایج', value: 'result', align: 'center', sortable: false, type: 'customSlot' },
        { text: 'عملیات', value: 'actions', align: 'center', sortable: false, type: 'customSlot' }
      ],
      actions: [
        { title: 'مدیریت کاربران آزمون', action: 'userManagement', icon: 'mdi-account-group', color: 'success' },
        { title: 'مدیریت سوالات آزمون', action: 'questionManagement', icon: 'mdi-help-box-multiple-outline', color: 'secondary' },
        { title: 'تغییر وضعیت آزمون', action: 'toggleDoneExam', icon: 'mdi-timeline-check-outline', color: 'primary' },
        { title: 'ویرایش', action: 'editExam', icon: 'mdi-pencil-outline', color: '' },
        { title: 'حذف', action: 'deleteExam', icon: 'mdi-delete', color: 'error', class: 'sa-only' }
      ],
      deletedItemActions: [
        { title: 'بازگردانی', action: 'undeleteExam', icon: 'mdi-delete-off', color: 'primary', class: 'sa-only' }
      ],
      tableTitle: 'مدیریت آزمون‌ها',
      statusFilters: [],
      dropdownFilters: [
        { label: 'نوع آزمون', model: 'exam_type', items: transformer(typesFa.exam_type) }
      ],
      secondaryFilters: {},
      loading: null
    }
  },
  async fetch () {
    try {
      await this._getAllExams()
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    ...mapGetters('exams', ['allExams']),
    filteredItems () {
      const items = [...this.allExams]
      if (this.statusFilters.length === 0) {
        return items.sort((a, b) => b.id - a.id)
      } else {
        return items.filter((item) => {
          if (this.statusFilters.includes('done:true') && item.done) {
            return true
          } else if (this.statusFilters.includes('done:false') && !item.done && !item.is_deleted) {
            return true
          } else if (this.statusFilters.includes('is_deleted:true') && item.is_deleted === true) {
            return true
          } else {
            return false
          }
        }).sort((a, b) => b.id - a.id)
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
    ...mapActions('exams', ['_getAllExams', '_getExamForUpdate', '_deleteExam', '_undeleteExam', '_toggleExamDone']),
    async actionHandler (action, item = {}) {
      const self = this
      let comp = ''
      let data = {}
      if (action === 'editExam') {
        try {
          const id = item.id
          const resp = await this._getExamForUpdate(id)
          if (resp) {
            item = Object.assign({}, { ...item }, { ...resp })
            item.id = id
          }
        } catch (error) {
          console.log(error)
        }
        comp = 'dashboard-admin-add-edit-exam-dialog'
        data = { title: 'ویرایش آزمون', mode: 'edit', item }
      } else if (action === 'addExam') {
        comp = 'dashboard-admin-add-edit-exam-dialog'
        data = { title: 'افزودن آزمون', mode: 'add' }
      } else if (action === 'userManagement') {
        comp = 'dashboard-admin-exam-user-management'
        data = { title: 'مدیریت کاربران آزمون', mode: 'add', dialogWidth: '900px', item }
      } else if (action === 'questionManagement') {
        comp = 'dashboard-admin-exam-question-management'
        data = { title: 'مدیریت سوالات آزمون', mode: 'add', dialogWidth: '900px', item }
      } else if (action === 'deleteExam') {
        comp = 'dashboard-common-confirm-dialog'
        const msg = `حذف آزمون ${item.title}`
        data = {
          title: 'تایید حذف آزمون',
          item,
          cardHeight: 'auto',
          msg,
          action () {
            return new Promise((resolve, reject) => {
              self._deleteExam(item.id).then((resp) => {
                self._getAllExams()
                resolve(resp)
              }).catch((error) => {
                reject(error)
              })
            })
          }
        }
      } else if (action === 'toggleDoneExam') {
        comp = 'dashboard-common-confirm-dialog'
        const fromStatus = item.done ? 'انجام شده' : 'در جریان'
        const toStatus = item.done ? 'در جریان' : 'انجام شده'
        const msg = `تغییر وضعیت آزمون ${item.title} از ${fromStatus} به ${toStatus}`
        data = {
          title: 'تایید تغییر وضعیت آزمون',
          item,
          cardHeight: 'auto',
          msg,
          action () {
            return new Promise((resolve, reject) => {
              self._toggleExamDone({ examId: item.id, done: !item.done }).then((resp) => {
                self._getAllExams()
                resolve(resp)
              }).catch((error) => {
                reject(error)
              })
            })
          }
        }
      } else if (action === 'undeleteExam') {
        comp = 'dashboard-common-confirm-dialog'
        const msg = `بازگردانی آزمون ${item.title}`
        data = {
          title: 'تایید بازگردانی آزمون',
          item,
          cardHeight: 'auto',
          msg,
          action () {
            return new Promise((resolve, reject) => {
              self._undeleteExam(item.id).then((resp) => {
                self._getAllExams()
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
