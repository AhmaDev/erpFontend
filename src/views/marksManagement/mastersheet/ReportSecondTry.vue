<template>
  <div id="mastersheetReport" class="pa-10">
    <component :is="`style`"> </component>

    <v-app-bar app>
      <v-toolbar-title>
        <DocumnetSwitcher
          v-if="mastersheet != null"
          type="reportsSecondTry"
          :id="mastersheet.idMasterSheet"
        />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn plain @click="hideFailed = true" v-if="!hideFailed">
        اخفاء الناجحين
      </v-btn>
      <v-btn plain @click="hideFailed = false" v-if="hideFailed">
        اظهار الناجحين
      </v-btn> -->
      <v-btn
        @click="merge()"
        color="success"
        v-if="mastersheet.masterSheetStudyTypeId != 1"
        >دمج</v-btn
      >
      <v-btn icon @click="print()">
        <v-icon>la-print</v-icon>
      </v-btn>
    </v-app-bar>
    <div v-if="mastersheet != null">
      <v-sheet
        style="margin-bottom: 20px; overflow-x: auto"
        color="white"
        class="pa-5 sheet"
        light
        elevation="4"
      >
        <div id="printableArea">
          <v-simple-table>
            <tr>
              <td style="border: none" :colspan="getAllLessonColSpan() + 4">
                <v-row>
                  <v-col style="text-align: right">
                    <img src="@/assets/duc.png" height="50px" alt="" />
                  </v-col>
                  <v-col>
                    <h1>كلية دجلة الجامعة</h1>
                    <h1>قسم {{ mastersheet.sectionName }}</h1>
                    <h2>{{ mastersheet.yearName }}</h2>
                  </v-col>
                  <v-col style="text-align: left">
                    <div>
                      {{
                        $store.state.levels.filter(
                          (x) => x.idLevel == mastersheet.studyLevel
                        )[0].levelName
                      }}
                    </div>
                    <div>
                      الشعبة : {{ mastersheet.studyClass }} -
                      {{ mastersheet.masterSheetTypeName }}
                    </div>
                    <div>
                      الدراسة :
                      {{
                        mastersheet.studyType == "morningStudy"
                          ? "الصباحية"
                          : "المسائية"
                      }}
                    </div>
                    <div v-if="levelType == 2">
                      {{
                        mastersheet.masterSheetStudyTypeId == 1
                          ? "الفصل الاول"
                          : "الفصل الثاني"
                      }}
                    </div>
                  </v-col>
                </v-row>
              </td>
            </tr>
          </v-simple-table>
          <v-simple-table>
            <thead>
              <tr>
                <th>تسلسل الطالب في الماستر</th>
                <th>اسم الطالب</th>
                <th
                  v-for="lesson in mastersheet.lessons"
                  :key="lesson.idLesson"
                >
                  {{ lesson.lessonName }}
                </th>
                <th>المجموع</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(student, index) in mastersheet.students">
                <tr
                  v-if="
                    getTotalFailsByStudent(student) > 0 &&
                    !student.notice.includes('#')
                  "
                  :key="student.studentId"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ student.studentName }}</td>
                  <td
                    v-for="lesson in mastersheet.lessons"
                    :key="lesson.idLesson"
                    v-bind:class="[
                      getStundetDegree(
                        student,
                        lesson.idLesson,
                        'secondFinal'
                      ) != null &&
                      getStudentFinalDegree(student, lesson.idLesson, 'try2') <
                        50
                        ? 'red darken-2 white--text'
                        : '',
                      getStundetDegree(
                        student,
                        lesson.idLesson,
                        'secondPracticalFinal'
                      ) != null &&
                      getStudentFinalDegree(student, lesson.idLesson, 'try2') <
                        50
                        ? 'red darken-2 white--text'
                        : '',
                      checkIfFinalMarkIsCustome(student, lesson.idLesson, 12)
                        ? getStundetDegree(
                            student,
                            lesson.idLesson,
                            'secondFinal'
                          ) +
                            getStundetDegree(
                              student,
                              lesson.idLesson,
                              'secondPracticalFinal'
                            ) +
                            getStundetDegree(
                              student,
                              lesson.idLesson,
                              'notFinal'
                            ) <
                          50
                          ? ''
                          : ''
                        : '',
                    ]"
                  >
                    <template
                      v-if="
                        getStundetDegree(
                          student,
                          lesson.idLesson,
                          'secondFinal'
                        ) != null ||
                        (getStundetDegree(
                          student,
                          lesson.idLesson,
                          'secondPracticalFinal'
                        ) != null &&
                          getStudentFinalDegree(
                            student,
                            lesson.idLesson,
                            'try2'
                          ) < 50)
                      "
                    >
                      <div
                        v-if="
                          getStudentMarkStatus(student, lesson.idLesson, 6) == 3
                        "
                      >
                        م
                      </div>
                      <div v-else>
                        {{
                          getStudentFinalDegree(
                            student,
                            lesson.idLesson,
                            "try2"
                          )
                        }}
                      </div>
                    </template>
                  </td>
                  <td
                    :class="
                      getTotalFailsByStudent(student) > 0
                        ? 'warning white--text'
                        : ''
                    "
                  >
                    <div v-if="getTotalFailsByStudent(student) > 0">
                      {{ getTotalFailsByStudent(student) }}
                    </div>
                  </td>
                </tr>
              </template>
              <tr>
                <td colspan="2">المجموع</td>
                <td
                  v-for="lesson in mastersheet.lessons"
                  :key="lesson.idLesson"
                  :class="
                    getTotalFailsByLesson(lesson) > 0
                      ? 'warning white--text'
                      : ''
                  "
                >
                  <div>{{ getTotalFailsByLesson(lesson) }}</div>
                </td>
                <td class="success"></td>
              </tr>
            </tbody>
          </v-simple-table>
        </div>
      </v-sheet>
    </div>
  </div>
