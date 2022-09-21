<template>
  <div id="mastersheet" class="pa-10">
    <component :is="`style`"> </component>

    <v-app-bar app>
      <v-toolbar-title>
        <DocumnetSwitcher
          v-if="mastersheet != null"
          type="orderingSecondTry"
          :id="mastersheet.idMasterSheet"
        />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-select
        :items="[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 1000]"
        outlined
        prefix="عدد الطلاب في الصفحة"
        hide-details
        dense
        style="width: 200px"
        @change="preparePages()"
        v-model="studentsPerPage"
      ></v-select>
      <v-spacer></v-spacer>
      <!-- <v-btn plain @click="hideMarks = true" v-if="!hideMarks">
        اخفاء الدرجات
      </v-btn>
      <v-btn plain @click="hideMarks = false" v-if="hideMarks">
        اظهار الدرجات
      </v-btn> -->
      <v-btn
        @click="merge()"
        color="success"
        v-if="mastersheet.masterSheetStudyTypeId != 1"
        >دمج</v-btn
      >
      <v-btn icon @click="tablesToExcel()">
        <v-icon>la-download</v-icon>
      </v-btn>
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
          <div
            v-for="(page, pageIndex) in pages"
            :key="'Page_' + pageIndex"
            class="table"
            style="position: relative"
          >
            <v-simple-table>
              <thead>
                <tr>
                  <td colspan="3">تسلسل معدلات الدور الاول</td>
                </tr>
                <tr>
                  <th>التسلسل</th>
                  <th>اسم الطالب</th>
                  <th>المعدل</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(student, i) in students" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>{{ student.student.studentName }}</td>
                  <td>{{ student.avg }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </div>
        </div>
      </v-sheet>
    </div>
  </div>
</template>

<script>
import DocumnetSwitcher from "../../../components/DocumnetSwitcher.vue";
import * as XLSX from "xlsx/xlsx.mjs";

export default {
  components: {
    DocumnetSwitcher,
  },
  data: () => ({
    mastersheet: null,
    students: [],
    adminDetails: false,
    hideMarks: false,
    pages: [
      { start: 0, end: 10 },
      { start: 10, end: 20 },
      { start: 20, end: 30 },
    ],
    studentsPerPage: 1000,
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
    tafqeetJs(num) {
      if (num == 0) return "صفر";
      return this.$tafqeet.convert(num);
    },
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
        for (let i = 0; i < this.mastersheet.students.length; i++) {
          const student = this.mastersheet.students[i];
          this.students.push({
            student: student,
            avg: this.getStudentAvg(student, "try2"),
          });
        }
        this.students.sort((a, b) => b.avg - a.avg);
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
        if (
          marks.filter((mark) => mark.isFinal == 0 && mark.lessonId == lessonId)
            .length > 0
        ) {
          return marks
            .filter((mark) => mark.isFinal == 0 && mark.lessonId == lessonId)
            .reduce((sum, record) => sum + record.degree, 0);
        } else {
          return 0;
        }
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
      if (markStatus.length > 0) {
        if (this.hideMarks && markStatus[0].markStatusId == 4) {
          return 4;
        }
        if (this.hideMarks && markStatus[0].markStatusId != 4) {
          return 1;
        }
        return markStatus[0].markStatusId;
      } else {
        return 1;
      }
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
    getStudentAvg(student, type) {
      let sum = 0;
      let totalCredits = this.mastersheet.lessons.reduce(
        (a, b) => a + b.lessonCredit,
        0
      );
      if (type == "try1") {
        for (let i = 0; i < this.mastersheet.lessons.length; i++) {
          const lesson = this.mastersheet.lessons[i];
          let degree = this.getStudentFinalDegree(
            student,
            lesson.idLesson,
            type
          );
          let formula = degree * lesson.lessonCredit;
          sum = sum + formula;
        }
        return (sum / totalCredits).toFixed(3);
      }
      if (type == "try2") {
        for (let i = 0; i < this.mastersheet.lessons.length; i++) {
          const lesson = this.mastersheet.lessons[i];
          if (
            this.getStudentFinalDegree(student, lesson.idLesson, "try1") < 50
          ) {
            let degree = this.getStudentFinalDegree(
              student,
              lesson.idLesson,
              type
            );
            let formula = degree * lesson.lessonCredit;
            sum = sum + formula;
          } else {
            let degree = this.getStudentFinalDegree(
              student,
              lesson.idLesson,
              "try1"
            );
            let formula = degree * lesson.lessonCredit;
            sum = sum + formula;
          }
        }
        return (sum / totalCredits).toFixed(3);
      }
    },
    finalResult(mark) {
      if (mark < 50) {
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
    checkIfStudentHasCustomMark(student, type = "try1") {
      let lessons = 0;
      for (let i = 0; i < this.mastersheet.lessons.length; i++) {
        if (type == "try1") {
          if (
            this.checkIfFinalMarkIsCustome(
              student,
              this.mastersheet.lessons[i].idLesson,
              11
            )
          ) {
            if (
              this.getStudentFinalDegree(
                student,
                this.mastersheet.lessons[i].idLesson,
                "try1"
              ) >
              this.getStundetDegree(
                student,
                this.mastersheet.lessons[i].idLesson,
                "final"
              ) +
                this.getStundetDegree(
                  student,
                  this.mastersheet.lessons[i].idLesson,
                  "practicalFinal"
                ) +
                this.getStundetDegree(
                  student,
                  this.mastersheet.lessons[i].idLesson,
                  "notFinal"
                )
            ) {
              lessons++;
            }
          }
        } else {
          if (
            this.checkIfFinalMarkIsCustome(
              student,
              this.mastersheet.lessons[i].idLesson,
              12
            )
          ) {
            if (
              this.getStudentFinalDegree(
                student,
                this.mastersheet.lessons[i].idLesson,
                "try2"
              ) >
              this.getStundetDegree(
                student,
                this.mastersheet.lessons[i].idLesson,
                "secondFinal"
              ) +
                this.getStundetDegree(
                  student,
                  this.mastersheet.lessons[i].idLesson,
                  "secondPracticalFinal"
                ) +
                this.getStundetDegree(
                  student,
                  this.mastersheet.lessons[i].idLesson,
                  "notFinal"
                )
            ) {
              lessons++;
            }
          }
        }
      }
      return lessons;
    },
    sortTable() {
      var table, rows, switching, i, x, y, shouldSwitch;
      table = document.getElementById("myTable");
      switching = true;
      /* Make a loop that will continue until
  no switching has been done: */
      while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
    first, which contains table headers): */
        for (i = 1; i < rows.length - 1; i++) {
          // Start by saying there should be no switching:
          shouldSwitch = false;
          /* Get the two elements you want to compare,
      one from current row and one from the next: */
          x = rows[i].getElementsByTagName("TD")[0];
          y = rows[i + 1].getElementsByTagName("TD")[0];
          // Check if the two rows should switch place:
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
        if (shouldSwitch) {
          /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
        }
      }
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
    getLessonColSpan() {
      let colspan = 2;
      // if (this.getLessonMark(lesson, "notFinal") == 0) colspan--;
      // if (this.getLessonMark(lesson, "final") == 0) colspan--;
      // if (this.getLessonMark(lesson, "practicalFinal") == 0) colspan--;
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
    getMarkId(lessonId, studentId) {
      let markId = 0;
      markId =
        this.mastersheet.students
          .filter((e) => e.studentId == studentId)[0]
          .marks.filter((e) => e.lessonId == lessonId)[0]?.idMasterSheetMarks ??
        "NONE";
      return markId;
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

    tablesToExcel() {
      var table_elt = document.getElementsByClassName(
        "v-data-table__wrapper"
      )[0];
      var wb = XLSX.utils.table_to_book(table_elt, { raw: true });
      if (wb.Workbook) {
        wb.Workbook.Views[0]["RTL"] = true;
      } else {
        wb.Workbook = {};
        wb.Workbook["Views"] = [{ RTL: true }];
      }

      // Package and Release Data (`writeFile` tries to write and save an XLSB file)
      XLSX.writeFile(wb, "Report.xlsx");
    },
  },
};
</script>

<style>
#mastersheet table * {
  /* font-size: 11px; */
}
#mastersheet table {
  width: 100%;
}
#mastersheet table td {
  width: auto;
  overflow: hidden;
  word-wrap: break-word;
}
#mastersheet thead {
  display: table-header-group;
}
#mastersheet .table {
  page-break-before: always !important;
  page-break-inside: avoid !important;
  page-break-after: avoid !important;
}

#mastersheet tfoot {
  display: table-footer-group;
}
#mastersheet table td,
#mastersheet table th {
  border: 0.5px #000000 solid;
  border-color: #000000 !important;
  padding: 2px !important;
  margin: 0px !important;
  background-color: transparent;
  height: auto;

  text-align: center;
}

#mastersheet .center--text {
  text-align: center;
}

#mastersheet .v-data-table {
  background-color: transparent !important;
}

#mastersheet pre {
  padding-top: 10px;
  white-space: pre-wrap;
  font-size: 10px;
  font-family: "Almarai", sans-serif;
  letter-spacing: normal !important;
}

#mastersheet .table {
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
  #mastersheet table * {
    /* font-size: 9px; */
  }
  #mastersheet * {
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
  #mastersheet #printableArea,
  #mastersheet #printableArea * {
    visibility: visible !important;
  }
  #mastersheet #printableArea {
    position: absolute;
    left: 0;
    top: 0;
  }
}
@media screen {
  #mastersheet .table {
    padding-bottom: 30px;
    padding-top: 30px;
    border-bottom: 1px dashed #aaa;
  }
}
</style>