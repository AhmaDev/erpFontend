<template>
  <div class="pa-10" v-if="mastersheet != null" id="editMastersheet">
    <v-app-bar app>
      <v-toolbar-title>تعديل الدرجات</v-toolbar-title>
      <v-spacer></v-spacer>
      {{ levelType }}
      <v-autocomplete
        outlined
        dense
        hide-details
        prefix="المادة"
        :items="mastersheet.lessons"
        item-text="lessonName"
        item-value="idLesson"
        v-model="selectedLesson"
      ></v-autocomplete>
    </v-app-bar>
    <v-card>
      <v-card-text>
        <v-simple-table height="78vh" fixed-header>
          <thead>
            <tr>
              <th width="300">اسم الطالب والرقم الاحصائي</th>
              <th width="50" v-if="!checkField(1)">
                <v-badge inline :content="getLessonMaximumDegree(1)">
                  نظري
                </v-badge>
              </th>
              <th width="50" v-if="!checkField(1) && levelType == 1">
                <v-badge inline :content="getLessonMaximumDegree(1)"
                  >نظري فصل ثاني</v-badge
                >
              </th>
              <th width="50" v-if="!checkField(3)">
                <v-badge inline :content="getLessonMaximumDegree(3)"
                  >عملي</v-badge
                >
              </th>
              <th width="50" v-if="!checkField(3) && levelType == 1">
                <v-badge inline :content="getLessonMaximumDegree(3)"
                  >عملي فصل ثاني</v-badge
                >
              </th>
              <th width="50" v-if="!checkField(9)">
                <v-badge inline :content="getLessonMaximumDegree(9)"
                  >اعمال سنة نظري</v-badge
                >
              </th>
              <th width="50" v-if="!checkField(10)">
                <v-badge inline :content="getLessonMaximumDegree(10)"
                  >اعمال سنة عملي</v-badge
                >
              </th>
              <th width="50" v-if="!checkField(5)">
                <v-badge inline :content="getLessonMaximumDegree(5)"
                  >فاينل</v-badge
                >
              </th>
              <th width="50" v-if="!checkField(5)">
                <v-badge inline :content="getLessonMaximumDegree(5)"
                  >فاينل دور ثاني</v-badge
                >
              </th>
              <th width="50" v-if="!checkField(7)">
                <v-badge inline :content="getLessonMaximumDegree(7)"
                  >فاينل عملي</v-badge
                >
              </th>
              <th width="50" v-if="!checkField(7)">
                <v-badge inline :content="getLessonMaximumDegree(7)"
                  >فاينل عملي دور ثاني</v-badge
                >
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="student in mastersheet.students"
              :key="student.idStudent"
            >
              <td>
                {{ student.studentName }}
                <br />
                {{ student.studentCollegeNumber }}
              </td>
              <td v-if="!checkField(1)">
                <v-text-field
                  @contextmenu="showDegreeMenuFunc($event)"
                  tabindex="1"
                  outlined
                  dense
                  hide-details
                  type="number"
                  :max="getLessonMaximumDegree(1)"
                  :min="0"
                  :value="getMark(student, 1).degree"
                ></v-text-field>
              </td>
              <td v-if="!checkField(1) && levelType == 1">
                <v-text-field
                  tabindex="2"
                  outlined
                  dense
                  hide-details
                  :value="getMark(student, 2).degree"
                ></v-text-field>
              </td>
              <td v-if="!checkField(3)">
                <v-text-field
                  tabindex="3"
                  outlined
                  dense
                  hide-details
                  :value="getMark(student, 3).degree"
                ></v-text-field>
              </td>
              <td v-if="!checkField(3) && levelType == 1">
                <v-text-field
                  tabindex="4"
                  outlined
                  dense
                  hide-details
                  :value="getMark(student, 4).degree"
                ></v-text-field>
              </td>
              <td v-if="!checkField(9)">
                <v-text-field
                  tabindex="9"
                  outlined
                  dense
                  hide-details
                  :value="getMark(student, 9).degree"
                ></v-text-field>
              </td>
              <td v-if="!checkField(10)">
                <v-text-field
                  tabindex="10"
                  outlined
                  dense
                  hide-details
                  :value="getMark(student, 10).degree"
                ></v-text-field>
              </td>
              <td v-if="!checkField(5)">
                <v-text-field
                  tabindex="5"
                  outlined
                  dense
                  hide-details
                  :value="getMark(student, 5).degree"
                ></v-text-field>
              </td>
              <td v-if="!checkField(5)">
                <v-text-field
                  tabindex="6"
                  outlined
                  dense
                  hide-details
                  :value="getMark(student, 6).degree"
                ></v-text-field>
              </td>
              <td v-if="!checkField(7)">
                <v-text-field
                  tabindex="7"
                  outlined
                  dense
                  hide-details
                  :value="getMark(student, 7).degree"
                ></v-text-field>
              </td>
              <td v-if="!checkField(7)">
                <v-text-field
                  tabindex="8"
                  outlined
                  dense
                  hide-details
                  :value="getMark(student, 8).degree"
                ></v-text-field>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="showDegreeMenu" max-width="500">
      <v-card>
        <v-card-title>
          تغيير حالة الطالب
        </v-card-title>
        <br><br>
        <v-card-text>
          <v-btn block class="my-5" v-for="status in markStatus" :key="status.idMarkStatus">
            {{status.markStatusName}}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    mastersheet: null,
    selectedLesson: 0,
    levelType: 1,
    showDegreeMenu: true,
    markStatus: [],
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      let loading = this.$loading.show();
      this.$http.get("masterSheet/" + this.$route.params.id).then((res) => {
        this.mastersheet = res.data;
        this.selectedLesson = this.mastersheet.lessons[0].idLesson;
        this.$http
          .get(
            `sectionLevelTypes/${this.mastersheet.sectionId}?year=${this.mastersheet.studyYearId}&level=${this.mastersheet.studyLevel}`
          )
          .then((secondRes) => {
            if (secondRes.data.length > 0) {
              this.levelType = secondRes.data[0].masterSheetStudyTypeId;
            }
          })
          .finally(() => loading.hide());
      });
      this.$http.get("markStatus").then((res) => {
        this.markStatus = res.data;
      });
    },
    getMark(student, markTypeId) {
      if (student.marks == null) {
        return false;
      }
      let marks = student.marks.filter(
        (mark) =>
          mark.lessonId == this.selectedLesson &&
          mark.masterSheetMarkTypeId == markTypeId
      );
      if (marks.length > 0) {
        return marks[0];
      } else {
        return false;
      }
    },
    checkField(markType) {
      let lesson = this.mastersheet.lessons.filter(
        (lesson) => lesson.idLesson == this.selectedLesson
      );
      if (lesson.length == 0) {
        return true;
      }
      let marks = lesson[0].marks.filter((mark) => mark.markTypeId == markType);
      if (marks.length > 0) {
        return false;
      } else {
        return true;
      }
    },
    getLessonMaximumDegree(markType) {
      let lesson = this.mastersheet.lessons.filter(
        (lesson) => lesson.idLesson == this.selectedLesson
      );
      if (lesson.length == 0) {
        return false;
      }
      let marks = lesson[0].marks.filter((mark) => mark.markTypeId == markType);
      if (marks.length > 0) {
        return marks[0].maximumDegree;
      } else {
        return 0;
      }
    },
    showDegreeMenuFunc(e) {
      e.preventDefault();
      this.showDegreeMenu = false;
      this.$nextTick(() => {
        this.showDegreeMenu = true;
      });
    },
  },
};
</script>

<style>
</style>