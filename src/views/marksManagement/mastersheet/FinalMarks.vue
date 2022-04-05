<template>
  <div id="finalMarks" class="pa-10">
    <v-app-bar app>
      <v-toolbar-title>
        <DocumnetSwitcher
          v-if="mastersheet != null"
          type="finalMarks"
          :id="mastersheet.idMasterSheet"
        />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="print()">
        <v-icon>la-print</v-icon>
      </v-btn>
    </v-app-bar>
    <div id="printableArea" v-if="mastersheet != null">
      <v-sheet
        style="margin-bottom: 20px; overflow-x: auto; page-break-after: always"
        color="white"
        class="pa-5 sheet"
        light
        elevation="0"
        v-for="student in mastersheet.students"
        :key="student.studentId"
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
                نتائج الامتحان النهائي للعام الدراسي {{ mastersheet.yearName }}
              </h6>
              <h5>الدور الاول</h5>
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
            <div v-if="levelType == 2">
              {{
                mastersheet.masterSheetStudyTypeId == 1
                  ? "الفصل الاول"
                  : "الفصل الثاني"
              }}
            </div>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col>
                <span>الطالب: {{ student.studentName }}</span>
              </v-col>
              <v-col style="text-align: left">
                <span
                  >النتيجة:
                  {{ finalTotal(student) >= 50 ? "ناجح" : "مكمل" }}</span
                >
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
          <tbody>
            <tr>
              <td class="grey lighten-2">التقدير</td>
              <td
                v-for="lesson in mastersheet.lessons"
                :key="lesson.idLesson"
                v-bind:class="[
                  finalResult(
                    getStudentFinalDegree(student, lesson.idLesson, 'try1')
                  ) == 'ضعيف'
                    ? 'red darken-2 white--text'
                    : '',
                ]"
              >
                {{
                  finalResult(
                    getStudentFinalDegree(student, lesson.idLesson, "try1")
                  )
                }}
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
    getStudentFinalDegree(student, lessonId, type) {
      if (type == "try1") {
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
    finalTotal(student) {
      let total = 0;
      for (let i = 0; i < this.mastersheet.lessons.length; i++) {
        total =
          total +
          this.getStudentFinalDegree(
            student,
            this.mastersheet.lessons[i].idLesson,
            "try1"
          );
      }
      return total / this.mastersheet.lessons.length;
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