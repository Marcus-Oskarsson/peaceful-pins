import axios from 'axios';

function getCookie(name: string) {
  const value = document.cookie;
  if(!value) {
    return null;
  }
  const token = value.split(`${name}=`)[1];
  if(!token) {
    return null;
  }
  return token
}

const instance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = getCookie('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;