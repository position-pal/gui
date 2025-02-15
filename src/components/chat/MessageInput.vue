<template>
  <div class="chat-input bg-light p-3">
    <div class="input-group">
      <input type="text" class="form-control" v-model="message" @keyup.enter="send" placeholder="Type a message...">
      <button class="btn btn-primary" @click="send">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageInput',
  emits: ['send'],
  data() {
    return {
      message: ''
    }
  },
  methods: {
    send() {
      this.$emit('send', this.message)
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
