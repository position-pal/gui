import axios from 'axios';

const BACKEND_ENDPOINT =
  import.meta.env.VITE_BACKEND_ENDPOINT || 'http://localhost:3000'

async function getUserByEmail(email) {
  try {
    const response = await axios.get(`${BACKEND_ENDPOINT}/api/users/${email}`);

    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching user: ${error.response ? error.response.statusText : error.message}`);
  }
}

async function authenticate(token) {
  try {
    const response = await axios.post(`${BACKEND_ENDPOINT}/api/auth/authorize`, { "token": token });
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
