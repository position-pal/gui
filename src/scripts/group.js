import axios from 'axios'

async function updateGroup(groupId, groupData) {
  const response = await axios.put(`api/groups/${groupId}`, groupData);
  return response.data.code === 200;
}

async function addMember(groupId, member){
  const response = await axios.post(`api/groups/${groupId}/addMember`, member)
  return response.data.code === 200;
}

async function removeMember(groupId, member){
  const response = await axios.post(`api/groups/${groupId}/removeMember`, member)
  return response.data.code === 200;
}


export {
  updateGroup,
  addMember,
  removeMember,
}
