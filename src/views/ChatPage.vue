<template>
  <div class="chat-view">
    <ChatHeader :title="chatTitle" />

    <MessageList :messages="messages" />

    <MessageInput @send="sendMessage" />
  </div>
</template>

<script setup>
import ChatHeader from '../components/chat/ChatHeader.vue';
import MessageList from '../components/chat/MessageList.vue';
import MessageInput from '../components/chat/MessageInput.vue';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useChatStore } from '@/stores/chatStore';

const route = useRoute();
const groupId = route.params.groupId;
const chatStore = useChatStore();

const chatTitle = 'Chat Room';
const messages = [
  { text: 'Welcome to the chat room!', isInfo: true },
  { sender: 'John Doe', text: 'Hello! How are you today?', isSent: false, time: '09:00' },
  { sender: 'You', text: "I'm doing great, thanks for asking!", isSent: true, time: '09:01' },
  { text: 'John Doe is typing...', isInfo: true },
  { sender: 'John Doe', text: 'What are you working on?', isSent: false, time: '09:02' },
  { sender: 'You', text: 'I am working on a Vue.js chat application', isSent: true, time: '09:03' },
  { text: 'John Doe left the chat', isInfo: true }
];

onMounted(async () => {
  chatStore.setCurrentGroupId(groupId);
});

function sendMessage(messageText) {
  if (messageText.trim()) {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    this.messages.push({
      sender: 'You',
      text: messageText,
      isSent: true,
      time: time
    })
  }
}
</script>

<style>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 90vh;
}
</style>
