<template>
  <div class="pa-10" v-if="mastersheet != null" id="editMastersheet">
    <v-app-bar app>
      <v-toolbar-title>تعديل الدرجات</v-toolbar-title>
      <v-spacer></v-spacer>
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
      <v-spacer></v-spacer>
      <v-btn @click="addStudentsModal = true" color="success">
        اضافة طلاب</v-btn
      >
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
              <td data-marktype="marktype" v-if="!checkField(1)">
                <v-text-field
                  @contextmenu="
                    showDegreeMenuFunc($event, student.studentId, 1)
                  "
                  tabindex="1"
                  outlined
                  dense
                  hide-details
                  type="number"
                  :prefix="getMarkStatus(getMark(student, 1).markStatusId)"
                  :max="getLessonMaximumDegree(1)"
                  :min="0"
                  @change="updateDegree($event, student.studentId, 1)"
                  :class="{
                    'error white--text': getMark(student, 1).markStatusId == 2,
                    'warning black--text':
                      getMark(student, 1).markStatusId == 3,
                  }"
                  :value="
                    getMark(student, 1).markStatusId == 1
                      ? getMark(student, 1).degree
                      : null
                  "
                ></v-text-field>
              </td>
              <td v-if="!checkField(1) && levelType == 1">
                <v-text-field
                  tabindex="2"
                  outlined
                  dense
                  hide-details
                  @contextmenu="
                    showDegreeMenuFunc($event, student.studentId, 2)
                  "
                  type="number"
                  :prefix="getMarkStatus(getMark(student, 2).markStatusId)"
                  :max="getLessonMaximumDegree(2)"
                  :min="0"
                  @change="updateDegree($event, student.studentId, 2)"
                  :class="{
                    'error white--text': getMark(student, 2).markStatusId == 2,
                    'warning black--text':
                      getMark(student, 2).markStatusId == 3,
                  }"
                  :value="
                    getMark(student, 2).markStatusId == 1
                      ? getMark(student, 2).degree
                      : null
                  "
                ></v-text-field>
              </td>
              <td v-if="!checkField(3)">
                <v-text-field
                  tabindex="3"
                  outlined
                  dense
                  hide-details
                  @contextmenu="
                    showDegreeMenuFunc($event, student.studentId, 3)
                  "
                  type="number"
                  :prefix="getMarkStatus(getMark(student, 2).markStatusId)"
                  :max="getLessonMaximumDegree(3)"
                  :min="0"
                  @change="updateDegree($event, student.studentId, 3)"
                  :class="{
                    'error white--text': getMark(student, 3).markStatusId == 2,
                    'warning black--text':
                      getMark(student, 3).markStatusId == 3,
                  }"
                  :value="
                    getMark(student, 3).markStatusId == 1
                      ? getMark(student, 3).degree
                      : null
                  "
                ></v-text-field>
              </td>
              <td v-if="!checkField(3) && levelType == 1">
                <v-text-field
                  tabindex="4"
                  outlined
                  dense
                  hide-details
                  @contextmenu="
                    showDegreeMenuFunc($event, student.studentId, 4)
                  "
                  type="number"
                  :prefix="getMarkStatus(getMark(student, 4).markStatusId)"
                  :max="getLessonMaximumDegree(4)"
                  :min="0"
                  @change="updateDegree($event, student.studentId, 4)"
                  :class="{
                    'error white--text': getMark(student, 4).markStatusId == 2,
                    'warning black--text':
                      getMark(student, 4).markStatusId == 3,
                  }"
                  :value="
                    getMark(student, 4).markStatusId == 1
                      ? getMark(student, 4).degree
                      : null
                  "
                ></v-text-field>
              </td>
              <td v-if="!checkField(9)">
                <v-text-field
                  tabindex="9"
                  outlined
                  dense
                  hide-details
                  @contextmenu="
                    showDegreeMenuFunc($event, student.studentId, 9)
                  "
                  type="number"
                  :prefix="getMarkStatus(getMark(student, 9).markStatusId)"
                  :max="getLessonMaximumDegree(9)"
                  :min="0"
                  @change="updateDegree($event, student.studentId, 9)"
                  :class="{
                    'error white--text': getMark(student, 9).markStatusId == 2,
                    'warning black--text':
                      getMark(student, 9).markStatusId == 3,
                  }"
                  :value="
                    getMark(student, 9).markStatusId == 1
                      ? getMark(student, 9).degree
                      : null
                  "
                ></v-text-field>
              </td>
              <td v-if="!checkField(10)">
                <v-text-field
                  tabindex="10"
                  outlined
                  dense
                  hide-details
                  @contextmenu="
                    showDegreeMenuFunc($event, student.studentId, 10)
                  "
                  type="number"
                  :prefix="getMarkStatus(getMark(student, 10).markStatusId)"
                  :max="getLessonMaximumDegree(10)"
                  :min="0"
                  @change="updateDegree($event, student.studentId, 10)"
                  :class="{
                    'error white--text': getMark(student, 10).markStatusId == 2,
                    'warning black--text':
                      getMark(student, 10).markStatusId == 3,
                  }"
                  :value="
                    getMark(student, 10).markStatusId == 1
                      ? getMark(student, 10).degree
                      : null
                  "
                ></v-text-field>
              </td>
              <td v-if="!checkField(5)">
                <v-text-field
                  tabindex="5"
                  outlined
                  dense
                  hide-details
                  @contextmenu="
                    showDegreeMenuFunc($event, student.studentId, 5)
                  "
                  type="number"
                  :prefix="getMarkStatus(getMark(student, 5).markStatusId)"
                  :max="getLessonMaximumDegree(5)"
                  :min="0"
                  @change="updateDegree($event, student.studentId, 5)"
                  :class="{
                    'error white--text': getMark(student, 5).markStatusId == 2,
                    'warning black--text':
                      getMark(student, 5).markStatusId == 3,
                  }"
                  :value="
                    getMark(student, 5).markStatusId == 1
                      ? getMark(student, 5).degree
                      : null
                  "
                ></v-text-field>
              </td>
              <td v-if="!checkField(5)">
                <v-text-field
                  tabindex="6"
                  outlined
                  dense
                  hide-details
                  @contextmenu="
                    showDegreeMenuFunc($event, student.studentId, 6)
                  "
                  type="number"
                  :prefix="getMarkStatus(getMark(student, 6).markStatusId)"
                  :max="getLessonMaximumDegree(6)"
                  :min="0"
                  @change="updateDegree($event, student.studentId, 6)"
                  :class="{
                    'error white--text': getMark(student, 6).markStatusId == 2,
                    'warning black--text':
                      getMark(student, 6).markStatusId == 3,
                  }"
                  :value="
                    getMark(student, 6).markStatusId == 1
                      ? getMark(student, 6).degree
                      : null
                  "
                ></v-text-field>
              </td>
              <td v-if="!checkField(7)">
                <v-text-field
                  tabindex="7"
                  outlined
                  dense
                  hide-details
                  @contextmenu="
                    showDegreeMenuFunc($event, student.studentId, 7)
                  "
                  type="number"
                  :prefix="getMarkStatus(getMark(student, 7).markStatusId)"
                  :max="getLessonMaximumDegree(7)"
                  :min="0"
                  @change="updateDegree($event, student.studentId, 7)"
                  :class="{
                    'error white--text': getMark(student, 7).markStatusId == 2,
                    'warning black--text':
                      getMark(student, 7).markStatusId == 3,
                  }"
                  :value="
                    getMark(student, 7).markStatusId == 1
                      ? getMark(student, 7).degree
                      : null
                  "
                ></v-text-field>
              </td>
              <td v-if="!checkField(7)">
                <v-text-field
                  tabindex="8"
                  outlined
                  dense
                  hide-details
                  @contextmenu="
                    showDegreeMenuFunc($event, student.studentId, 8)
                  "
                  type="number"
                  :prefix="getMarkStatus(getMark(student, 8).markStatusId)"
                  :max="getLessonMaximumDegree(8)"
                  :min="0"
                  @change="updateDegree($event, student.studentId, 8)"
                  :class="{
                    'error white--text': getMark(student, 8).markStatusId == 2,
                    'warning black--text':
                      getMark(student, 8).markStatusId == 3,
                  }"
                  :value="
                    getMark(student, 8).markStatusId == 1
                      ? getMark(student, 8).degree
                      : null
                  "
                ></v-text-field>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="showDegreeMenu" max-width="500">
      <v-card>
        <v-card-title> تغيير حالة الطالب </v-card-title>
        <br /><br />
        <v-card-text>
          <v-btn
            block
            @click="changeStatus(status.idMarkStatus)"
            class="my-5"
            v-for="status in markStatus"
            :key="status.idMarkStatus"
          >
            {{ status.markStatusName }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      scrollable
      persistent
      v-model="addStudentsModal"
      width="100%"
      max-width="80%"
    >
      <v-card>
        <v-card-title>
          <h4>اضافة طلاب</h4>
          <v-spacer></v-spacer>
          <v-btn dark @click="addStudentsModal = false" icon>
            <v-icon>la-close</v-icon>
          </v-btn>
        </v-card-title>
        <br />
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-alert color="warning" dense
                >قائمة الطلاب :
                {{
                  search.students.filter((x) => !addedStudents.includes(x))
                    .length
                }}</v-alert
              >
              <v-row>
                <v-col>
                  <v-autocomplete
                    outlined
                    dense
                    label="المرحلة"
                    @change="searchStudents()"
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
                    @change="searchStudents()"
                    v-model="search.class"
                    :items="$store.state.studentClassess"
                  ></v-autocomplete>
                </v-col>
                <v-col>
                  <v-autocomplete
                    outlined
                    dense
                    label="حالة الطالب"
                    v-model="search.status"
                    @change="searchStudents()"
                    item-text="text"
                    item-value="value"
                    :items="$store.state.studentStatus"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-data-table
                :items="
                  search.students.filter((x) => !addedStudents.includes(x))
                "
                :headers="search.header"
                item-key="idStudent"
                :items-per-page="1000"
                return-object
                hide-default-footer
                fixed-header
                height="500"
                show-select
                v-model="search.selectedStudents"
              ></v-data-table>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="6">
              <v-alert color="green" dark dense
                >الطلاب الذين تم اضافتهم : {{ addedStudents.length }}</v-alert
              >

              <v-data-table
                :items="addedStudents"
                :headers="search.header"
                :items-per-page="1000"
                hide-default-footer
                fixed-header
                height="500"
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn @click="removeStudent(item)" icon>
                    <v-icon>la-trash</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-row>
            <v-col cols="6">
              <v-btn
                color="success"
                :disabled="search.selectedStudents.length == 0"
                @click="addStudent()"
                block
                >اضافة الطلاب</v-btn
              >
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="3">
              <v-btn
                color="error"
                :disabled="addedStudents.length == 0"
                @click="addedStudents = []"
                block
                >الغاء تحديد جميع الطلاب</v-btn
              >
            </v-col>
            <v-col cols="3">
              <v-btn
                color="primary"
                :disabled="addedStudents.length == 0"
                @click="addedStudentsToMasterSheet()"
                block
                >حفظ</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    mastersheet: null,
    selectedLesson: 0,
    selectedStudent: 0,
    selectedMarkType: 0,
    levelType: 1,
    showDegreeMenu: false,
    markStatus: [],
    addStudentsModal: false,
    addedStudents: [],
    search: {
      class: null,
      level: null,
      selectedStudents: [],
      status: 1,
      students: [],
      header: [
        { text: "اسم الطالب", value: "studentName" },
        { text: "الرقم الاحصائي", value: "collegeNumber" },
        { text: "الاجراءات", value: "actions" },
      ],
    },
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
        this.search.level = this.mastersheet.studyLevel;
        this.search.class = this.mastersheet.studyClass;
        this.searchStudents();
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
    showDegreeMenuFunc(e, studentId, markType) {
      this.selectedStudent = studentId;
      this.selectedMarkType = markType;
      e.preventDefault();
      this.showDegreeMenu = false;
      this.$nextTick(() => {
        this.showDegreeMenu = true;
      });
    },
    getMarkStatus(markStatus) {
      if (markStatus == 1) {
        return null;
      } else {
        if (
          this.markStatus.filter((x) => x.idMarkStatus == markStatus).length > 0
        ) {
          return this.markStatus.filter((x) => x.idMarkStatus == markStatus)[0]
            .markStatusName;
        } else {
          return null;
        }
      }
    },
    changeStatus(statusId) {
      this.$http
        .post("addMasterSheetMark", {
          masterSheetId: this.mastersheet.idMasterSheet,
          studentId: this.selectedStudent,
          masterSheetMarkTypeId: this.selectedMarkType,
          degree: 0,
          lessonId: this.selectedLesson,
          markStatusId: statusId,
          createdBy: this.userInfo.idUser,
        })
        .then((res) => {
          console.log(res);
          this.$toast.open({
            type: "success",
            message: "تم تحديث الدرجة",
            duration: 3000,
          });
          this.updateMarksArray(
            this.selectedStudent,
            this.selectedLesson,
            this.selectedMarkType,
            statusId
          );
          this.showDegreeMenu = false;
        });
    },
    updateDegree(e, studentId, markType) {
      this.$http
        .post("addMasterSheetMark", {
          masterSheetId: this.mastersheet.idMasterSheet,
          studentId: studentId,
          masterSheetMarkTypeId: markType,
          degree: e,
          lessonId: this.selectedLesson,
          markStatusId: 1,
          createdBy: this.userInfo.idUser,
        })
        .then((res) => {
          console.log(res);
          this.$toast.open({
            type: "success",
            message: "تم تحديث الدرجة",
            duration: 3000,
          });
          this.updateMarksArray(studentId, this.selectedLesson, markType, 1);
        });
    },
    updateMarksArray(studentId, lessonId, masterSheetMarkTypeId, markStatusId) {
      var marks = this.mastersheet.students.filter(
        (x) => x.studentId == studentId
      )[0].marks;
      var mark = marks.filter(
        (x) =>
          x.lessonId == lessonId &&
          x.masterSheetMarkTypeId == masterSheetMarkTypeId
      );
      if (mark.length > 0) {
        var studentIndex = this.mastersheet.students.indexOf(
          this.mastersheet.students.filter((x) => x.studentId == studentId)[0]
        );
        var markIndex = this.mastersheet.students[studentIndex].marks.indexOf(
          mark[0]
        );
        if (markStatusId != 1) {
          this.mastersheet.students[studentIndex].marks[markIndex].degree = 0;
        }
        this.mastersheet.students[studentIndex].marks[markIndex].markStatusId =
          markStatusId;
      }
    },
    searchStudents() {
      this.$http
        .get(
          `students?sectionId=${this.userInfo.sectionId}&level=${
            this.search.level
          }&class=${this.search.class}&status=${this.search.status}&studyType=${
            this.mastersheet.studyType == "eveningStudy" ? 1 : 0
          }`
        )
        .then((res) => {
          this.search.students = res.data;
        });
    },
    addStudent() {
      this.addedStudents.push(...this.search.selectedStudents);
      this.search.selectedStudents = [];
    },
    removeStudent(student) {
      var index = this.addedStudents.indexOf(student);
      this.addedStudents.splice(index, 1);
    },
    addedStudentsToMasterSheet() {
      let students = [];
      for (let i = 0; i < this.addedStudents.length; i++) {
        students.push([
          this.mastersheet.idMasterSheet,
          this.addedStudents[i].idStudent,
          "",
          this.userInfo.idUser,
        ]);
      }
      console.log(students);
      let loading = this.$loading.show();
      this.$http
        .post("addMasterSheetStudent", students)
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم تحديث الطلاب",
            duration: 3000,
          });
          this.addedStudents = [];
          this.addStudentsModal = false;
          this.fetch();
        })
        .finally(() => loading.hide());
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