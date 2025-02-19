import axios from 'axios'

async function getUserByEmail(email) {
  try {
    const response = await axios.post(`api/users/getuser`, { "email": email });
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

async function login(email, password) {
  const response = await axios.post(`api/auth/login`, { "email": email, "password": password });
  if (response.data.data.token) {
    sessionStorage.setItem('authToken', response.data.data.token)
    sessionStorage.setItem('userData', await getUserByEmail(email));
    return true;
  }
  return false;
}

async function registerAndLogin(name, surname, email, password) {
  const response = await axios.post("api/users", {
    userData: {
      name: name,
      surname: surname,
      email: email,
    },
    password: password,
  })
  if (response.data.code === 200) {
    sessionStorage.setItem("userData", response.data.data)
    return await login(email, password)
  }
}

export {
  getUserByEmail,
  authenticate,
  login,
  registerAndLogin,
};
