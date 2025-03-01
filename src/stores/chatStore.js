import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatStore = defineStore('chat', () => {
  const groupId = ref(null);


  function setCurrentGroupId(id) {
    console.log(`initialized with id: ${id}`)
    resetStore()
    groupId.value = id
  }

  function resetStore() {
    groupId.value = null;
  }

  return {
    setCurrentGroupId
  }

});
