import api from './api';

export const foodService = {
  getFoodItems: async (params = {}) => {
    const response = await api.get('/food', { params });
    return response.data;
  },

  getFoodItemById: async (id) => {
    const response = await api.get(`/food/${id}`);
    return response.data;
  },

  createFoodItem: async (foodData) => {
    const response = await api.post('/food', foodData);
    return response.data;
  },

  updateFoodItem: async (id, foodData) => {
    const response = await api.put(`/food/${id}`, foodData);
    return response.data;
  },

  deleteFoodItem: async (id) => {
    const response = await api.delete(`/food/${id}`);
    return response.data;
  },
};
