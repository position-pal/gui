<template>
  <div class="d-flex justify-content-center mb-4">
    <div class="message message-info text-muted rounded px-3 py-2">
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoMessage',
  props: {
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.message-info {
  background-color: #f8f9fa;
  font-size: 0.9rem;
}
</style>