</template>

<script>
import DocumnetSwitcher from "../../../components/DocumnetSwitcher.vue";
export default {
  components: {
    DocumnetSwitcher,
  },
  data: () => ({
    mastersheet: null,
    adminDetails: false,
    hideFailed: false,
    pages: [
      { start: 0, end: 10 },
      { start: 10, end: 20 },
      { start: 20, end: 30 },
    ],
    studentsPerPage: 13,
    levelType: 1,
  }),
  created: function () {
    this.fetch();
    console.log(this.$route.query);
    if (this.$route.query.admin == 1) {
      this.adminDetails = true;
    }
  },
  methods: {
    fetch() {
      let loading = this.$loading.show();
      this.$http.get("masterSheet/" + this.$route.params.id).then((res) => {
        console.log("MASTER", res.data);
        this.mastersheet = res.data;
        this.mastersheet.students = this.mastersheet.students.sort((a, b) =>
          a.studentName.localeCompare(b.studentName)
        );
        // SORT LESSONS
        this.mastersheet.lessons = this.mastersheet.lessons.sort(
          (a, b) => a.lessonCredit - b.lessonCredit
        );
        // MOVE PROJECT TO END
        var projectIndex = this.mastersheet.lessons.findIndex(
          (lesson) => lesson.secondLessonName == "Project"
        );
        this.mastersheet.lessons.push(
          this.mastersheet.lessons.splice(projectIndex, 1)[0]
        );

        var projectIndex2 = this.mastersheet.lessons.findIndex(
          (lesson) => lesson.lessonCredit == 0
        );
        this.mastersheet.lessons.push(
          this.mastersheet.lessons.splice(projectIndex2, 1)[0]
        );

        this.preparePages();
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
    },
    checkIfLessonHasPracticalFinalDegree(index) {
      if (
        this.mastersheet.lessons[index].marks.filter((x) => x.markTypeId == 7)
          .length > 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    checkIfLessonHasFinalDegree(index) {
      if (
        this.mastersheet.lessons[index].marks.filter((x) => x.markTypeId == 5)
          .length > 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    getLessonMark(lesson, markName) {
      switch (markName) {
        case "notFinal":
          return this.levelType == 1
            ? lesson.marks
                .filter(
                  (mark) =>
                    mark.isFinal == 0 &&
                    (mark.markTypeId == 1 || mark.markTypeId == 3)
                )
                .reduce((sum, record) => sum + record.maximumDegree, 0) *
                2 +
                lesson.marks
                  .filter(
                    (mark) =>
                      mark.isFinal == 0 &&
                      mark.markTypeId != 1 &&
                      mark.markTypeId != 3
                  )
                  .reduce((sum, record) => sum + record.maximumDegree, 0)
            : lesson.marks
                .filter((mark) => mark.isFinal == 0)
                .reduce((sum, record) => sum + record.maximumDegree, 0);
        case "final":
          return lesson.marks.filter((x) => x.markTypeId == 5).length > 0
            ? lesson.marks.filter((x) => x.markTypeId == 5)[0].maximumDegree
            : 0;
        case "practicalFinal":
          return lesson.marks.filter((x) => x.markTypeId == 7).length > 0
            ? lesson.marks.filter((x) => x.markTypeId == 7)[0].maximumDegree
            : 0;
        default:
          return 0;
      }
    },
    getStundetDegree(student, lessonId, markName) {
      if (this.hideMarks && markName != "notFinal") {
        return 100;
      }
      let marks = student.marks;
      if (marks == null) {
        return 0;
      }
      if (markName == "notFinal") {
        return marks
          .filter((mark) => mark.isFinal == 0 && mark.lessonId == lessonId)
          .reduce((sum, record) => sum + record.degree, 0);
      }
      if (markName == "final") {
        let finalMark = marks.filter(
          (mark) => mark.masterSheetMarkTypeId == 5 && mark.lessonId == lessonId
        );
        return finalMark.length > 0 ? finalMark[0].degree : null;
      }
      if (markName == "secondFinal") {
        return marks.filter(
          (mark) => mark.masterSheetMarkTypeId == 6 && mark.lessonId == lessonId
        ).length > 0
          ? marks.filter(
              (mark) =>
                mark.masterSheetMarkTypeId == 6 && mark.lessonId == lessonId
            )[0].degree
          : null;
      }
      if (markName == "practicalFinal") {
        return marks.filter(
          (mark) => mark.masterSheetMarkTypeId == 7 && mark.lessonId == lessonId
        ).length > 0
          ? marks.filter(
              (mark) =>
                mark.masterSheetMarkTypeId == 7 && mark.lessonId == lessonId
            )[0].degree
          : null;
      }
      if (markName == "secondPracticalFinal") {
        return marks.filter(
          (mark) => mark.masterSheetMarkTypeId == 8 && mark.lessonId == lessonId
        ).length > 0
          ? marks.filter(
              (mark) =>
                mark.masterSheetMarkTypeId == 8 && mark.lessonId == lessonId
            )[0].degree
          : null;
      }
    },
    getStudentMarkStatus(student, lessonId, markTypeId) {
      if (this.hideMarks) {
        return 1;
      }
      let marks = student.marks;
      if (marks == null) {
        return 0;
      }
      let markStatus = marks.filter(
        (mark) =>
          mark.lessonId == lessonId && mark.masterSheetMarkTypeId == markTypeId
      );
      return markStatus.length > 0 ? markStatus[0].markStatusId : 1;
    },
    checkIfFinalMarkIsCustome(student, lessonId, type) {
      if (this.hideMarks) {
        return false;
      }
      let marks = student.marks;
      if (marks == null) {
        return false;
      }
      let customMark = marks.filter(
        (mark) =>
          mark.masterSheetMarkTypeId == type && mark.lessonId == lessonId
      );
      if (customMark.length > 0) {
        return true;
      }
    },
    getStudentFinalDegree(student, lessonId, type) {
      if (student.marks == null) {
        return;
      }
      if (type == "try1") {
        if (
          this.mastersheet.studyYearId != 2 &&
          this.mastersheet.studyYearId != 1
        ) {
          if (
            [2].includes(this.getStudentMarkStatus(student, lessonId, 5)) ||
            [2].includes(this.getStudentMarkStatus(student, lessonId, 7))
          ) {
            return 0;
          }
        }
        if ([1, 4].includes(this.getStudentMarkStatus(student, lessonId, 5))) {
          let customfinalMark = student.marks.filter(
            (mark) =>
              mark.masterSheetMarkTypeId == 11 && mark.lessonId == lessonId
          );
          if (customfinalMark.length > 0) {
            return customfinalMark[0].degree;
          }
          return (
            this.getStundetDegree(student, lessonId, "notFinal") +
            this.getStundetDegree(student, lessonId, "practicalFinal") +
            this.getStundetDegree(student, lessonId, "final")
          );
        } else {
          return 0;
        }
      }
      if (type == "try2") {
        if (
          this.mastersheet.studyYearId != 2 &&
          this.mastersheet.studyYearId != 1
        ) {
          if (
            [2].includes(this.getStudentMarkStatus(student, lessonId, 6)) ||
            [2].includes(this.getStudentMarkStatus(student, lessonId, 8))
          ) {
            return 0;
          }
        }
        if ([1, 4].includes(this.getStudentMarkStatus(student, lessonId, 6))) {
          let customfinalMark = student.marks.filter(
            (mark) =>
              mark.masterSheetMarkTypeId == 12 && mark.lessonId == lessonId
          );
          if (customfinalMark.length > 0) {
            return customfinalMark[0].degree;
          }
          return (
            this.getStundetDegree(student, lessonId, "notFinal") +
            this.getStundetDegree(student, lessonId, "secondFinal") +
            this.getStundetDegree(student, lessonId, "secondPracticalFinal")
          );
        } else {
          return 0;
        }
      }
    },
    getLessonColSpan(lesson) {
      let colspan = 3;
      if (this.getLessonMark(lesson, "notFinal") == 0) colspan--;
      if (this.getLessonMark(lesson, "final") == 0) colspan--;
      if (this.getLessonMark(lesson, "practicalFinal") == 0) colspan--;
      return colspan;
    },
    getAllLessonColSpan() {
      let sum = 0;
      for (let i = 0; i < this.mastersheet.lessons.length; i++) {
        sum = sum + this.getLessonColSpan(this.mastersheet.lessons[i]);
      }
      return (sum * 3) / 2;
    },
    print() {
      print();
    },
    preparePages() {
      this.pages = [];
      let totalPages = Math.ceil(
        this.mastersheet.students.length / this.studentsPerPage
      );
      let start = 0;
      let end = this.studentsPerPage;
      for (let i = 0; i < totalPages; i++) {
        this.pages.push({ start: start, end: end });
        start = start + this.studentsPerPage;
        end = end + this.studentsPerPage;
      }
    },
    getTotalFailsByStudent(student) {
      let total = 0;
      for (let i = 0; i < this.mastersheet.lessons.length; i++) {
        if (
          this.getStudentFinalDegree(
            student,
            this.mastersheet.lessons[i].idLesson,
            "try2"
          ) < 50 &&
          this.getStudentFinalDegree(
            student,
            this.mastersheet.lessons[i].idLesson,
            "try1"
          ) < 50
        ) {
          total += 1;
        }
      }
      return total;
    },
    getTotalFailsByLesson(lesson) {
      let total = 0;
      for (let i = 0; i < this.mastersheet.students.length; i++) {
        if (
          this.getStudentFinalDegree(
            this.mastersheet.students[i],
            lesson.idLesson,
            "try2"
          ) < 50 &&
          this.getStudentFinalDegree(
            this.mastersheet.students[i],
            lesson.idLesson,
            "try1"
          ) < 50 &&
          !this.mastersheet.students[i].notice.includes("#")
        ) {
          total += 1;
        }
      }
      return total;
    },
    merge() {
      // let loading = this.$loading.show();
      this.$http
        .get(
          `mastersheets?sectionId=${this.mastersheet.sectionId}&year=${this.mastersheet.studyYearId}&class=${this.mastersheet.studyClass}&masterSheetTypeId=${this.mastersheet.masterSheetTypeId}&level=${this.mastersheet.studyLevel}`
        )
        .then((res) => {
          let id = res.data.filter((e) => e.masterSheetStudyTypeId == 1)[0]
            .idMasterSheet;
          if (id == undefined || id == null) {
            this.$toast.open({
              type: "error",
              message: "لا يوجد ماستر فصل اول",
              duration: 5000,
              position: "bottom",
            });
          } else {
            this.$http.get("mastersheet/" + id).then((res) => {
              if (
                res.data.students.length != this.mastersheet.students.length
              ) {
                this.$toast.open({
                  type: "error",
                  message:
                    "عدد طلاب الفصل الاول غير مساو لعدد طلاب الفصل الثاني",
                  duration: 5000,
                  position: "bottom",
                });
                return;
              }

              res.data.lessons = res.data.lessons.sort(
                (a, b) => a.lessonCredit - b.lessonCredit
              );

              this.mastersheet.lessons = [
                ...res.data.lessons,
                ...this.mastersheet.lessons,
              ];
              for (let i = 0; i < this.mastersheet.students.length; i++) {
                if (this.mastersheet.students[i].marks != null) {
                  let student = this.mastersheet.students[i];
                  let secondStudentMarks = res.data.students.filter(
                    (e) => e.studentId == student.studentId
                  )[0].marks;
                  if (secondStudentMarks != null) {
                    this.mastersheet.students[i].marks = [
                      ...this.mastersheet.students[i].marks,
                      ...secondStudentMarks,
                    ];
                  }
                }
              }
            });
          }
        });
    },
  },
};
</script>

<style>
#mastersheetReport table {
  width: 100%;
}
#mastersheetReport table td {
  width: auto;
  overflow: hidden;
  word-wrap: break-word;
}
#mastersheetReport thead {
  display: table-header-group;
}
#mastersheetReport .table {
  page-break-before: always !important;
  page-break-inside: avoid !important;
  page-break-after: avoid !important;
}

#mastersheetReport tfoot {
  display: table-footer-group;
}
#mastersheetReport table td,
#mastersheetReport table th {
  border: 0.5px #000000 solid;
  border-color: #000000 !important;
  padding: 2px !important;
  margin: 0px !important;
  background-color: transparent;
  height: auto;

  text-align: center;
}

