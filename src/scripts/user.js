import axios from 'axios';

async function getUserByEmail(email) {
  try {
    const response = await axios.get(`api/users/${email}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching user: ${error.response ? error.response.statusText : error.message}`
    );
  }
}

async function authenticate(token) {
  try {
    const response = await axios.post(`api/auth/authorize`, { "token": token });
    return response.data.data.authorized;
  } catch (error) {
    throw new Error(
      `Error authenticating user: ${error.response ? error.response.statusText : error.message}`
    );
  }
}

export {
  getUserByEmail,
  authenticate
};
