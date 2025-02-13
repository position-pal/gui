<template>
  <div class="chat-view">
    <div class="chat-header bg-primary text-white p-3">
      <h5 class="mb-0">Chat Room</h5>
    </div>

    <div class="messages-box p-3" id="messages">
      <!-- Sample messages -->
      <div class="d-flex mb-4">
        <div class="message message-received rounded p-3">
          <div class="fw-bold mb-1">John Doe</div>
          Hello! How are you today?
        </div>
      </div>
      <div class="d-flex justify-content-end mb-4">
        <div class="message message-sent rounded p-3">
          <div class="fw-bold mb-1">You</div>
          I'm doing great, thanks for asking!
        </div>
      </div>
    </div>

    <div class="chat-input border-top p-3">
      <form class="input-group">
        <input type="text" class="form-control" placeholder="Type your message..." />
        <button class="btn btn-primary" type="submit">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatPage',
}
</script>

<style>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  flex-shrink: 0;
}

.messages-box {
  flex: 1;
  overflow-y: auto;
}

.chat-input {
  flex-shrink: 0;
  background: white;
}

.message {
  max-width: 75%;
}

.message-received {
  background-color: #f1f0f0;
}

.message-sent {
  background-color: #007bff;
  color: white;
}
</style>
