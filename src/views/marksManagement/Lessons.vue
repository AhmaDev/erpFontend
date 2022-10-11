<template>
  <div id="lessons" class="pa-10">
    <v-app-bar app>
      <v-toolbar-title> المواد الدراسية </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-autocomplete
        outlined
        disabled
        dense
        hide-details
        prefix="السنة الدراسية"
        :items="years"
        item-text="year"
        item-value="idYearStudy"
        v-model="selectedYear"
      ></v-autocomplete>
    </v-app-bar>
    <v-card class="pa-5">
      <v-row>
        <v-col cols="2">
          <v-list dense rounded>
            <v-subheader>
              <v-icon small class="pl-5">la-sort-numeric-down</v-icon>
              المراحل
            </v-subheader>
            <v-divider></v-divider>
            <br />
            <v-list-item-group color="primary">
              <v-list-item
                @click="selectLevel(level.idLevel)"
                v-for="level in $store.state.levels"
                :key="'LEVEL_' + level.idLevel"
              >
                <v-list-item-title>{{ level.levelName }}</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col v-if="selectedLevel != null" cols="3">
          <v-list rounded dense>
            <v-subheader>
              <v-icon small class="pl-5">la-book</v-icon>
              المواد الدراسية
            </v-subheader>
            <v-btn
              rounded
              block
              @click="addNewLessonDialog = true"
              color="primary"
            >
              <v-icon left>la-plus</v-icon>
              اضافة
            </v-btn>
            <br />
            <v-divider></v-divider>
            <br
              v-if="
                levelTypes.filter((l) => l.level == selectedLevel + 1).length ==
                0
              "
            />
            <v-alert
              type="error"
              dense
              v-if="getLevelType(selectedLevel).length == 0"
              dark
              color="orange"
            >
              <small
                >يرجى اختيار النظام الدراسي للمرحلة
                {{ selectedLevel + 1 }}</small
              >
            </v-alert>
            <v-radio-group
              @change="setLevelType($event)"
              hide-details
              dense
              :value="
                getLevelType(selectedLevel).length > 0
                  ? getLevelType(selectedLevel)[0].masterSheetStudyTypeId
                  : 3
              "
            >
              <v-radio label="النظام السنوي" :value="1"></v-radio>
              <v-radio label="النظام الفصلي" :value="2"></v-radio>
            </v-radio-group>
            <v-list-item-group
              v-if="getLevelType(selectedLevel).length > 0"
              color="primary"
            >
              <br />
              <v-divider
                v-if="
                  getLevelType(selectedLevel)[0].masterSheetStudyTypeId == 2
                "
              ></v-divider>
              <v-subheader
                v-if="
                  getLevelType(selectedLevel)[0].masterSheetStudyTypeId == 2
                "
                >الفصل الاول</v-subheader
              >
              <v-list-item
                @click="selectLesson(lesson)"
                v-for="lesson in lessons.filter((l) => l.lessonCourse == 1)"
                :key="'LESSON_' + lesson.idLesson"
              >
                <v-list-item-icon><v-icon>la-book</v-icon></v-list-item-icon>
                <v-list-item-title>{{ lesson.lessonName }}</v-list-item-title>
              </v-list-item>
              <v-divider
                v-if="
                  getLevelType(selectedLevel)[0].masterSheetStudyTypeId == 2
                "
              ></v-divider>
              <v-subheader
                v-if="
                  getLevelType(selectedLevel)[0].masterSheetStudyTypeId == 2
                "
                >الفصل الثاني</v-subheader
              >
              <v-list-item
                @click="selectLesson(lesson)"
                v-for="lesson in lessons.filter((l) => l.lessonCourse == 2)"
                :key="'LESSON_' + lesson.idLesson"
              >
                <v-list-item-icon><v-icon>la-book</v-icon></v-list-item-icon>
                <v-list-item-title>{{ lesson.lessonName }}</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="7">
          <v-row v-if="selectedLesson != null">
            <v-col cols="12">
              <v-btn
                :loading="saveLessonLoading"
                rounded
                style="float: left"
                color="success"
                @click="saveLesson()"
              >
                <v-icon left>la-check</v-icon>
                <span>حفظ</span>
              </v-btn>
              <v-btn
                rounded
                style="float: right"
                color="error"
                @click="deleteLesson()"
              >
                <v-icon left>la-trash</v-icon>
                <span>حذف المادة</span>
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="5">
                  <v-text-field
                    dense
                    outlined
                    label="اسم المادة"
                    v-model="lessonForm.lessonName"
                  ></v-text-field>
                </v-col>
                <v-col cols="5">
                  <v-text-field
                    dense
                    outlined
                    label="اسم المادة باللغة الانجليزية"
                    v-model="lessonForm.secondLessonName"
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    dense
                    type="number"
                    outlined
                    label="الوحدات"
                    v-model="lessonForm.lessonCredit"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    dense
                    type="number"
                    outlined
                    label="ساعات النظري"
                    v-model="lessonForm.thHours"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    dense
                    type="number"
                    outlined
                    label="ساعات العملي"
                    v-model="lessonForm.prHours"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-autocomplete
                    outlined
                    dense
                    item-value="idTeacher"
                    item-text="teacherName"
                    v-model="lessonForm.teacherId"
                    label="التدريسي"
                    :items="teachers"
                  ></v-autocomplete>
                </v-col>
                <v-col>
                  <v-btn @click="addTeacherDialog = true" color="primary">
                    <v-icon>la-plus</v-icon>
                    اضافة تدريسي
                  </v-btn>
                </v-col>
              </v-row>
              <v-data-table
                :items="
                  lessons.filter((x) => x.idLesson == selectedLessonId)[0].marks
                "
                :headers="marksHeader"
                v-if="selectedLessonId != null"
              >
                <template v-slot:[`item.maximumDegree`]="{ item }">
                  <v-text-field
                    hide-details
                    dense
                    :value="item.maximumDegree"
                    @change="updateDegree($event, item.idLessonMark)"
                    outlined
                  ></v-text-field>
                </template>
                <template v-slot:[`item.actions`]="{ item, index }">
                  <v-menu offset-y>
                    <template v-bind="item" v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" icon>
                        <v-icon color="red" title="حذف الدرجة">la-trash</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        @click="deleteMark(item.idLessonMark, index)"
                      >
                        <v-list-item-title
                          >اضغط هنا لتأكيد حذف الدرجة</v-list-item-title
                        >
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-data-table>
              <h4
                v-if="
                  getLevelType(selectedLevel)[0].masterSheetStudyTypeId == 1
                "
              >
                المجموع النهائي :
                {{ getLessonTotalDegree(lessons[selectedLesson].marks) }}
              </h4>
              <h4
                v-if="
                  getLevelType(selectedLevel)[0].masterSheetStudyTypeId == 2
                "
              >
                المجموع النهائي :
                {{
                  lessons[selectedLesson].marks
                    .reduce((a, b) => a + b.maximumDegree, 0)
                    .toLocaleString()
                }}
              </h4>
              <v-speed-dial
                transition="slide-y-reverse-transition"
                bottom
                fixed
              >
                <template v-slot:activator>
                  <v-btn large color="primary" dark rounded>
                    <v-icon left>la-edit</v-icon>
                    اضافة درجة
                  </v-btn>
                </template>
                <v-btn
                  @click="addNewMark(markType.idMarkType)"
                  v-for="markType in markTypes"
                  :key="markType.idMarkType"
                  rounded
                  dark
                  color="indigo"
                  width="200px"
                >
                  {{ markType.markTypeName }}
                </v-btn>
              </v-speed-dial>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>

    <v-dialog
      width="100%"
      max-width="500px"
      persistent
      v-model="addNewLessonDialog"
      transition="menu-popover"
      v-if="getLevelType(selectedLevel).length > 0"
    >
      <v-card>
        <v-card-title>اضافة مادة جديدة</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <br />
          <v-text-field
            v-model="addNewLessonForm.lessonName"
            outlined
            label="اسم المادة"
          ></v-text-field>
          <v-text-field
            v-model="addNewLessonForm.secondLessonName"
            outlined
            label="اسم المادة باللغة الانجليزية"
          ></v-text-field>
          <v-text-field
            v-model="addNewLessonForm.lessonCredit"
            outlined
            label="الوحدات"
          ></v-text-field>
          <v-autocomplete
            :items="$store.state.courseTypes"
            item-value="idCourse"
            item-text="courseName"
            v-model="addNewLessonForm.lessonCourse"
            outlined
            v-if="getLevelType(selectedLevel)[0].masterSheetStudyTypeId == 2"
            label="الفصل الدراسي"
          ></v-autocomplete>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn @click="addNewLesson()" color="primary">اضافة</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="addNewLessonDialog = false" plain color="error">
            الغاء
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addTeacherDialog" :width="500">
      <v-card class="pa-10">
        <v-text-field
          v-model="addTeacherForm.teacherName"
          outlined
          label="اسم التدريسي"
        ></v-text-field>
        <v-btn @click="addTeacher()" block color="primary">اضافة</v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    years: [],
    lessons: [],
    selectedLesson: null,
    selectedLessonId: null,
    selectedYear: 0,
    selectedLevel: 0,
    levelTypes: [],
    teachers: [],
    addTeacherForm: {
      teacherName: "",
    },
    saveLessonLoading: false,
    addNewLessonDialog: false,
    addNewLessonForm: {},
    markTypes: [],
    marksHeader: [
      { text: "نوع الدرجة", value: "markTypeName" },
      { text: "الدرجة العظمى", value: "maximumDegree" },
      { text: "الاجراءات", value: "actions" },
    ],
    lessonForm: {
      lessonName: null,
      secondLessonName: null,
      lessonCredit: 0,
      teacherId: 0,
      thHours: 0,
      prHours: 0,
    },
    addTeacherDialog: false,
  }),
  created: function () {
    this.fetch();
    this.resetForms();
  },
  methods: {
    fetch() {
      let loading = this.$loading.show();
      this.$http
        .get(
          `lessons?sectionId=${this.userInfo.sectionId}&level=1&yearStudyId=${this.userInfo.yearStudyId}&order=lessonCredit&sort=DESC`
        )
        .then((res) => {
          this.lessons = res.data;
        })
        .finally(() => loading.hide());
      this.$http.get("yearStudies").then((res) => {
        this.years = res.data;
        this.selectedYear = this.userInfo.yearStudyId;
      });
      this.$http
        .get(
          `sectionLevelTypes/${this.userInfo.sectionId}?year=${this.userInfo.yearStudyId}`
        )
        .then((res) => {
          this.levelTypes = res.data;
        });
      this.$http.get(`markTypes`).then((res) => {
        this.markTypes = res.data;
      });
      this.getTeachers();
    },
    selectYear(id) {
      this.selectedYear = id;
      this.$http
        .get(
          `sectionLevelTypes/${this.userInfo.sectionId}?year=${this.selectedYear}`
        )
        .then((res) => {
          this.levelTypes = res.data;
        });
    },
    selectLevel(id) {
      let loading = this.$loading.show();
      this.$http
        .get(
          `lessons?sectionId=${this.userInfo.sectionId}&level=${id}&yearStudyId=${this.userInfo.yearStudyId}&order=lessonCredit&sort=DESC`
        )
        .then((res) => {
          this.lessons = res.data;
          this.selectedLesson = null;
          this.selectedLevel = id - 1;
          this.addNewLessonForm.lessonLevel = id;
        })
        .finally(() => loading.hide());
      this.$http.get("yearStudies").then((res) => {
        this.years = res.data;
        this.selectedYear = this.userInfo.yearStudyId;
      });
    },
    selectLesson(lesson) {
      var index = this.lessons.findIndex((x) => x.idLesson == lesson.idLesson);
      this.selectedLessonId = this.lessons[index].idLesson;
      this.selectedLesson = index;
      this.lessonForm = {
        lessonName: lesson.lessonName,
        secondLessonName: lesson.secondLessonName,
        lessonCredit: lesson.lessonCredit,
        thHours: lesson.thHours,
        prHours: lesson.prHours,
        teacherId: lesson.teacherId,
      };
    },
    setLevelType(e) {
      let loading = this.$loading.show();

      if (this.getLevelType(this.selectedLevel).length == 0) {
        this.$http
          .post("addLevelType", {
            level: this.selectedLevel + 1,
            sectionId: this.userInfo.sectionId,
            masterSheetStudyTypeId: e,
            studyYearId: this.userInfo.yearStudyId,
            createdBy: this.userInfo.idUser,
          })
          .then(() => {
            this.$toast.open({
              type: "success",
              message: "تم تحديد نظام المرحلة",
              duration: 3000,
            });
            this.$http
              .get(
                `sectionLevelTypes/${this.userInfo.sectionId}?year=${this.selectedYear}`
              )
              .then((res) => {
                this.levelTypes = res.data;
                this.fetch();
              });
          })
          .finally(() => loading.hide());
      } else {
        this.$http
          .put(
            "levelType/" + this.getLevelType(this.selectedLevel)[0].idLevelType,
            {
              masterSheetStudyTypeId: e,
            }
          )
          .then(() => {
            this.$toast.open({
              type: "success",
              message: "تم تحديد نظام المرحلة",
              duration: 3000,
            });
            this.$http
              .get(
                `sectionLevelTypes/${this.userInfo.sectionId}?year=${this.selectedYear}`
              )
              .then((res) => {
                this.levelTypes = res.data;
                this.fetch();
              });
          })
          .finally(() => loading.hide());
      }
    },
    resetForms() {
      this.addNewLessonForm = {
        lessonName: null,
        secondLessonName: null,
        teacherId: 0,
        lessonLevel: this.selectedLevel + 1,
        sectionId: this.userInfo.sectionId,
        lessonCredit: 0,
        yearStudyId: this.userInfo.yearStudyId,
        createdBy: this.userInfo.idUser,
        lessonCourse: 1,
      };
    },
    getLevelType(id) {
      return this.levelTypes.filter((l) => l.level == id + 1);
    },
    addNewLesson() {
      let loading = this.$loading.show();
      this.$http
        .post("addLesson", this.addNewLessonForm)
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم اضافة المادة",
            duration: 3000,
          });
          this.fetch();
          this.resetForms();
          this.selectedLesson = null;
          this.addNewLessonDialog = false;
          this.selectLevel(this.selectedLevel + 1);
        })
        .finally(() => loading.hide());
    },
    addNewMark(id) {
      if (
        this.lessons[this.selectedLesson].marks.filter(
          (e) => e.markTypeId == id
        ).length > 0
      ) {
        this.$toast.open({
          type: "error",
          message: "هذه الدرجة موجودة بالفعل في هذه المادة",
          duration: 3000,
        });
        return;
      }
      let loading = this.$loading.show();
      this.$http
        .post("addLessonMark", {
          lessonId: this.lessons[this.selectedLesson].idLesson,
          markTypeId: id,
          maximumDegree: 0,
          createdBy: this.userInfo.idUser,
        })
        .then((res) => {
          this.lessons[this.selectedLesson].marks.push({
            ...res.data,
            markTypeName: this.markTypes.filter((x) => x.idMarkType == id)[0]
              .markTypeName,
          });
        })
        .finally(() => loading.hide());
    },
    deleteMark(id, index) {
      let loading = this.$loading.show();
      this.$http
        .delete("lessonMark/" + id)
        .then(() => {
          this.lessons[this.selectedLesson].marks.splice(index, 1);
        })
        .finally(() => loading.hide());
    },
    getLessonTotalDegree(lesson) {
      let total = 0;
      for (let i = 0; i < lesson.length; i++) {
        if (lesson[i].markTypeId == 1 || lesson[i].markTypeId == 3) {
          total = total + lesson[i].maximumDegree + lesson[i].maximumDegree;
        } else {
          total = total + lesson[i].maximumDegree;
        }
      }
      return total;
    },
    saveLesson() {
      this.saveLessonLoading = true;
      this.$http
        .put("lesson/" + this.lessons[this.selectedLesson].idLesson, {
          lessonName: this.lessonForm.lessonName,
          secondLessonName: this.lessonForm.secondLessonName,
          lessonCredit: this.lessonForm.lessonCredit,
          thHours: this.lessonForm.thHours,
          prHours: this.lessonForm.prHours,
          teacherId: this.lessonForm.teacherId,
        })
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم تعديل معلومات المادة",
            duration: 3000,
          });
          this.fetch();
        })
        .finally(() => (this.saveLessonLoading = false));
    },
    updateDegree(e, lessonMarkId) {
      let loading = this.$loading.show();
      this.$http
        .put("lessonMark/" + lessonMarkId, {
          maximumDegree: e,
        })
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم تعديل معلومات المادة",
            duration: 3000,
          });
        })
        .finally(() => loading.hide());
    },
    deleteLesson() {
      let c = confirm("Are you sure you want to delete this lesson?");
      if (c) {
        let loading = this.$loading.show();
        this.$http
          .delete("lesson/" + this.selectedLessonId)
          .then(() => {
            this.$toast.open({
              type: "success",
              message: "تم حذف المادة",
              duration: 3000,
            });
            this.selectedLesson = null;
            this.selectedLessonId = null;
            this.fetch();
          })
          .finally(() => loading.hide());
      }
    },
    addTeacher() {
      if (this.addTeacherForm.teacherName == "") {
        this.$toast.open({
          type: "error",
          message: "يرجى كتابة اسم التدريسي",
          duration: 3000,
        });
        return;
      }
      let loading = this.$loading.show();
      this.$http
        .post("addTeacher", {
          teacherName: this.addTeacherForm.teacherName,
          sectionId: this.userInfo.sectionId,
        })
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم اضافة التدريسي , يمكنك الان اختياره من القائمة",
            duration: 3000,
          });
          this.addTeacherForm.teacherName = "";
          this.addTeacherDialog = false;
          this.getTeachers();
        })
        .finally(() => loading.hide());
    },
    getTeachers() {
      this.$http.get("teachers").then((res) => (this.teachers = res.data));
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