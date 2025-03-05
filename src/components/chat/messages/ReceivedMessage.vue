<template>
  <div class="d-flex mb-4">
    <div class="message message-received rounded p-3">
      <div class="fw-bold mb-1">
        {{ sender }}
      </div>
      {{ text }}
      <div class="text-muted small mt-1">
        {{ time }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReceivedMessage',
  props: {
    sender: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
.message-received {
  background-color: #f1f0f0;
}
</style>
