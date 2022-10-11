<template>
  <v-app style="background-color: var(--v-appBackground-base)">
    <v-navigation-drawer
      class="elevation-12"
      v-if="isLoggedIn"
      v-model="drawer"
      app
      mini-variant
      mini-variant-width="72"
      right
      color="background"
      permanent
    >
      <v-list-item class="py-2">
        <Logo :width="36" />
      </v-list-item>
      <v-divider></v-divider>
      <v-list rounded>
        <v-tooltip
          transition="scroll-x-transition"
          color="primary"
          v-for="item in items"
          :key="item.title"
          left
        >
          <template v-slot:activator="{ on, attrs }">
            <v-list-item
              :to="item.route"
              v-bind="attrs"
              v-on="on"
              link
              color="primary"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>
                  <b>{{ item.title }}</b>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <span>{{ item.title }}</span>
        </v-tooltip>
      </v-list>
      <v-divider></v-divider>

      <template v-slot:append>
        <v-list rounded>
          <v-list-item color="primary" @click="darkMode()">
            <v-list-item-icon>
              <v-icon v-if="$vuetify.theme.dark">las la-sun</v-icon>
              <v-icon v-if="!$vuetify.theme.dark">las la-moon</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ $vuetify.theme.dark ? "Light mode" : "Dark mode" }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logout()">
            <v-list-item-icon>
              <v-icon>la-power-off</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> v{{ $appVersion }} </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>la-info-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> v{{ $appVersion }} </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <br />
      </template>
    </v-navigation-drawer>

    <div class="mainContent">
      <v-main>
        <v-container class="pa-0 mainContent" fluid>
          <vue-page-transition name="fade">
            <Login v-if="!isLoggedIn" />
            <router-view v-else />
          </vue-page-transition>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script>
import Login from "./components/Login.vue";
import Logo from "./components/Logo.vue";
export default {
  name: "App",
  components: {
    Login,
    Logo,
  },
  data: () => ({
    drawer: true,
    showToolTips: false,
    items: [
      { title: "الرئيسية", icon: "las la-home", route: "/" },
      {
        title: "الطلاب",
        icon: "la-user-circle",
        route: "/students",
      },
      {
        title: "المواد الدراسية",
        icon: "la-book",
        route: "/lessons",
      },
      {
        title: "الدرجات",
        icon: "la-award",
        route: "/mastersheets",
      },
      {
        title: "الجدول الدراسي",
        icon: "la-calendar-day",
        route: "/schedules",
      },
      // {
      //   title: "المحادثات",
      //   icon: "la-comments",
      //   route: "/chat",
      // },
    ],
  }),
  methods: {
    logout() {
      localStorage.clear();
      location.reload();
    },
    darkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("darkMode", this.$vuetify.theme.dark);
    },
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userInfo() {
      return this.$store.getters.getLoginInfo;
    },
    currentYear() {
      return this.$store.getters.getCurrentYear;
    },
    mySection() {
      return this.$store.getters.getMySection;
    },
  },
  created: function () {
    let isDarkMode = true;
    if (localStorage.getItem("darkMode") == "false") {
      isDarkMode = false;
    }
    this.$vuetify.theme.dark = isDarkMode;
  },
};
</script>

<style src="./style.css"></style>