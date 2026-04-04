import { fetchClient } from './fetchClient';

export interface UpdateProfilePayload {
  bio?: string;
  githubUrl?: string;
  linkedInUrl?: string;
  skills?: string[];
  emailNotifications?: boolean;
}

export interface SendMessagePayload {
  receiverId: string;
  content: string;
}

export const usersApi = {
  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file); 

    return fetchClient('/users/profile/image', {
      method: 'POST',
      body: formData, 
    });
  },

  updateProfile: async (data: UpdateProfilePayload) => {
    return fetchClient('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  getAllUsers: async () => {
    return fetchClient('/users/profile/directory'); 
  },

  sendMessage: async (data: SendMessagePayload) => {
    return fetchClient('/users/profile/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMessages: async () => {
    return fetchClient('/users/profile/messages');
  }
};