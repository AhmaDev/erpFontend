<template>
  <div id="finalMarks" class="pa-10">
    <v-app-bar app>
      <v-toolbar-title>
        <DocumnetSwitcher
          v-if="mastersheet != null"
          type="finalMarksSecondTry"
          :id="mastersheet.idMasterSheet"
        />
      </v-toolbar-title>
      <v-spacer></v-spacer>
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
    <div id="printableArea" v-if="mastersheet != null">
      <template v-for="student in mastersheet.students">
        <v-sheet
          style="
            margin-bottom: 20px;
            overflow-x: auto;
            page-break-after: always;
          "
          color="white"
          class="pa-5 sheet"
          light
          elevation="0"
          :key="student.studentId"
          v-if="
            !student.notice.includes('#') && getTotalFailsByStudent(student) > 0
          "
        >
          <hr />
          <br />
          <v-row>
            <v-col>
              <img src="@/assets/duc.png" height="50px" alt="" />
            </v-col>
            <v-col>
              <center>
                <h5>كلية دجلة الجامعة</h5>
                <h5>قسم {{ mastersheet.sectionName }}</h5>
                <h6>
                  نتائج الامتحان النهائي للعام الدراسي
                  {{ mastersheet.yearName }}
                </h6>
                <h5>الدور الثاني</h5>
              </center>
            </v-col>
            <v-col style="text-align: left; font-size: 11px">
              <div>
                {{
                  $store.state.levels.filter(
                    (x) => x.idLevel == mastersheet.studyLevel
                  )[0].levelName
                }}
              </div>
              <div>الشعبة : {{ mastersheet.studyClass }}</div>
              <div>
                الدراسة :
                {{
                  mastersheet.studyType == "morningStudy"
                    ? "الصباحية"
                    : "المسائية"
                }}
              </div>
              <div v-if="!isMerged">
                <div v-if="levelType == 2">
                  {{
                    mastersheet.masterSheetStudyTypeId == 1
                      ? "الفصل الاول"
                      : "الفصل الثاني"
                  }}
                </div>
              </div>
              <div v-if="isMerged">الفصل الاول والثاني</div>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col>
                  <span>الطالب: {{ student.studentName }}</span>
                </v-col>
                <v-col style="text-align: left">
                  <span v-if="mastersheet.masterSheetTypeId == 1"
                    >النتيجة:
                    {{ getStudentFinalResultText(student, "try2") }}</span
                  >
                  <span v-if="mastersheet.masterSheetTypeId == 1">
                    <span v-if="checkIfStudentHasCustomMark(student) > 0">
                      بقرار</span
                    >
                  </span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <br />
          <v-simple-table class="white" border="1" cellspacing="0" width="100%">
            <thead>
              <tr>
                <th class="grey lighten-1">المادة</th>
                <template v-for="lesson in mastersheet.lessons">
                  <th class="grey lighten-2" :key="lesson.idLesson">
                    {{ lesson.lessonName }}
                  </th>
                </template>
              </tr>
            </thead>
            <v-card
              width="100%"
              class="pa-10"
              color="error"
              v-if="student.marks == null"
              >لا يوجد درجات لهذا الطالب</v-card
            >
            <tbody v-if="student.marks != null">
              <tr>
                <td class="grey lighten-2">التقدير</td>
                <td
                  v-for="lesson in mastersheet.lessons"
                  :key="lesson.idLesson"
                  v-bind:class="[
                    finalResult(
                      getStudentFinalDegree(student, lesson.idLesson, 'try2')
                    ) == 'ضعيف' &&
                    student.marks.filter((e) => e.lessonId == lesson.idLesson)
                      .length > 0
                      ? 'red darken-2 white--text'
                      : '',
                  ]"
                >
                  <div
                    v-if="
                      student.marks.filter((e) => e.lessonId == lesson.idLesson)
                        .length > 0
                    "
                  >
                    {{
                      finalResult(
                        getStudentFinalDegree(student, lesson.idLesson, "try2")
                      )
                    }}
                    <span
                      v-if="
                        checkIfStudentHasCustomMarkPerLesson(
                          student,
                          lesson.idLesson
                        ) &&
                        getStundetDegree(
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
                      "
                    >
                      بقرار</span
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <br />
          <v-row>
            <v-col>
              <span> ختم اللجنة الامتحانية</span>
            </v-col>
            <v-col style="text-align: left">
              <span>رئيس القسم </span>
            </v-col>
          </v-row>
        </v-sheet>
      </template>
      <div class="page-break"></div>
    </div>
  </div>
</template>

<script>
import DocumnetSwitcher from "../../../components/DocumnetSwitcher.vue";

export default {
  components: { DocumnetSwitcher },
  data: () => ({
    mastersheet: null,
    isMerged: false,
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
    checkIfStudentHasCustomMark(student) {
      let lessons = 0;
      for (let i = 0; i < this.mastersheet.lessons.length; i++) {
        if (
          this.checkIfFinalMarkIsCustome(
            student,
            this.mastersheet.lessons[i].idLesson,
            11
          )
        ) {
          lessons++;
        }
      }
      return lessons;
    },
    checkIfStudentHasCustomMarkPerLesson(student, lessonId) {
      if (this.checkIfFinalMarkIsCustome(student, lessonId, 12)) {
        return true;
      } else {
        return false;
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
        if (this.getStudentFinalDegree(student, lessonId, "try1") > 49) {
          return -1;
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
    finalResult(mark) {
      if (mark == -1) {
        return "";
      }
      if (mark > -1 && mark < 50) {
        return "ضعيف";
      }
      if (mark >= 50 && mark < 60) {
        return "مقبول";
      }
      if (mark >= 60 && mark < 70) {
        return "متوسط";
      }
      if (mark >= 70 && mark < 80) {
        return "جيد";
      }
      if (mark >= 80 && mark < 90) {
        return "جيد جداً";
      }
      if (mark >= 90 && mark < 101) {
        return "امتياز";
      }
    },
    finalTotal(student) {
      let total = 0;
      for (let i = 0; i < this.mastersheet.lessons.length; i++) {
        total =
          total +
          this.getStudentFinalDegree(
            student,
            this.mastersheet.lessons[i].idLesson,
            "try2"
          );
      }
      return total / this.mastersheet.lessons.length;
    },
    getTotalFailsByStudent(student, type = "try1") {
      let total = 0;
      for (let i = 0; i < this.mastersheet.lessons.length; i++) {
        if (
          this.getStudentFinalDegree(
            student,
            this.mastersheet.lessons[i].idLesson,
            type
          ) < 50
        ) {
          if (type == "try1") {
            total += 1;
          } else {
            var mark = this.getStudentFinalDegree(
              student,
              this.mastersheet.lessons[i].idLesson,
              "try1"
            );
            if (mark < 50) {
              total += 1;
            }
          }
        }
      }
      return total;
    },
    getStudentFinalResultText(student, type) {
      if (type == "try1") {
        if (
          this.getTotalFailsByStudent(student) > 0 &&
          this.checkIfStudentHasCustomMark(student) > 0
        )
          return "مكمل بقرار";
        if (
          this.getTotalFailsByStudent(student) > 0 &&
          this.checkIfStudentHasCustomMark(student) == 0
        )
          return "مكمل";
        if (
          this.getTotalFailsByStudent(student) == 0 &&
          this.checkIfStudentHasCustomMark(student) == 0
        )
          return "ناجح";
        if (
          this.getTotalFailsByStudent(student) == 0 &&
          this.checkIfStudentHasCustomMark(student) > 0
        )
          return "ناجح بقرار";
      }
      if (type == "try2") {
        if (
          this.getTotalFailsByStudent(student, "try2") <= 2 &&
          this.getTotalFailsByStudent(student, "try2") > 0
        )
          return "عبور";
        if (this.getTotalFailsByStudent(student, "try2") > 2) return "راسب";
        if (
          this.getTotalFailsByStudent(student, "try2") == 0 &&
          this.checkIfStudentHasCustomMark(student, "try2") == 0
        )
          return "ناجح";
        if (
          this.getTotalFailsByStudent(student, "try2") == 0 &&
          this.checkIfStudentHasCustomMark(student, "try2") > 0
        )
          return "ناجح بقرار";
      }
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
              this.isMerged = true;
            });
          }
        });
    },
  },
};
</script>

<style>
#finalMarks table td,
#finalMarks table th {
  border: 0.5px #000000 solid;
  border-color: #000000 !important;
  padding: 5px !important;
  margin: 0px !important;
  background-color: transparent;
  height: auto;

  text-align: center;
}
#finalMarks .v-data-table {
  background-color: transparent !important;
}

.page-break {
  page-break-after: always;
  height: 0;
  display: block;
  clear: both;
}

@media print {
  @page {
    size: A4 portrait;
    margin: 20px;
  }
  body,
  html {
    background-color: #fff !important;
  }

  #finalMarks .v-sheet {
    page-break-before: always !important;
    page-break-inside: avoid !important;
    page-break-after: avoid !important;
  }

  #finalMarks * {
    font-size: 12px;
  }
  #finalMarks * {
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
  #finalMarks #printableArea,
  #finalMarks #printableArea * {
    visibility: visible !important;
  }
  #finalMarks #printableArea {
    position: absolute;
    left: 0;
    top: 0;
  }
}
@media screen {
  #finalMarks .table {
    padding-bottom: 30px;
    padding-top: 30px;
    border-bottom: 1px dashed #aaa;
  }
}
</style>