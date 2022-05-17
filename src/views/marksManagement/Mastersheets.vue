<template>
  <div id="mastersheets" class="pa-10">
    <v-app-bar app>
      <v-toolbar-title>المستندات</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-autocomplete
        outlined
        dense
        hide-details
        prefix="السنة الدراسية"
        :items="years"
        item-text="year"
        @change="selectYear($event)"
        item-value="idYearStudy"
        v-model="selectedYear"
      ></v-autocomplete>
    </v-app-bar>
    <template v-for="level in $store.state.levels">
      <div :key="'LEVEL_' + level.idLevel">
        <v-alert icon="la-book" dense rounded dark color="primary">
          <v-row>
            <v-col>
              <v-chip dark color="primary">
                {{ level.levelName }}
              </v-chip>
            </v-col>
            <v-col style="text-align: left">
              <v-chip dark color="blue darken-1">
                {{
                  getLevelType(level.idLevel) == 1
                    ? "النظام السنوي"
                    : "النظام الفصلي"
                }}
              </v-chip>
            </v-col>
          </v-row>
        </v-alert>
        <v-row>
          <v-col
            cols="12"
            md="4"
            lg="3"
            v-for="mastersheet in mastersheets.filter(
              (x) => x.studyLevel == level.idLevel
            )"
            :key="'MASTERSHEET_' + mastersheet.idMasterSheet"
          >
            <v-card height="320">
              <div style="float: left; padding: 10px">
                <v-btn
                  @click="deleteMaster(mastersheet.idMasterSheet)"
                  color="error"
                  large
                  icon
                  v-if="userInfo.yearStudyId == mastersheet.studyYearId"
                >
                  <v-icon>la-trash</v-icon>
                </v-btn>
              </div>
              <v-card-title>
                <v-avatar
                  class="white--text"
                  :color="
                    mastersheet.idMasterSheetType == 1 ? 'primary' : 'warning'
                  "
                >
                  {{ mastersheet.studyClass }}
                </v-avatar>
                <v-spacer></v-spacer>
                <h4
                  :class="
                    mastersheet.idMasterSheetType != 1
                      ? 'warning--text'
                      : 'primary--text'
                  "
                >
                  {{ mastersheet.masterSheetTypeName }}
                </h4>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-text>
                <v-list dense>
                  <v-divider></v-divider>

                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>la-graduation-cap</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title> الدراسة </v-list-item-title>
                    <v-list-item-action>
                      {{
                        mastersheet.studyType == "morningStudy"
                          ? "صباحي"
                          : "مسائي"
                      }}
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item v-if="getLevelType(level.idLevel) == 2">
                    <v-list-item-icon>
                      <v-icon>la-info-circle</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title> الفصل </v-list-item-title>
                    <v-list-item-action>
                      {{
                        mastersheet.masterSheetStudyTypeId == 1
                          ? "الاول"
                          : "الثاني"
                      }}
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item
                    v-if="userInfo.yearStudyId == mastersheet.studyYearId"
                    :to="'mastersheet/edit/' + mastersheet.idMasterSheet"
                  >
                    <v-list-item-icon>
                      <v-icon class="primary--text">la-edit</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="primary--text">
                      ادخال درجات
                    </v-list-item-title>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item :to="'mastersheet/' + mastersheet.idMasterSheet">
                    <v-list-item-icon>
                      <v-icon class="success--text">la-print</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="success--text">
                      توليد مستندات
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4" lg="3">
            <v-card
              @click="
                addNewMasterSheetModal = true;
                selectedLevel = level.idLevel;
              "
              class="addNewMasterClass"
              height="320"
            >
              <center>
                <br /><br />
                <br />
                <br />
                <v-icon size="70">la-plus-circle</v-icon>
                <br />
                <br />
                اضافة ماستر جديد في {{ level.levelName }}
              </center>
            </v-card>
          </v-col>
        </v-row>
        <br />
      </div>
    </template>
    <v-dialog v-model="addNewMasterSheetModal" width="600">
      <v-card>
        <v-card-title>اضافة ماسترشيت جديد</v-card-title>
        <br />
        <v-card-text>
          <v-autocomplete
            :items="mastersheetTypes"
            item-text="masterSheetTypeName"
            item-value="idMasterSheetType"
            outlined
            v-model="masterSheetForm.masterSheetTypeId"
            label="نوع الماستر"
          ></v-autocomplete>
          <v-autocomplete
            :items="$store.state.studyTypes"
            item-text="text"
            item-value="value"
            outlined
            v-model="masterSheetForm.studyType"
            label="الدراسة"
          ></v-autocomplete>
          <v-autocomplete
            :items="$store.state.studentClassess"
            outlined
            v-model="masterSheetForm.studyClass"
            label="الشعبة"
          ></v-autocomplete>
          <v-autocomplete
            :items="$store.state.courseTypes"
            outlined
            item-text="courseName"
            item-value="idCourse"
            v-model="masterSheetForm.masterStudyType"
            label="الفصل"
          ></v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="addNewMasterSheet()" block color="primary"
            >اضافة</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    mastersheets: [],
    years: [],
    selectedLevel: 0,
    selectedYear: 0,
    levelTypes: [],
    addNewMasterSheetModal: false,
    mastersheetTypes: [],
    mastersheetStudyTypes: [],
    masterSheetForm: {
      masterSheetTypeId: null,
      studyType: null,
      masterStudyType: null,
      studyClass: null,
    },
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      let loading = this.$loading.show();
      this.$http
        .get(
          `masterSheets?sectionId=${this.userInfo.sectionId}&year=${this.userInfo.yearStudyId}&order=studyClass&sort=ASC`
        )
        .then((res) => {
          this.mastersheets = res.data;
        })
        .finally(() => loading.hide());
      this.$http
        .get(
          `sectionLevelTypes/${this.userInfo.sectionId}?year=${this.userInfo.yearStudyId}`
        )
        .then((secondRes) => {
          this.levelTypes = secondRes.data;
          console.log("levelTypes", this.levelTypes);
        });
      this.$http.get("yearStudies").then((res) => {
        this.years = res.data;
        this.selectedYear = this.userInfo.yearStudyId;
      });

      this.$http.get("masterSheetTypes").then((res) => {
        this.mastersheetTypes = res.data;
      });
    },
    addNewMasterSheet() {
      let loading = this.$loading.show();
      this.$http
        .post("addMasterSheet", {
          sectionId: this.userInfo.sectionId,
          studyLevel: this.selectedLevel,
          studyClass: this.masterSheetForm.studyClass,
          studyYearId: this.selectedYear,
          studyType: this.masterSheetForm.studyType,
          masterSheetTypeId: this.masterSheetForm.masterSheetTypeId,
          masterSheetStudyTypeId: this.masterSheetForm.masterStudyType,
          masterSheetNotice: "",
          createdBy: this.userInfo.idUser,
        })
        .then(() => this.fetch())
        .finally(() => {
          loading.hide();
          this.addNewMasterSheetModal = false;
        });
    },
    deleteMaster(id) {
      let c = confirm("Are you sure you want to delete Mastersheet?");
      if (c) {
        let loading = this.$loading.show();
        this.$http
          .delete("masterSheet/" + id)
          .then(() => {
            this.$toast.open({
              type: "warning",
              message: "تم حذف الماسترشيت",
              duration: 3000,
            });
            this.fetch();
          })
          .finally(() => loading.hide());
      }
    },
    getLevelType(level) {
      let leveltype = this.levelTypes.filter((x) => x.level == level);
      if (leveltype.length > 0) {
        return leveltype[0].masterSheetStudyTypeId;
      } else {
        return 1;
      }
    },
    selectYear(e) {
      let loading = this.$loading.show();
      this.$http
        .get(
          `masterSheets?sectionId=${this.userInfo.sectionId}&year=${e}&order=studyClass&sort=ASC`
        )
        .then((res) => {
          this.mastersheets = res.data;
        })
        .finally(() => loading.hide());
      this.$http
        .get(`sectionLevelTypes/${this.userInfo.sectionId}?year=${e}`)
        .then((secondRes) => {
          this.levelTypes = secondRes.data;
          console.log("levelTypes", this.levelTypes);
        });
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
.addNewMasterClass {
  opacity: 0.4;
}
.addNewMasterClass:hover {
  opacity: 1;
}
</style>