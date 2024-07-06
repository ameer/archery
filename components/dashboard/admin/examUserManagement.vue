<template>
  <v-form ref="examForm" :title="''">
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="font-weight-bold mb-2">
            فهرست کاربران در دسترس {{ item.title }}
          </div>
          <dashboard-common-custom-dt
            :table-headers="tableHeaders"
            :items="availableUsers"
            :sort-by="['id']"
            class="elevation-1"
          >
            <template #actions="{item}">
              <div class="text-center">
                <v-btn
                  icon
                  small
                  color="success"
                  title="افزودن به آزمون"
                  @click="addUserToExam(item.id)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
            </template>
          </dashboard-common-custom-dt>
        </v-col>
        <v-col cols="12">
          <div class="font-weight-bold mb-2">
            فهرست کاربران حاضر در آزمون {{ item.title }}
          </div>
          <dashboard-common-custom-dt
            :table-headers="examUserTableHeaders"
            :items="formattedUsers"
            :sort-by="['id']"
            class="elevation-1"
          >
            <template #actions="{item}">
              <div class="text-center">
                <v-btn
                  icon
                  small
                  color="error"
                  title="حذف از آزمون"
                  @click="removeUserFromExam(item.exam_user_id)"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </div>
            </template>
          </dashboard-common-custom-dt>
        </v-col>
      </v-row>
    </v-container>
    <!-- <portal to="dialogActions">
      <v-spacer />
      <v-btn
        :disabled="!valid"
        :loading="loading"
        color="primary"
        class="px-4"
        @click="handleSubmit"
      >
        {{ btnTitle }}
      </v-btn>
    </portal> -->
  </v-form>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: {
    mode: {
      type: String,
      default: 'add'
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      users: [],
      availableUsers: [],
      tableHeaders: [
        { text: 'نام', value: 'first_name', align: 'center' },
        { text: 'نام خانوادگی', value: 'last_name', align: 'center' },
        { text: 'استان', value: 'province', align: 'center', type: 'type', fa: true },
        { text: 'درجه', value: 'judge_degree', align: 'center', type: 'type', fa: true },
        { text: 'جنسیت', value: 'gender', align: 'center', type: 'type', fa: true },
        { text: 'سطح دسترسی', value: 'user_permission', align: 'center', type: 'type', fa: true },
        { text: 'عملیات', value: 'actions', align: 'center', cellClass: 'text-center', sortable: false, type: 'customSlot' }
      ],
      examUserTableHeaders: [
        { text: 'نام', value: 'first_name', align: 'center' },
        { text: 'نام خانوادگی', value: 'last_name', align: 'center' },
        { text: 'استان', value: 'province', align: 'center', type: 'type', fa: true },
        { text: 'درجه', value: 'judge_degree', align: 'center', type: 'type', fa: true },
        { text: 'جنسیت', value: 'gender', align: 'center', type: 'type', fa: true },
        { text: 'سطح دسترسی', value: 'user_permission', align: 'center', type: 'type', fa: true },
        { text: 'عملیات', value: 'actions', align: 'center', cellClass: 'text-center', sortable: false, type: 'customSlot' }
      ]
    }
  },
  async fetch () {
    await this.fetchData()
  },
  computed: {
    formattedUsers () {
      return this.users.map(item => ({ ...item.user, exam_user_id: item.id }))
    }
  },
  methods: {
    ...mapActions('exams', ['_getExamUsers', '_getExamAvailableUsers', '_addExamUser', '_deleteExamUser']),
    async fetchData () {
      this.users = await this._getExamUsers(this.item.id)
      this.availableUsers = await this._getExamAvailableUsers(this.item.id)
    },
    async addUserToExam (userId) {
      try {
        const data = {
          user_ids: []
        }
        data.user_ids.push(userId)
        await this._addExamUser({ examId: this.item.id, data })
        await this.fetchData()
      } catch (error) {

      }
    },
    // eslint-disable-next-line camelcase
    async removeUserFromExam (exam_user_id) {
      try {
        await this._deleteExamUser(exam_user_id)
        await this.fetchData()
      } catch (error) {

      }
    }

  }
}
</script>
  <style>

  </style>
