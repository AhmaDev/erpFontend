import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    isLoggedIn: false,
    loginInfo: null,
    currentYear: null,
    mySection: null,
    studentClassess: [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
    ],
    levels: [
      { idLevel: 1, levelName: 'المرحلة الاولى' },
      { idLevel: 2, levelName: 'المرحلة الثانية' },
      { idLevel: 3, levelName: 'المرحلة الثالثة' },
      { idLevel: 4, levelName: 'المرحلة الرابعة' },
      { idLevel: 5, levelName: 'المرحلة الخامسة' }
    ],
    courseTypes: [
      {idCourse: 1 , courseName: 'الفصل الاول'},
      {idCourse: 2 , courseName: 'الفصل الثاني'},
    ],
    documentTypes: [
      {idDocument: 1 , documentName: 'ماستر شيت'},
      {idDocument: 2 , documentName: 'ميني شيت'},
      {idDocument: 3 , documentName: 'ميني شيت'},
      {idDocument: 4 , documentName: 'ميني شيت'},
      {idDocument: 2 , documentName: 'ميني شيت'},
    ],
    studyTypes: [
      {text: "صباحي", value: "morningStudy"},
      {text: "مسائي", value: "eveningStudy"},
    ],
    masterStudyTypes: [
      {text: "سنوي", value: 1},
      {text: "فصلي", value: 2},
    ],
    studentStatus: [
      {text: "مستمر", value: 1},
      {text: "خروج بأمر اداري", value: 5},
    ],
  },
  mutations: {
    setLoginInfo: function (state, payload) {
      state.loginInfo = payload;
      state.isLoggedIn = true;
    },
    setCurrentYear: function (state, payload) {
      state.currentYear = payload;
    },
    setMySection: function (state, payload) {
      state.mySection = payload;
    },
  },
  actions: {
  },
  modules: {
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    getLoginInfo: state => state.loginInfo,
    getMySection: state => state.mySection,
    getCurrentYear: state => state.currentYear,
  }
})
