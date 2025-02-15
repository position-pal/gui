<template>
  <div class="chat-input bg-light p-3">
    <div class="input-group">
      <input type="text" class="form-control" v-model="message" @keyup.enter="sendMessage" placeholder="Type a message...">
      <button class="btn btn-primary" @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageInput',
  data() {
    return {
      message: ''
    }
  },
  methods: {
    sendMessage() {
      this.$emit('send-message', this.message)
      this.message = ''
    }
  }
}
</script>

<style>
.chat-input {
  flex-shrink: 0;
  background: white;
}
</style>
