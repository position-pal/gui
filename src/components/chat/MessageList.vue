<template>
  <div
    id="messages"
    class="messages-box p-3"
  >
    <template
      v-for="(message, index) in messages"
      :key="index"
    >
      <InfoMessage
        v-if="message.isInfo"
        :text="message.text"
      />
      <ReceivedMessage
        v-else-if="!message.isSent"
        :sender="message.sender"
        :text="message.text"
        :time="message.time"
      />
      <SentMessage
        v-else
        :text="message.text"
        :time="message.time"
      />
    </template>
  </div>
</template>

<script>
import ReceivedMessage from './messages/ReceivedMessage.vue'
import SentMessage from './messages/SentMessage.vue'
import InfoMessage from './messages/InfoMessage.vue'

export default {
  name: 'MessageList',
  components: {
    ReceivedMessage,
    SentMessage,
    InfoMessage
  },
  props: {
    messages: {
      type: Array,
      required: true,
      // Esempio messaggio: {sender, text, isSent, isInfo}
    }
  }
}
</script>

<style>

.messages-box {
  flex: 1;
  overflow-y: auto;
}

.message {
  max-width: 75%;
}

</style>
