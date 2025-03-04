<template>
  <div class="chat-view">
    <ChatHeader :title="chatTitle" />

    <MessageList :messages="messages" />

    <MessageInput @send="sendMessage" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import ChatHeader from '../components/chat/ChatHeader.vue';
import MessageList from '../components/chat/MessageList.vue';
import MessageInput from '../components/chat/MessageInput.vue';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useChatStore } from '@/stores/chatStore';
import { useUserGroupsStore } from '@/stores/userGroupsStore';

const route = useRoute();
const chatStore = useChatStore();
const userGroupsStore = useUserGroupsStore();

const groupId = route.params.groupId;

const { name: chatTitle, messages } = storeToRefs(chatStore);


onMounted(async () => {
  chatStore.setCurrentGroupId(groupId);
  await chatStore.retrieveGroupInformation();
  await chatStore.retrieveMessages();
  await userGroupsStore.fetchUserGroups();
});

function sendMessage(messageText) {
  if (messageText.trim()) {
    userGroupsStore.sendChatMessage(messageText, groupId);
  }
}
</script>

<style>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 88vh;
}
</style>
