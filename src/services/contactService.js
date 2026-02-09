import axiosInstance from '../api/axiosConfig';

export const contactService = {
  sendContact: async (payload) => {
    const response = await axiosInstance.post('/contact', payload);
    return response.data;
  },
};

export default contactService;
