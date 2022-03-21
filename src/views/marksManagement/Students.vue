<template>
  <div id="students" class="pa-10">
    <v-app-bar app>
      <v-slide-x-transition>
        <v-toolbar-title> الطلاب </v-toolbar-title>
      </v-slide-x-transition>
      <v-chip small style="margin-right: 10px" color="error">
        {{ students.data.length }}
      </v-chip>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-card class="pa-10">
      <v-card
        style="position: sticky; top: 62px; z-index: 1"
        elevation="0"
        class="px-0 searchBox"
      >
        <br />
        <v-row>
          <v-col>
            <v-autocomplete
              outlined
              dense
              label="المرحلة"
              :items="$store.state.levels"
              v-model="search.level"
              item-value="idLevel"
              item-text="levelName"
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete
              outlined
              dense
              label="الشعبة"
              v-model="search.class"
              :items="$store.state.studentClassess"
            ></v-autocomplete>
          </v-col>
          <v-col cols="1">
            <v-btn
              @click="performSearch()"
              :disabled="!search.level || !search.class"
              color="primary"
            >
              <v-icon left>la-search</v-icon>
              بحث
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
        </v-row>
      </v-card>
      <v-data-table
        :headers="students.tableHeader"
        :items="students.data"
        :items-per-page="1000"
        fixed-header
        height="450px"
      >
        <template #[`item.getStudentLevel`]="{ item }">
          <div>{{ item.level | getStudentLevel }}</div>
        </template>
        <template v-slot:[`item.getStudentClass`]="{ item }">
          <v-menu transition="scroll-x-transition" max-height="300px" offset-x>
            <template v-slot:activator="{ on, attrs }">
              <v-btn small color="primary" rounded v-bind="attrs" v-on="on">
                {{ item.studentClass }}
              </v-btn>
            </template>

            <v-list rounded dense>
              <v-list-item
                v-for="(className, index) in $store.state.studentClassess"
                :key="index"
                @click="changeClass(item.studentLevelId, className, item)"
              >
                <v-list-item-title style="text-align: center">{{
                  className
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-slot:[`item.getStudentStatus`]="{ item }">
          <v-chip
            small
            :color="item.studentStatusId == 1 ? 'success' : 'warning'"
          >
            {{ item.studentStatusName }}
          </v-chip>
        </template>
        <template v-slot:[`item.getYearStudy`]="{ item }">
          {{ item.enterYear }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    search: {
      level: null,
      class: null,
    },
    students: {
      data: [],
      tableHeader: [
        { text: "الرقم الاحصائي", value: "collegeNumber" },
        { text: "اسم الطالب", value: "studentName" },
        { text: "المرحلة", value: "getStudentLevel" },
        { text: "الشعبة", value: "getStudentClass" },
        { text: "سنة القبول", value: "getYearStudy" },
        { text: "الحالة", value: "getStudentStatus" },
      ],
    },
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      let loading = this.$loading.show();
      this.$http
        .get(`students?sectionId=${this.userInfo.sectionId}&status=1`)
        .then((res) => {
          this.students.data = res.data;
        })
        .finally(() => loading.hide());
    },
    changeClass(idStudentLevel, className, student) {
      let loading = this.$loading.show();
      this.$http
        .put("studentLevel/" + idStudentLevel, {
          class: className,
        })
        .finally(() => {
          var index = this.students.data.findIndex(
            (s) => s.idStudent == student.idStudent
          );
          this.students.data[index].studentClass = className;
          this.$toast.open({
            type: "success",
            message:
              "تم تغيير شعبة الطالب \n" + this.students.data[index].studentName,
            duration: 3000,
          });
          loading.hide();
        });
    },
    performSearch() {
      let loading = this.$loading.show();
      this.$http
        .get(
          `students?sectionId=${this.userInfo.sectionId}&level=${this.search.level}&class=${this.search.class}&status=1`
        )
        .then((res) => {
          this.students.data = res.data;
        })
        .finally(() => loading.hide());
    },
  },
  filters: {
    getStudentLevel(level) {
      if (level == 1) {
        return "المرحلة الاولى";
      } else if (level == 2) {
        return "المرحلة الثانية";
      } else if (level == 3) {
        return "المرحلة الثالثة";
      } else if (level == 4) {
        return "المرحلة الرابعة";
      } else if (level == 5) {
        return "المرحلة الخامسة";
      } else if (level == 10) {
        return "متخرج";
      }
    },
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userInfo() {
      return this.$store.getters.getLoginInfo;
    },
  },
};
</script>

<style>
</style>