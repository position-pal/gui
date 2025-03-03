import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useUserGroupsStore } from '@/stores/userGroupsStore';
import { getLoggedInUser } from '@/scripts/user.js'
export const useChatStore = defineStore('chat', () => {

  const groupId = ref(null);
  const messages = ref([]);
  const name = ref("");
  const members = ref({});

  const userGroupStore = useUserGroupsStore();

  function setCurrentGroupId(id) {
    resetStore()
    groupId.value = id
  }

  function resetStore() {
    groupId.value = null;
  }

  async function retrieveGroupInformation() {
    if(groupId.value == null) console.error("ChatRoom isn't initialized yet");
    const groupInformation = await userGroupStore.getGroupInformation(groupId.value);
    name.value =  groupInformation.name;

    const returnedMembers = groupInformation.members;
    members.value = returnedMembers.reduce((acc, user) => {
      const { id, ...userInfo } = user;
      acc[id] = userInfo;
      return acc;
    }, {});


  }

  async function retrieveMessages(num = 100) {
    if(groupId.value === null) console.error("ChatRoom isn't initialized yet");
    try {
      const response = await axios.get(`api/chat/last/${groupId.value}/${num}`);
      const rawMessages = response.data.data;
      const currentUserId = getLoggedInUser().id;

      messages.value = rawMessages.map(msg => {
        const isSent = msg.client_id === currentUserId;

        let senderName;
        if (isSent) {
          senderName = "You";
        } else if (members.value && members.value[msg.client_id]) {
          const sender = members.value[msg.client_id];
          senderName = `${sender.name} ${sender.surname}`;
        }

        const timestamp = new Date(parseInt(msg.timestamp.seconds) * 1000);
        const time = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`;

        const formattedContent = msg.content.replace(/^"|"$/g, '');
        return {
          sender: senderName,
          text: formattedContent,
          isSent: isSent,
          time: time
        };
      });

      console.log(messages.value);

    } catch(e) {
      console.error(e.message)
    }
  }

  return {
    name,
    messages,
    setCurrentGroupId,
    retrieveGroupInformation,
    retrieveMessages
  }

});
