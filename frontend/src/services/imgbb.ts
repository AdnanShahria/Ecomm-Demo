import api from './api';

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await api.post('/system/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.url) {
      return response.data.url;
    } else {
      throw new Error('Upload proxy failed');
    }
  } catch (error) {
    console.error('Error uploading image through proxy:', error);
    throw error;
  }
};
