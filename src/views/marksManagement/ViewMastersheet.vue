<template>
  <div id="mastersheet" class="pa-10">
    <component :is="`style`"> </component>

    <v-app-bar app>
      <v-toolbar-title>
        <DocumnetSwitcher
          v-if="mastersheet != null"
          type="mastersheet"
          :id="mastersheet.idMasterSheet"
        />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-select
        :items="[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]"
        outlined
        prefix="عدد الطلاب في الصفحة"
        hide-details
        dense
        style="width: 200px"
        @change="preparePages()"
        v-model="studentsPerPage"
      ></v-select>
      <v-spacer></v-spacer>
      <v-btn plain @click="hideMarks = true" v-if="!hideMarks">
        اخفاء الدرجات
      </v-btn>
      <v-btn plain @click="hideMarks = false" v-if="hideMarks">
        اظهار الدرجات
      </v-btn>
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
          <div
            v-for="(page, pageIndex) in pages"
            :key="'Page_' + pageIndex"
            class="table"
            style="position: relative"
          >
            <v-simple-table
              class="white"
              border="1"
              cellspacing="0"
              width="100%"
            >
              <thead>
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
                <tr>
                  <th class="grey lighten-2" colspan="2">
                    المادة وعدد الوحدات
                  </th>
                  <template v-for="lesson in mastersheet.lessons">
                    <th
                      :key="'LESSON1_NAME_' + lesson.idLesson"
                      :colspan="getLessonColSpan(lesson)"
                      class="grey lighten-3"
                    >
                      {{ lesson.lessonName }}
                    </th>
                    <th
                      class="grey lighten-2"
                      :key="'LESSON1_CREDITS_' + lesson.idLesson"
                    >
                      {{ lesson.lessonCredit }}
                    </th>
                  </template>
                  <th rowspan="3">الملاحظات</th>
                </tr>
                <tr>
                  <th class="grey lighten-3" colspan="2" rowspan="2">
                    اسم الطالب و الرقم الجامعي
                  </th>
                  <template v-for="(lesson, index) in mastersheet.lessons">
                    <th
                      v-if="getLessonMark(lesson, 'notFinal') != 0"
                      :key="'LESSON2_NAME_' + lesson.idLesson"
                      class="green lighten-5"
                      style="font-size: 9px"
                      width="50px"
                    >
                      السعي
                    </th>
                    <th
                      class="green lighten-5"
                      :key="'LESSON2_CREDITS_' + lesson.idLesson"
                      v-if="checkIfLessonHasFinalDegree(index)"
                      style="font-size: 9px"
                      width="50px"
                    >
                      الامتحان النهائي
                    </th>
                    <th
                      class="green lighten-5"
                      v-if="checkIfLessonHasPracticalFinalDegree(index)"
                      :key="'LESSON_FINAL_PR_' + lesson.idLesson"
                      style="font-size: 9px"
                      width="50px"
                    >
                      عملي نهائي
                    </th>
                    <th
                      class="green lighten-5"
                      :key="'LESSON_FINAL_' + lesson.idLesson"
                      style="font-size: 9px"
                      width="50px"
                    >
                      الدرجة النهائية
                    </th>
                  </template>
                </tr>
                <tr>
                  <template v-for="(lesson, index) in mastersheet.lessons">
                    <th
                      class="blue lighten-5"
                      v-if="getLessonMark(lesson, 'notFinal') != 0"
                      :key="'LESSON_NAME3_' + lesson.idLesson"
                    >
                      {{ getLessonMark(lesson, "notFinal") }}
                    </th>
                    <th
                      class="blue lighten-5"
                      v-if="checkIfLessonHasFinalDegree(index)"
                      :key="'LESSON_CREDITS3_' + lesson.idLesson"
                    >
                      {{ getLessonMark(lesson, "final") }}
                    </th>
                    <th
                      class="blue lighten-5"
                      v-if="checkIfLessonHasPracticalFinalDegree(index)"
                      :key="'LESSON_CREDITS4_' + lesson.idLesson"
                    >
                      {{ getLessonMark(lesson, "practicalFinal") }}
                    </th>
                    <th
                      class="blue lighten-5"
                      :key="'LESSON_CREDITS5_' + lesson.idLesson"
                    >
                      {{
                        getLessonMark(lesson, "notFinal") +
                        getLessonMark(lesson, "final") +
                        getLessonMark(lesson, "practicalFinal")
                      }}
                    </th>
                  </template>
                </tr>
              </thead>

              <tbody
                v-for="(student, studentIndex) in mastersheet.students.slice(
                  page.start,
                  page.end
                )"
                :key="student.idStudent"
              >
                <tr>
                  <td rowspan="2">
                    {{ studentIndex + (pages[pageIndex].start + 1) }}
                  </td>
                  <td style="white-space: nowrap">{{ student.studentName }}</td>
                  <template v-if="!student.notice.includes('#')">
                    <template
                      v-for="(lesson, lessonIndex) in mastersheet.lessons"
                    >
                      <td
                        class="center--text"
                        rowspan="2"
                        :class="[
                          getStudentMarkStatus(student, lesson.idLesson, 1) == 4
                            ? ''
                            : '',
                        ]"
                        :key="'STUDENT_LESSONS_2_' + lesson.idLesson"
                        v-if="getLessonMark(lesson, 'notFinal') != 0"
                      >
                        <!-- NOT FINAL DEGREE -->

                        <div
                          v-if="
                            getStudentMarkStatus(student, lesson.idLesson, 1) ==
                              4 ||
                            getStudentMarkStatus(student, lesson.idLesson, 5) ==
                              4
                          "
                        >
                          مستوف
                        </div>
                        <div v-else>
                          <template
                            v-if="
                              student.marks.filter(
                                (e) => e.lessonId == lesson.idLesson
                              ).length == 0
                            "
                          >
                          </template>
                          <template v-else>
                            {{
                              getStundetDegree(
                                student,
                                lesson.idLesson,
                                "notFinal"
                              )
                            }}
                          </template>
                        </div>

                        <!-- NOT FINAL DEGREE -->
                      </td>
                      <td
                        class="center--text"
                        :key="'STUDENT_LESSONS_' + lesson.idLesson"
                        v-if="checkIfLessonHasFinalDegree(lessonIndex)"
                        :class="[
                          getStudentMarkStatus(student, lesson.idLesson, 5) == 2
                            ? 'red darken-2 white--text'
                            : '',
                          getStudentMarkStatus(student, lesson.idLesson, 5) == 3
                            ? getStundetDegree(
                                student,
                                lesson.idLesson,
                                'final'
                              ) +
                                getStundetDegree(
                                  student,
                                  lesson.idLesson,
                                  'practicalFinal'
                                ) +
                                getStundetDegree(
                                  student,
                                  lesson.idLesson,
                                  'notFinal'
                                ) <
                              50
                              ? 'yellow darken-2 black--text'
                              : 'blue white--text'
                            : '',
                        ]"
                      >
                        <!-- FINAL DEGREE -->
                        <template v-if="!hideMarks">
                          <template
                            v-if="
                              [1].includes(
                                getStudentMarkStatus(
                                  student,
                                  lesson.idLesson,
                                  5
                                )
                              )
                            "
                          >
                            <div
                              v-if="
                                getStudentMarkStatus(
                                  student,
                                  lesson.idLesson,
                                  1
                                ) == 4 ||
                                getStudentMarkStatus(
                                  student,
                                  lesson.idLesson,
                                  5
                                ) == 4
                              "
                            ></div>
                            <div v-else>
                              {{
                                getStundetDegree(
                                  student,
                                  lesson.idLesson,
                                  "final"
                                )
                              }}
                            </div>
                          </template>
                          <template
                            v-if="
                              getStudentMarkStatus(
                                student,
                                lesson.idLesson,
                                5
                              ) == 2
                            "
                            >غائب
                          </template>
                          <template
                            v-if="
                              getStudentMarkStatus(
                                student,
                                lesson.idLesson,
                                5
                              ) == 3
                            "
                            >مؤجل
                          </template>
                        </template>
                        <!-- FINAL DEGREE -->
                      </td>
                      <td
                        class="center--text"
                        :class="[
                          getStudentMarkStatus(student, lesson.idLesson, 7) == 2
                            ? 'red darken-2 white--text'
                            : '',
                          getStudentMarkStatus(student, lesson.idLesson, 7) == 3
                            ? getStundetDegree(
                                student,
                                lesson.idLesson,
                                'final'
                              ) +
                                getStundetDegree(
                                  student,
                                  lesson.idLesson,
                                  'practicalFinal'
                                ) +
                                getStundetDegree(
                                  student,
                                  lesson.idLesson,
                                  'notFinal'
                                ) <
                              50
                              ? 'yellow darken-2 black--text'
                              : 'blue white--text'
                            : '',
                        ]"
                        v-if="checkIfLessonHasPracticalFinalDegree(lessonIndex)"
                        :key="'STUDENT_LESSONS_3_' + lesson.idLesson"
                      >
                        <!-- PRACTICAL FINAL DEGREE -->
                        <template v-if="!hideMarks">
                          <template
                            v-if="
                              [1].includes(
                                getStudentMarkStatus(
                                  student,
                                  lesson.idLesson,
                                  7
                                )
                              )
                            "
                          >
                            <div
                              v-if="
                                getStudentMarkStatus(
                                  student,
                                  lesson.idLesson,
                                  1
                                ) == 4 ||
                                getStudentMarkStatus(
                                  student,
                                  lesson.idLesson,
                                  7
                                ) == 4
                              "
                            ></div>
                            <div v-else>
                              {{
                                getStundetDegree(
                                  student,
                                  lesson.idLesson,
                                  "practicalFinal"
                                )
                              }}
                            </div>
                          </template>
                          <template
                            v-if="
                              getStudentMarkStatus(
                                student,
                                lesson.idLesson,
                                7
                              ) == 2
                            "
                            >غائب
                          </template>
                          <template
                            v-if="
                              getStudentMarkStatus(
                                student,
                                lesson.idLesson,
                                7
                              ) == 3
                            "
                            >مؤجل
                          </template>
                        </template>
                        <!-- PRACTICAL FINAL DEGREE -->
                      </td>
                      <td
                        class="center--text"
                        v-bind:class="[
                          getStundetDegree(student, lesson.idLesson, 'final') !=
                            null &&
                          getStudentFinalDegree(
                            student,
                            lesson.idLesson,
                            'try1'
                          ) < 50
                            ? 'red darken-2 white--text'
                            : '',
                          checkIfFinalMarkIsCustome(
                            student,
                            lesson.idLesson,
                            11
                          )
                            ? getStundetDegree(
                                student,
                                lesson.idLesson,
                                'final'
                              ) +
                                getStundetDegree(
                                  student,
                                  lesson.idLesson,
                                  'practicalFinal'
                                ) +
                                getStundetDegree(
                                  student,
                                  lesson.idLesson,
                                  'notFinal'
                                ) <
                              50
                              ? 'yellow darken-2 black--text'
                              : 'blue darken-2 black--text'
                            : '',
                          getStundetDegree(
                            student,
                            lesson.idLesson,
                            'practicalFinal'
                          ) != null &&
                          getStudentFinalDegree(
                            student,
                            lesson.idLesson,
                            'try1'
                          ) < 50
                            ? 'red darken-2 white--text'
                            : '',
                          checkIfFinalMarkIsCustome(
                            student,
                            lesson.idLesson,
                            11
                          )
                            ? getStundetDegree(
                                student,
                                lesson.idLesson,
                                'final'
                              ) +
                                getStundetDegree(
                                  student,
                                  lesson.idLesson,
                                  'practicalFinal'
                                ) +
                                getStundetDegree(
                                  student,
                                  lesson.idLesson,
                                  'notFinal'
                                ) <
                              50
                              ? 'yellow darken-2 black--text'
                              : 'blue darken-2 black--text'
                            : '',
                        ]"
                        :key="'STUDENT_LESSONS_4_' + lesson.idLesson"
                      >
                        <v-chip color="warning" x-small v-if="adminDetails"
                          >STUDENT ID: {{ student.studentId }}</v-chip
                        >
                        <v-chip color="primary" x-small v-if="adminDetails"
                          >LESSON ID: {{ lesson.idLesson }}</v-chip
                        >
                        <v-chip color="error" x-small v-if="adminDetails"
                          >MARK ID:
                          {{
                            getMarkId(lesson.idLesson, student.studentId)
                          }}</v-chip
                        >
                        <!-- TOTAL DEGREE -->
                        <template v-if="!hideMarks">
                          <template
                            v-if="
                              getStundetDegree(
                                student,
                                lesson.idLesson,
                                'final'
                              ) != null ||
                              getStundetDegree(
                                student,
                                lesson.idLesson,
                                'practicalFinal'
                              ) != null
                            "
                          >
                            <div
                              v-if="
                                getStudentMarkStatus(
                                  student,
                                  lesson.idLesson,
                                  5
                                ) == 3
                              "
                            >
                              م
                            </div>
                            <div v-else>
                              {{
                                getStudentFinalDegree(
                                  student,
                                  lesson.idLesson,
                                  "try1"
                                )
                              }}
                            </div>
                          </template>
                        </template>
                        <!-- TOTAL DEGREE -->
                      </td>
                    </template>
                  </template>
                  <td
                    :colspan="
                      student.notice.includes('#')
                        ? getAllLessonColSpan() + 1
                        : 1
                    "
                    rowspan="2"
                    class="center--text"
                  >
                    {{ student.notice }}
                  </td>
                </tr>
                <tr>
                  <td>{{ student.studentCollegeNumber }}</td>
                  <template v-if="!student.notice.includes('#')">
                    <template
                      v-for="(lesson, lessonIndex) in mastersheet.lessons"
                    >
                      <td
                        class="center--text"
                        :key="'STUDENT_LESSONS_5_' + lesson.idLesson"
                        v-if="checkIfLessonHasFinalDegree(lessonIndex)"
                        :class="[
                          getStudentMarkStatus(student, lesson.idLesson, 6) == 2
                            ? 'red darken-2 white--text'
                            : '',
                          getStudentMarkStatus(student, lesson.idLesson, 6) == 3
                            ? 'yellow darken-2 black--text'
                            : '',
                        ]"
                      >
                        <!-- SECOND FINAL DEGREE -->
                        <template v-if="!hideMarks">
                          <template
                            v-if="
                              [1].includes(
                                getStudentMarkStatus(
                                  student,
                                  lesson.idLesson,
                                  6
                                )
                              )
                            "
                          >
                            {{
                              getStundetDegree(
                                student,
                                lesson.idLesson,
                                "secondFinal"
                              )
                            }}
                          </template>
                          <template
                            v-if="
                              getStudentMarkStatus(
                                student,
                                lesson.idLesson,
                                6
                              ) == 2
                            "
                            >غائب
                          </template>
                          <template
                            v-if="
                              getStudentMarkStatus(
                                student,
                                lesson.idLesson,
                                6
                              ) == 3
                            "
                            >مؤجل
                          </template>
                          <!-- SECOND FINAL DEGREE -->
                        </template>
                      </td>
                      <td
                        class="center--text"
                        :class="[
                          getStudentMarkStatus(student, lesson.idLesson, 8) == 2
                            ? 'red darken-2 white--text'
                            : '',
                          getStudentMarkStatus(student, lesson.idLesson, 8) == 3
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
                              ? 'yellow darken-2 black--text'
                              : 'blue white--text'
                            : '',
                        ]"
                        v-if="checkIfLessonHasPracticalFinalDegree(lessonIndex)"
                        :key="'STUDENT_LESSONS_3_' + lesson.idLesson"
                      >
                        <!-- PRACTICAL FINAL DEGREE -->
                        <template v-if="!hideMarks">
                          <template
                            v-if="
                              [1].includes(
                                getStudentMarkStatus(
                                  student,
                                  lesson.idLesson,
                                  8
                                )
                              )
                            "
                          >
                            <div
                              v-if="
                                getStudentMarkStatus(
                                  student,
                                  lesson.idLesson,
                                  1
                                ) == 4 ||
                                getStudentMarkStatus(
                                  student,
                                  lesson.idLesson,
                                  8
                                ) == 4
                              "
                            ></div>
                            <div v-else>
                              {{
                                getStundetDegree(
                                  student,
                                  lesson.idLesson,
                                  "secondPracticalFinal"
                                )
                              }}
                            </div>
                          </template>
                          <template
                            v-if="
                              getStudentMarkStatus(
                                student,
                                lesson.idLesson,
                                8
                              ) == 2
                            "
                            >غائب
                          </template>
                          <template
                            v-if="
                              getStudentMarkStatus(
                                student,
                                lesson.idLesson,
                                8
                              ) == 3
                            "
                            >مؤجل
                          </template>
                        </template>
                        <!-- PRACTICAL FINAL DEGREE -->
                      </td>
                      <td
                        class="center--text"
                        v-bind:class="[
                          getStundetDegree(
                            student,
                            lesson.idLesson,
                            'secondFinal'
                          ) != null &&
                          getStudentFinalDegree(
                            student,
                            lesson.idLesson,
                            'try2'
                          ) < 50
                            ? 'red darken-2 white--text'
                            : '',
                          getStundetDegree(
                            student,
                            lesson.idLesson,
                            'secondPracticalFinal'
                          ) != null &&
                          getStudentFinalDegree(
                            student,
                            lesson.idLesson,
                            'try2'
                          ) < 50
                            ? 'red darken-2 white--text'
                            : '',
                          checkIfFinalMarkIsCustome(
                            student,
                            lesson.idLesson,
                            12
                          )
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
                              ? 'yellow darken-2 black--text'
                              : 'blue darken-2 white--text'
                            : '',
                        ]"
                        :key="'STUDENT_LESSONS_7_' + lesson.idLesson"
                      >
                        <!-- SECOND TOTAL DEGREE -->
                        <template v-if="!hideMarks">
                          <template
                            v-if="
                              getStundetDegree(
                                student,
                                lesson.idLesson,
                                'secondFinal'
                              ) != null ||
                              getStundetDegree(
                                student,
                                lesson.idLesson,
                                'secondPracticalFinal'
                              ) != null
                            "
                          >
                            {{
                              getStudentFinalDegree(
                                student,
                                lesson.idLesson,
                                "try2"
                              )
                            }}
                          </template>
                        </template>
                        <!-- SECOND TOTAL DEGREE -->
                      </td>
                    </template>
                  </template>
                </tr>
              </tbody>
            </v-simple-table>
            <div v-if="pageIndex == pages.length - 1">
              <pre>{{ mastersheet.masterSheetNotice }}</pre>
            </div>
            <div style="font-size: 10px; padding: 10px; text-align: center">
              <v-row>
                <v-col>منظم الشيت</v-col>
                <v-col>عضو اللجنة الامتحانية</v-col>
                <v-col>عضو اللجنة الامتحانية</v-col>
                <v-col>رئيس اللجنة الامتحانية الفرعية</v-col>
                <v-col>رئيس اللجنة الامتحانية المركزية</v-col>
              </v-row>
            </div>
          </div>
        </div>
      </v-sheet>
    </div>
  </div>
</template>

<script>
import DocumnetSwitcher from "../../components/DocumnetSwitcher.vue";
export default {
  components: {
    DocumnetSwitcher,
  },
  data: () => ({
    mastersheet: null,
    adminDetails: false,
    hideMarks: false,
    pages: [
      { start: 0, end: 10 },
      { start: 10, end: 20 },
      { start: 20, end: 30 },
    ],
    studentsPerPage: 13,
    levelType: 1,
    isMerged: false,
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
      if (this.isMerged) {
        return;
      }
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
#mastersheet table * {
  font-size: 11px;
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
    font-size: 9px;
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