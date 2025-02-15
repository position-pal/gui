<template>
  <div class="chat-view">
    <div class="chat-header bg-primary text-white p-3">
      <h5 class="mb-0">Chat Room</h5>
    </div>

    <MessageList :messages="messages" />

    <div class="chat-input border-top p-3">
      <form class="input-group" @submit.prevent="sendMessage">
        <input v-model="newMessage" type="text" class="form-control" placeholder="Type your message..." />
        <button class="btn btn-primary" type="submit">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
import MessageList from '../components/chat/MessageList.vue'

export default {
  name: 'ChatPage',
  components: {
    MessageList
  },
  data() {
    return {
      newMessage: '',
      messages: [
        { text: 'Welcome to the chat room!', isInfo: true },
        { sender: 'John Doe', text: 'Hello! How are you today?', isSent: false, time: '09:00' },
        { sender: 'You', text: "I'm doing great, thanks for asking!", isSent: true, time: '09:01' },
        { text: 'John Doe is typing...', isInfo: true },
        { sender: 'John Doe', text: 'What are you working on?', isSent: false, time: '09:02' },
        { sender: 'You', text: 'I am working on a Vue.js chat application', isSent: true, time: '09:03' },
        { text: 'John Doe left the chat', isInfo: true }
      ]
    }
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim()) {
        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        this.messages.push({
          sender: 'You',
          text: this.newMessage,
          isSent: true,
          time: time
        })
        this.newMessage = ''
      }
    }
  }
}
</script>

<style>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 90vh;
}

.chat-header {
  flex-shrink: 0;
}

</style>