#mastersheetReport .center--text {
  text-align: center;
}

#mastersheetReport .v-data-table {
  background-color: transparent !important;
}

#mastersheetReport pre {
  padding-top: 10px;
  white-space: pre-wrap;
  font-size: 10px;
  font-family: "Almarai", sans-serif;
  letter-spacing: normal !important;
}

#mastersheetReport .table {
  background-image: url("~@/assets/stamp.png");
  background-size: 40%;
  background-position: center center;
}
@media print {
  @page {
    size: A4 landscape;
    scale: 50;
    margin: 20px;
  }
  body,
  html {
    background-color: #fff !important;
  }
  #mastersheetReport table * {
    font-size: 9px;
  }
  #mastersheetReport * {
    color-adjust: exact;
  }
  .v-data-table__wrapper table {
    width: 100% !important;
  }
  .v-main {
    padding: 0px !important;
  }
  body * {
    visibility: hidden !important;
  }
  .v-navigation-drawer,
  .v-app-bar {
    display: none;
  }
  #mastersheetReport #printableArea,
  #mastersheetReport #printableArea * {
    visibility: visible !important;
  }
  #mastersheetReport #printableArea {
    position: absolute;
    left: 0;
    top: 0;
  }
}
@media screen {
  #mastersheetReport .table {
    padding-bottom: 30px;
    padding-top: 30px;
    border-bottom: 1px dashed #aaa;
  }
}
</style>