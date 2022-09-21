<template>
  <div id="groupChatPage">
    <v-app-bar app>
      <v-toolbar-title>الشعب الدراسية</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="connect()">CONNECT</v-btn>
    </v-app-bar>
    <div id="messages">
      <TextBubble
        v-for="(message, index) in messages"
        :key="index"
        :message="message"
        :isLoading="message.isLoading"
        :isMe="message.isMe"
      ></TextBubble>
    </div>
    <v-bottom-navigation
      height="80px"
      style="padding: 0px 100px 0px 30px"
      fixed
    >
      <v-btn v-if="isConnected" @click="send()">
        <v-icon>la-send</v-icon>
      </v-btn>
      <v-row style="padding: 10px 0px">
        <v-col>
          <v-text-field
            placeholder="اكتب رسالتك هنا"
            hide-details
            outlined
            :disabled="!isConnected"
            rounded
            @keypress.enter="send()"
            v-model="messageField"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-bottom-navigation>
  </div>
</template>

<script>
import TextBubble from "../../components/chat/text.bubble.vue";

export default {
  name: "GroupChat",
  components: {
    TextBubble,
  },
  sockets: {
    chat: {
      connect: function () {
        console.log("socket connected");
      },
      recieveMessage: (data) => {
        this.messages.push(data);
      },
    },
  },

  data: () => ({
    room: {
      sectionId: 31,
      level: 1,
      class: "A",
    },
    messageField: "",
    messages: [],
    isConnected: false,
  }),
  methods: {
    connect() {
      this.$socket.chat.io.opts.query = { sectionId: 31, level: 1, class: "A" };
      this.$socket.chat.connect();
      this.isConnected = this.$socket.chat.connected;
    },
    send() {
      if (this.messageField == "") {
        this.$toast.open({
          type: "warning",
          message: "يرجى كتابة الرسالة",
          duration: 3000,
          position: "top",
        });
        return;
      }
      let message = {
        text: this.messageField,
        username: this.userInfo.userName,
        isLoading: true,
        isMe: true,
        isAdmin: 1,
      };
      this.messages.push(message);
      this.$socket.chat.emit("send", {
        sectionId: 31,
        level: 1,
        class: "A",
        userInfo: this.userInfo,
        message: message,
      });
      this.messageField = "";
      this.scrollToBottom();
    },
    scrollToBottom() {
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 100);
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
#messages {
  margin-bottom: 100px;
}
</style>