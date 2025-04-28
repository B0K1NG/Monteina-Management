import axios from './axios';

export const fetchUserInfo = async () => {
  const response = await axios.get('/profile');
  console.log('API Response:', response.data);
  return response.data.user;
};