import api from './api';

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getFacultyList: async () => {
    const response = await api.get('/admin/faculty');
    return response.data;
  },

  getStudentList: async () => {
    const response = await api.get('/admin/students');
    return response.data;
  },

  createStudent: async (data) => {
    const response = await api.post('/admin/students', data);
    return response.data;
  },
};

