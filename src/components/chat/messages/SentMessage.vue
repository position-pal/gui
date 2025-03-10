<template>
  <div class="d-flex justify-content-end mb-4">
    <div class="message message-sent rounded p-3">
      <div class="fw-bold mb-1">
        You
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
  name: 'SentMessage',
  props: {
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
.message-sent {
  background-color: #007bff;
  color: white;
}
</style>
