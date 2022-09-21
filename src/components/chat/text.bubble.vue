<template>
  <div style="display: block">
    <v-card
      :color="isMe ? 'primary' : 'light'"
      :dark="isMe"
      style="margin: 10px; display: inline-block"
      :class="[
        !isMe ? 'left-bubble' : 'right-bubble',
        isLoading ? 'loading-bubble' : 'bubble',
      ]"
      id="textBubble"
    >
      <v-card-title>
        {{ message.username }}
        <div class="white-space" style="width: 50px"></div>
      </v-card-title>
      <v-card-text>
        {{ message.text }}
      </v-card-text>
      <v-card-subtitle v-if="isLoading"> يتم الارسال </v-card-subtitle>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            style="position: absolute; top: 10px; left: 10px"
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>la-ellipsis-v</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>حذف الرسالة</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "TextBubble",
  props: {
    message: Object,
    isMe: {
      default: false,
      type: Boolean,
    },
    isLoading: {
      default: false,
      type: Boolean,
    },
  },
};
</script>

<style>
.left-bubble {
  /* float: left; */
}
.loading-bubble {
  animation: loadingAnimation 1s ease-in-out 0s infinite normal forwards;
}

@keyframes loadingAnimation {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}
</style>