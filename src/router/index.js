import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/lessons",
    name: "Lessons",
    component: () => import("../views/marksManagement/Lessons.vue"),
  },
  {
    path: "/students",
    name: "students",
    component: () => import("../views/marksManagement/Students.vue"),
  },
  {
    path: "/mastersheets",
    name: "Mastersheets",
    component: () => import("../views/marksManagement/Mastersheets.vue"),
  },
  {
    path: "/mastersheet/:id",
    name: "ViewMastersheets",
    component: () => import("../views/marksManagement/ViewMastersheet.vue"),
  },
  {
    path: "/mastersheet/edit/:id",
    name: "EditMastersheets",
    component: () => import("../views/marksManagement/EditMastersheet.vue"),
  },
  {
    path: "/finalMarks/:id",
    name: "EditMastersheets",
    component: () =>
      import("../views/marksManagement/mastersheet/FinalMarks.vue"),
  },
  {
    path: "/finalMarksSecondTry/:id",
    name: "EditMastersheets",
    component: () =>
      import("../views/marksManagement/mastersheet/FinalMarksSecondTry.vue"),
  },
  {
    path: "/minisheet/:id",
    name: "Minisheet",
    component: () =>
      import("../views/marksManagement/mastersheet/Minisheet.vue"),
  },
  {
    path: "/notFinalMarks/:id",
    name: "notFinalMarks",
    component: () =>
      import("../views/marksManagement/mastersheet/NotFinalMarks.vue"),
  },
  {
    path: "/reports/:id",
    name: "EditMastersheets",
    component: () => import("../views/marksManagement/mastersheet/Report.vue"),
  },
  {
    path: "/ordering/:id",
    name: "EditMastersheets",
    component: () =>
      import("../views/marksManagement/mastersheet/Ordering.vue"),
  },
  {
    path: "/orderingSecondTry/:id",
    name: "EditMastersheets",
    component: () =>
      import("../views/marksManagement/mastersheet/OrderingSecondTry.vue"),
  },
  {
    path: "/reportsSecondTry/:id",
    name: "EditMastersheets",
    component: () =>
      import("../views/marksManagement/mastersheet/ReportSecondTry.vue"),
  },
  {
    path: "/chat",
    name: "GroupChat",
    component: () => import("../views/chat/groupChat.vue"),
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
