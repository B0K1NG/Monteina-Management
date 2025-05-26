import axios from './axios';

export const fetchUserInfo = async () => {
  const response = await axios.get('/profile');
  console.log('API Response:', response.data);
  const data = response.data as { user: any };
  return data.user;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await axios.patch('/api/profile/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to change password:', error);
    throw error;
  }
};