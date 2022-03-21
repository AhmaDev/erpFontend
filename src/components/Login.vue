<template>
  <div id="loginPage">
    <center>
      <div class="loginCard">
        <Logo width="130px" />
        <br />
        <h2>كلية دجلة الجامعة</h2>
        <br />
        <br />
        <v-text-field
          label="اسم المستخدم"
          outlined
          dense
          @keypress.enter="login()"
          v-model="loginInfo.username"
        ></v-text-field>
        <v-text-field
          label="كلمة المرور"
          outlined
          dense
          @keypress.enter="login()"
          type="password"
          v-model="loginInfo.password"
        ></v-text-field>
        <v-btn @click="login()" block :color="$background" dark> دخول </v-btn>
        <br /><br />
        <small>{{ $appVersion }}</small>
      </div>
    </center>
  </div>
</template>

<script>
import Logo from "./Logo.vue";
import jwt_decode from "jwt-decode";

export default {
  name: "login",
  components: {
    Logo,
  },
  data: () => ({
    loginInfo: {
      username: null,
      password: null,
    },
  }),
  methods: {
    login() {
      let loading = this.$loading.show();
      this.$http
        .post("login", {
          userName: this.loginInfo.username,
          password: this.loginInfo.password,
        })
        .then((res) => {
          var token = res.data.token;
          var decoded = jwt_decode(token);
          localStorage.setItem("token", token);
          localStorage.setItem("userinfo", JSON.stringify(decoded));
          this.$store.commit("setLoginInfo", decoded);
        })
        .catch((err) => {
          console.log(err);
          this.$toast.open({
            type: "error",
            message: "المعلومات التي ادخلتها غير صحيحة",
            duration: 3000,
          });
        })
        .finally(() => {
          loading.hide();
        });
    },
  },
};
</script>

<style>
.loginCard {
  margin-top: 20vh;
  width: 95%;
  max-width: 400px;
}
</style>