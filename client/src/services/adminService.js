import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getAllOrders: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  updateOrderStatus: async (id, status, notes = '', paymentStatus) => {
    const response = await api.put(`/admin/orders/${id}/status`, {
      status,
      notes,
      paymentStatus,
    });
    return response.data;
  },
};
