import axios from 'axios'

async function updateGroup(groupId, groupData) {
  const response = await axios.put(`api/groups/${groupId}`, groupData);
  return response.data.code === 200;
}


export {
  updateGroup,
}
