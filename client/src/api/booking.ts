import axios from './axios';

export const fetchPreviousVisits = async () => {
  const response = await axios.get('/api/profile/previous-visits');
  return response.data;
};