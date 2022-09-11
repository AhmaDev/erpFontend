<template>
  <div class="pa-10" v-if="mastersheet != null" id="editMastersheet">
    <v-app-bar app>
      <v-toolbar-title>تعديل الدرجات</v-toolbar-title>
      <v-spacer></v-spacer>
      عدد الطلاب : {{ mastersheet.students.length }}
      <v-spacer></v-spacer>
      <v-autocomplete
        outlined
        dense
        hide-details
        prefix="المادة"
        :items="mastersheet.lessons"
        item-text="lessonName"
        item-value="idLesson"
        @change="setQuery()"
        v-model="selectedLesson"
      ></v-autocomplete>
      <v-spacer></v-spacer>
      <v-btn
        @click="
          noticeModal = true;
          forceRerender++;
        "
        color="primary"
      >
        <span>الملاحظات</span>
      </v-btn>
      &nbsp; &nbsp;
      <v-btn @click="addStudentsModal = true" color="success">
        <span>اضافة طلاب</span>
      </v-btn>
      <v-btn @click="fetchDiscount()" color="primary">
        <span>تخفيض</span>
      </v-btn>
    </v-app-bar>

    <v-card>
      <v-card-text>
        <v-simple-table height="78vh" fixed-header>
          <thead>
            <tr>
              <th width="20">#</th>
              <th width="300">اسم الطالب والرقم الاحصائي</th>
              <th width="50">السعي</th>
              <!--  <th width="50" v-if="!checkField(1)">
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
              </th> -->
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
              <th width="50" v-if="!checkField(11)">
                <v-badge inline :content="100">قرار د1</v-badge>
              </th>
              <th width="50" v-if="!checkField(12)">
                <v-badge inline :content="100">قرار د2 او تخفيض</v-badge>
              </th>
              <th width="100px">الاجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(student, index) in mastersheet.students"
              :key="student.idStudent"
            >
              <td>{{ index + 1 }}</td>
              <td>
                {{ student.studentName }}
                <br />
                <span v-if="!student.notice.includes('#')">{{
                  student.studentCollegeNumber
                }}</span>
                <v-chip
                  v-if="student.notice.includes('#')"
                  small
                  color="error"
                  dark
                >
                  محجوب
                </v-chip>
              </td>
              <td>
                {{ getStundetDegree(student, selectedLesson, "notFinal") }}
              </td>
              <!--   <td data-marktype="marktype" v-if="!checkField(1)">
                <v-text-field
                  @contextmenu="
                    showDegreeMenuFunc($event, student.studentId, 1)
                  "
                  tabindex="1"
                  outlined
                  dense
                  hide-details
                  type="text"
                  ref="a"
                  :rules="[rules.number]"
                  @keyup="focusing(index, $event, 'a')"
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
                  type="text"
                  ref="b"
                  :rules="[rules.number]"
                  @keyup="focusing(index, $event, 'b')"
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
                  type="text"
                  ref="c"
                  :rules="[rules.number]"
                  @keyup="focusing(index, $event, 'c')"
                  :prefix="getMarkStatus(getMark(student, 3).markStatusId)"
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
                  type="text"
                  ref="d"
                  :rules="[rules.number]"
                  @keyup="focusing(index, $event, 'd')"
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
                  type="text"
                  ref="e"
                  :rules="[rules.number]"
                  @keyup="focusing(index, $event, 'e')"
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
                  type="text"
                  ref="f"
                  :rules="[rules.number]"
                  @keyup="focusing(index, $event, 'f')"
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
              </td> -->
              <td v-if="!checkField(5)">
                <v-text-field
                  tabindex="5"
                  outlined
                  dense
                  hide-details
                  @contextmenu="
                    showDegreeMenuFunc($event, student.studentId, 5)
                  "
                  type="text"
                  ref="g"
                  :rules="[rules.number]"
                  @keyup="focusing(index, $event, 'g')"
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
                <v-row>
                  <v-col>
                    <v-text-field
                      tabindex="6"
                      outlined
                      dense
                      hide-details
                      @contextmenu="
                        showDegreeMenuFunc($event, student.studentId, 6)
                      "
                      type="text"
                      ref="h"
                      :rules="[rules.number]"
                      @keyup="focusing(index, $event, 'h')"
                      :prefix="getMarkStatus(getMark(student, 6).markStatusId)"
                      :max="getLessonMaximumDegree(6)"
                      :min="0"
                      @change="updateDegree($event, student.studentId, 6)"
                      :class="{
                        'error white--text':
                          getMark(student, 6).markStatusId == 2,
                        'warning black--text':
                          getMark(student, 6).markStatusId == 3,
                      }"
                      :value="
                        getMark(student, 6).markStatusId == 1
                          ? getMark(student, 6).degree
                          : null
                      "
                    ></v-text-field>
                  </v-col>
                  <v-col v-if="getMark(student, 6).degree == 0">
                    <v-btn
                      @click="
                        deleteMark(
                          getMark(student, 6).idMasterSheetMarks,
                          student,
                          selectedLesson,
                          6
                        )
                      "
                      color="error"
                    >
                      <span>حذف الدرجة</span>
                    </v-btn>
                  </v-col>
                </v-row>
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
                  type="text"
                  ref="i"
                  :rules="[rules.number]"
                  @keyup="focusing(index, $event, 'i')"
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
                <v-row>
                  <v-col>
                    <v-text-field
                      tabindex="8"
                      outlined
                      dense
                      hide-details
                      @contextmenu="
                        showDegreeMenuFunc($event, student.studentId, 8)
                      "
                      type="text"
                      ref="j"
                      :rules="[rules.number]"
                      @keyup="focusing(index, $event, 'j')"
                      :prefix="getMarkStatus(getMark(student, 8).markStatusId)"
                      :max="getLessonMaximumDegree(8)"
                      :min="0"
                      @change="updateDegree($event, student.studentId, 8)"
                      :class="{
                        'error white--text':
                          getMark(student, 8).markStatusId == 2,
                        'warning black--text':
                          getMark(student, 8).markStatusId == 3,
                      }"
                      :value="
                        getMark(student, 8).markStatusId == 1
                          ? getMark(student, 8).degree
                          : null
                      "
                    ></v-text-field>
                  </v-col>
                  <v-col v-if="getMark(student, 8).degree == 0">
                    <v-btn
                      @click="
                        deleteMark(
                          getMark(student, 8).idMasterSheetMarks,
                          student,
                          selectedLesson,
                          8
                        )
                      "
                      color="error"
                    >
                      <span>حذف الدرجة</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </td>

              <td v-if="!checkField(11)">
                <v-row>
                  <v-col>
                    <v-text-field
                      tabindex="11"
                      outlined
                      dense
                      hide-details
                      @contextmenu="
                        showDegreeMenuFunc($event, student.studentId, 11)
                      "
                      type="text"
                      ref="k"
                      :rules="[rules.number]"
                      @keyup="focusing(index, $event, 'k')"
                      :prefix="getMarkStatus(getMark(student, 11).markStatusId)"
                      :max="getLessonMaximumDegree(11)"
                      :min="0"
                      @change="updateDegree($event, student.studentId, 11)"
                      :class="{
                        'error white--text':
                          getMark(student, 11).markStatusId == 2,
                        'warning black--text':
                          getMark(student, 11).markStatusId == 3,
                      }"
                      :value="
                        getMark(student, 11).markStatusId == 1
                          ? getMark(student, 11).degree
                          : null
                      "
                    ></v-text-field>
                  </v-col>
                  <v-col v-if="getMark(student, 11).degree == 0">
                    <v-btn
                      @click="
                        deleteMark(
                          getMark(student, 11).idMasterSheetMarks,
                          student,
                          selectedLesson,
                          11
                        )
                      "
                      color="error"
                    >
                      <span>حذف الدرجة</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </td>
              <td v-if="!checkField(12)">
                <v-row>
                  <v-col>
                    <v-text-field
                      tabindex="12"
                      outlined
                      dense
                      hide-details
                      @contextmenu="
                        showDegreeMenuFunc($event, student.studentId, 12)
                      "
                      type="text"
                      ref="k"
                      :rules="[rules.number]"
                      @keyup="focusing(index, $event, 'k')"
                      :prefix="getMarkStatus(getMark(student, 12).markStatusId)"
                      :max="getLessonMaximumDegree(12)"
                      :min="0"
                      @change="updateDegree($event, student.studentId, 12)"
                      :class="{
                        'error white--text':
                          getMark(student, 12).markStatusId == 2,
                        'warning black--text':
                          getMark(student, 12).markStatusId == 3,
                      }"
                      :value="
                        getMark(student, 12).markStatusId == 1
                          ? getMark(student, 12).degree
                          : null
                      "
                    ></v-text-field>
                  </v-col>
                  <v-col v-if="getMark(student, 12).degree == 0">
                    <v-btn
                      @click="
                        deleteMark(
                          getMark(student, 12).idMasterSheetMarks,
                          student,
                          selectedLesson,
                          12
                        )
                      "
                      color="error"
                    >
                      <span>حذف الدرجة</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </td>
              <td>
                <v-tooltip
                  transition="scroll-y-reverse-transition"
                  top
                  color="error"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="deleteStudent(student)"
                      color="error"
                      icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>la-trash</v-icon>
                    </v-btn>
                  </template>
                  <span>ازالة الطالب من الماستر شيت</span>
                </v-tooltip>
                <v-tooltip
                  transition="scroll-y-reverse-transition"
                  top
                  color="black"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      @click="
                        noticeField = student.notice;
                        addNoticeSelectedStudent = student;
                        addNoticeModal = true;
                      "
                      color="orange"
                      icon
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>la-warning</v-icon>
                    </v-btn>
                  </template>
                  <span>اضافة اوامر ادارية للطالب</span>
                </v-tooltip>
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
            dark
            :color="
              status.idMarkStatus == 1
                ? 'green'
                : status.idMarkStatus == 2
                ? 'red'
                : status.idMarkStatus == 3
                ? 'warning'
                : 'dark'
            "
            v-for="status in markStatus.filter((e) => e.idMarkStatus != 4)"
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
                  <v-text-field
                    outlined
                    label="اسم الطالب"
                    dense
                    hide-details
                    @keypress.enter="searchStudent($event)"
                    suffix="اضغط Enter للبحث"
                  ></v-text-field>
                </v-col>
              </v-row>
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
                <v-col>
                  <v-autocomplete
                    outlined
                    dense
                    label="الدراسة"
                    v-model="search.studyType"
                    @change="searchStudents()"
                    item-text="text"
                    item-value="value"
                    :items="$store.state.masterStudyType"
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
    <v-dialog v-model="addNoticeModal" width="500">
      <v-card>
        <v-card-title>اضافة اوامر ادارية</v-card-title>
        <br />
        <v-card-text>
          <v-checkbox
            v-model="blockStudent"
            :value="0"
            label="حجب الطالب"
          ></v-checkbox>
          <v-textarea
            v-model="noticeField"
            outlined
            :prepend-icon="blockStudent ? 'la-hashtag' : ''"
            placeholder="نص الامر الاداري"
          ></v-textarea>
          <v-btn block color="success" @click="addNotice()">حفظ</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="noticeModal" width="500">
      <v-card>
        <v-card-title>ملاحظات الماستر شيت</v-card-title>
        <br />
        <v-card-text :key="forceRerender">
          <v-textarea
            outlined
            v-model="mastersheet.masterSheetNotice"
            placeholder="الملاحظات"
          ></v-textarea>
          <v-btn block color="success" @click="addMasterSheetNotice()"
            >حفظ</v-btn
          >
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
    selectedStudent: 0,
    selectedMarkType: 0,
    levelType: 1,
    blockStudent: 0,
    noticeField: "",
    forceRerender: 0,
    addNoticeSelectedStudent: null,
    showDegreeMenu: false,
    markStatus: [],
    addStudentsModal: false,
    addNoticeModal: false,
    noticeModal: false,
    addedStudents: [],
    search: {
      class: null,
      level: null,
      selectedStudents: [],
      status: 1,
      studyType: 1,
      students: [],
      header: [
        { text: "اسم الطالب", value: "studentName" },
        { text: "الرقم الاحصائي", value: "collegeNumber" },
        { text: "الاجراءات", value: "actions" },
      ],
    },
    rules: {
      number: (v) => {
        if (!isNaN(parseFloat(v)) && v >= 0 && v <= 100) return true;
        return "فقط الارقام مسموحة";
      },
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
        this.mastersheet.students = this.mastersheet.students.sort((a, b) =>
          a.studentName.localeCompare(b.studentName)
        );
        if (this.$route.query.lesson) {
          this.selectedLesson = parseInt(this.$route.query.lesson);
        } else {
          this.selectedLesson = this.mastersheet.lessons[0].idLesson;
        }
        this.search.level = this.mastersheet.studyLevel;
        this.search.class = this.mastersheet.studyClass;
        this.forceRerender++;
        this.searchStudents();
        this.$http
          .get(
            `sectionLevelTypes/${this.mastersheet.sectionId}?year=${this.mastersheet.studyYearId}&level=${this.mastersheet.studyLevel}`
          )
          .then((secondRes) => {
            if (secondRes.data.length > 0) {
              this.levelType = secondRes.data[0].masterSheetStudyTypeId;
            }
            this.$toast.open({
              type: "info",
              message: "يمكنك استخدام الاسهم للتنقل بين الحقول بسهولة",
              duration: 5000,
              position: "bottom",
            });
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
      if (markType == 11 || markType == 12) {
        return false;
      }
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
          location.reload();
        });
    },
    updateDegree(e, studentId, markType) {
      var checkType = markType;
      if (markType == 6) {
        checkType = 5;
      }
      if (markType == 8) {
        checkType = 7;
      }
      let lessonInfo = this.mastersheet.lessons.filter(
        (x) => x.idLesson == this.selectedLesson
      );
      if (lessonInfo.length > 0) {
        let student = this.mastersheet.students.filter(
          (e) => e.studentId == studentId
        )[0];
        if (this.getMark(student, 1).markStatusId == 1) {
          let maximumDegree = 0;
          if (markType == 11 || markType == 12) {
            maximumDegree = 100;
          } else {
            maximumDegree = lessonInfo[0].marks.filter(
              (x) => x.markTypeId == checkType
            )[0].maximumDegree;
          }
          if (e > maximumDegree) {
            this.$toast.open({
              type: "error",
              message: "الدرجة غير صحيحة",
              duration: 3000,
            });
            return;
          }
        } else {
          if (e > 100) {
            this.$toast.open({
              type: "error",
              message: "الدرجة غير صحيحة",
              duration: 3000,
            });
            return;
          }
        }
      }

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
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم تحديث الدرجة",
            duration: 3000,
          });
          this.updateMarksArray(studentId, this.selectedLesson, markType, 1);
        });
    },
    updateMarksArray(
      studentId,
      lessonId,
      masterSheetMarkTypeId,
      markStatusId,
      isDelete = false
    ) {
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

        if (isDelete) {
          this.mastersheet.students[studentIndex].marks.splice(markIndex, 1);
        }
      }
    },
    searchStudents() {
      this.$http
        .get(
          `students?sectionId=${this.userInfo.sectionId}&level=${this.search.level}&class=${this.search.class}&status=${this.search.status}&studyType=${this.search.studyType}`
        )
        .then((res) => {
          this.search.students = res.data;
        });
    },
    searchStudent(e) {
      this.$http
        .get(
          `students?sectionId=${this.userInfo.sectionId}&studentName=${e.target.value}`
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
    focusing(i, e, ref) {
      if (e.key == "ArrowDown") {
        if (this.$refs[ref][i + 1] != null) this.$refs[ref][i + 1].focus();
      }
      if (e.key == "ArrowUp") {
        if (this.$refs[ref][i - 1] != null) this.$refs[ref][i - 1].focus();
      }
      if (e.key == "ArrowLeft") {
        let keys = Object.keys(this.$refs);
        let refIndex = keys.indexOf(ref);
        for (let j = refIndex + 1; j < keys.length; j++) {
          if (this.$refs[keys[j]].length > 0) {
            this.$refs[keys[j]][i].focus();
            break;
          }
        }
      }
      if (e.key == "ArrowRight") {
        let keys = Object.keys(this.$refs);
        let refIndex = keys.indexOf(ref);
        for (let j = refIndex - 1; j >= 0; j--) {
          if (this.$refs[keys[j]].length > 0) {
            this.$refs[keys[j]][i].focus();
            break;
          }
        }
      }
    },
    deleteStudent(student) {
      let c = confirm(
        "Are you sure you want to remove this student from mastersheet?"
      );
      if (c) {
        let loading = this.$loading.show();
        this.$http
          .delete("masterSheetStudent/" + student.idMasterSheetStudent)
          .then(() => {
            this.$toast.open({
              type: "warning",
              message: "تم حذف الطلاب",
              duration: 3000,
            });
            let index = this.mastersheet.students.indexOf(student);
            this.mastersheet.students.splice(index, 1);
          })
          .finally(() => loading.hide());
      }
    },
    addNotice() {
      let student = this.addNoticeSelectedStudent;
      let loading = this.$loading.show();
      if (this.blockStudent == true) {
        this.noticeField = "# " + this.noticeField;
      }
      this.$http
        .put("masterSheetStudent/" + student.idMasterSheetStudent, {
          notice: this.noticeField,
        })
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم تحديث الطلاب",
            duration: 3000,
          });
          let index = this.mastersheet.students.indexOf(student);
          this.mastersheet.students[index].notice = this.noticeField;
          this.addNoticeModal = false;
        })
        .finally(() => loading.hide());
    },
    addMasterSheetNotice() {
      let loading = this.$loading.show();
      this.$http
        .put("masterSheet/" + this.mastersheet.idMasterSheet, {
          masterSheetNotice: this.mastersheet.masterSheetNotice,
        })
        .then(() => {
          this.$toast.open({
            type: "success",
            message: "تم تحديث الماسترشيت",
            duration: 3000,
          });
          this.noticeModal = false;
        })
        .finally(() => loading.hide());
    },
    getStundetDegree(student, lessonId, markName) {
      if (this.hideMarks) {
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
    deleteMark(markId, student, lesson, markTypeId) {
      let loading = this.$loading.show();
      this.$http
        .delete("masterSheetMark/" + markId)
        .then(() => {
          this.$toast.open({
            type: "warning",
            message: "تم حذف الدرجة",
            duration: 3000,
          });
          this.updateMarksArray(student.studentId, lesson, markTypeId, 1, true);
        })
        .finally(() => loading.hide());
    },
    setQuery() {
      this.$router.push({ query: { lesson: this.selectedLesson } });
    },
    fetchDiscount() {
      let loading = this.$loading.show();
      for (let i = 0; i < this.mastersheet.students.length; i++) {
        let student = this.mastersheet.students[i];
        let lessonMarkTry1 = this.getStudentFinalDegree(
          student,
          this.selectedLesson,
          "try1"
        );
        let lessonMarkTry2 = this.getStudentFinalDegree(
          student,
          this.selectedLesson,
          "try2"
        );
        if (lessonMarkTry1 < 50 && lessonMarkTry2 > 50) {
          // ? CAN DISCOUNT
          let mark = 0;
          // * CHECK IF HE IS ALREADY HAVE DISCOUNT
          if (
            !this.checkIfFinalMarkIsCustome(student, this.selectedLesson, 12)
          ) {
            if (lessonMarkTry2 <= 60 && lessonMarkTry2 > 49) {
              mark = 50;
            } else {
              mark = lessonMarkTry2 - 10;
            }
            this.updateDegree(mark, student.studentId, 12);
          } else {
            // ! CAN'T DISCOUNT
          }
        }
      }
      this.$toast.open({
        type: "warning",
        message: "تم تخفيض الطلاب",
        duration: 3000,
      });
      setTimeout(() => {
        location.reload();
      }, 1000);
      loading.hide();
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