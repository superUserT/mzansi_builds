import { fetchClient } from './fetchClient';

export const usersApi = {
  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file); 

    return fetchClient('/users/profile/image', {
      method: 'POST',
      body: formData, 
    });
  }
};