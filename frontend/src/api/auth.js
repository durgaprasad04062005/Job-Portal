import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
};

export const profileAPI = {
  getMe: () => api.get('/profile/me'),
  update: (data) => api.put('/profile/update', data),
  uploadResume: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/profile/upload-resume', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadPicture: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/profile/upload-picture', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
