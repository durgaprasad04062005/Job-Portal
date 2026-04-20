import api from './axios';

export const jobsAPI = {
  search: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  updateStatus: (id, status) => api.patch(`/jobs/${id}/status?status=${status}`),
  getMyJobs: (params) => api.get('/jobs/employer/my-jobs', { params }),
};

export const applicationsAPI = {
  apply: (application, resumeFile) => {
    const form = new FormData();
    form.append('application', new Blob([JSON.stringify(application)],
      { type: 'application/json' }));
    if (resumeFile) form.append('resume', resumeFile);
    return api.post('/applications/apply', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMyApplications: (params) => api.get('/applications/my-applications', { params }),
  getJobApplications: (jobId, params) =>
    api.get(`/applications/job/${jobId}`, { params }),
  getEmployerApplications: (params) =>
    api.get('/applications/employer/all', { params }),
  updateStatus: (id, status, note) =>
    api.patch(`/applications/${id}/status?status=${status}${note ? `&note=${note}` : ''}`),
  withdraw: (id) => api.delete(`/applications/${id}/withdraw`),
};

export const savedJobsAPI = {
  save: (jobId) => api.post(`/student/saved-jobs/${jobId}`),
  unsave: (jobId) => api.delete(`/student/saved-jobs/${jobId}`),
  getSaved: (params) => api.get('/student/saved-jobs', { params }),
};

export const notificationsAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export const dashboardAPI = {
  getEmployerStats: () => api.get('/dashboard/employer'),
  getStudentStats: () => api.get('/dashboard/student'),
  getAdminStats: () => api.get('/admin/dashboard'),
};

export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),
  getAllJobs: (params) => api.get('/admin/jobs', { params }),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
};
