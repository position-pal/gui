<template>
  <div class="chat-input bg-light p-3">
    <div class="input-group">
      <input
        v-model="message"
        type="text"
        class="form-control"
        placeholder="Type a message..."
        @keyup.enter="send"
      >
      <button
        class="btn btn-primary"
        @click="send"
      >
        Send
      </button>
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
