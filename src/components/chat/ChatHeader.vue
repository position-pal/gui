<template>
  <div class="chat-header bg-primary text-white p-3">
      <h5 class="mb-0">{{ title }}</h5>
    </div>
</template>

<script>
export default {
  name: 'ChatHeader',
  props: {
    title: {
      type: String,
      required: true
    },
  }
}
</script>

<style>

.chat-header {
  flex-shrink: 0;
}

</style>
