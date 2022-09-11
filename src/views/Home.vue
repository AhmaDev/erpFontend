<template>
  <div class="pa-10" id="homePage">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col>
                <h3>
                  <v-icon right>la-user-circle</v-icon> اهلاً بك يا ,
                  <b>{{ userInfo.userName }}</b>
                </h3>
              </v-col>
              <v-col style="text-align: left">
                <h3>
                  قسم
                  <b>{{ userInfo.sectionName }}</b>
                </h3>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-5">
          <v-card-text>
            <v-row align="center">
              <v-col>
                <center>
                  <v-avatar size="100" color="primary">
                    <v-icon color="white" style="font-size: 72px"
                      >la-user</v-icon
                    >
                  </v-avatar>
                </center>
              </v-col>
              <v-col>
                <center>
                  <h2>عدد الطلاب</h2>
                  <br />
                  <h1 style="font-size: 50px">{{ totalStudents }}</h1>
                  <v-progress-circular
                    v-if="!totalStudents"
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </center>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-5">
          <v-card-text>
            <v-row align="center">
              <v-col>
                <center>
                  <v-avatar size="100" color="warning">
                    <v-icon color="white" style="font-size: 72px"
                      >la-book</v-icon
                    >
                  </v-avatar>
                </center>
              </v-col>
              <v-col>
                <center>
                  <h2>عدد المستندات</h2>
                  <br />
                  <h1 style="font-size: 50px">{{ totalMasterSheets }}</h1>
                  <v-progress-circular
                    v-if="!totalMasterSheets"
                    indeterminate
                    color="warning"
                  ></v-progress-circular>
                </center>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-5">
          <v-card-text>
            <v-row align="center">
              <v-col>
                <center>
                  <v-avatar size="100" color="success">
                    <v-icon color="white" style="font-size: 72px"
                      >la-calendar</v-icon
                    >
                  </v-avatar>
                </center>
              </v-col>
              <v-col>
                <center>
                  <h2>السنة الدراسية</h2>
                  <br />
                  <h1 style="font-size: 30px">{{ userInfo.currentYear }}</h1>
                </center>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Home",

  components: {},
  data: () => ({
    totalStudents: null,
    totalMasterSheets: null,
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$http
        .get(
          `masterSheets?sectionId=${this.userInfo.sectionId}&year=${this.userInfo.yearStudyId}`
        )
        .then((res) => {
          setTimeout(() => {
            this.totalMasterSheets = res.data.length;
          }, 2000);
        });
      this.$http
        .get(`students?sectionId=${this.userInfo.sectionId}&status=1`)
        .then((res) => {
          setTimeout(() => {
            this.totalStudents = res.data.length;
          }, 2000);
        });
    },
    sendEmail() {
      for (let i = 200; i < 800; i++) {
        setTimeout(() => {
          this.$axios.get("http://localhost:5012/generate/" + i);
          console.log(i);
        }, 2000 * i);
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
