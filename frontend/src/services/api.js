import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://thelma-unoily-marge.ngrok-free.dev/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting token:', error);
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changeName: (data) => api.put('/users/change-name', data),
  changeUsername: (data) => api.put('/users/change-username', data),
  getAllUsers: () => api.get('/users/all'),
  blockUser: (userId, data) => api.put(`/users/block/${userId}`, data),
  makePremium: (userId, data) => api.put(`/users/premium/${userId}`, data),
  searchUsers: (q) => api.get(`/users/search?q=${q}`)
};

export const postAPI = {
  createPost: (data) => api.post('/posts', data),
  getPosts: () => api.get('/posts'),
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
  likePost: (postId, data) => api.post(`/posts/${postId}/like`, data),
  getLikes: (postId) => api.get(`/posts/${postId}/likes`),
  commentPost: (postId, data) => api.post(`/posts/${postId}/comment`, data),
  getComments: (postId) => api.get(`/posts/${postId}/comments`),
  deletePost: (postId) => api.delete(`/posts/${postId}`)
};

export const storyAPI = {
  createStory: (data) => api.post('/stories', data),
  getStories: () => api.get('/stories'),
  getUserStories: (userId) => api.get(`/stories/user/${userId}`),
  viewStory: (storyId) => api.post(`/stories/${storyId}/view`),
  getViewers: (storyId) => api.get(`/stories/${storyId}/viewers`),
  deleteStory: (storyId) => api.delete(`/stories/${storyId}`)
};

export const chatAPI = {
  sendPrivateMessage: (data) => api.post('/chat/private', data),
  getPrivateMessages: (userId) => api.get(`/chat/private/${userId}`),
  getConversations: () => api.get('/chat/conversations'),
  sendGroupMessage: (data) => api.post('/chat/group', data),
  getGroupMessages: () => api.get('/chat/group')
};

export const followAPI = {
  followUser: (userId) => api.post(`/follows/${userId}`),
  getFollowers: (userId) => api.get(`/follows/${userId}/followers`),
  getFollowing: (userId) => api.get(`/follows/${userId}/following`),
  checkFollow: (userId) => api.get(`/follows/check/${userId}`)
};

export const supportAPI = {
  createTicket: (data) => api.post('/support', data),
  getMyTickets: () => api.get('/support/my'),
  getAllTickets: () => api.get('/support/all'),
  respondTicket: (ticketId, data) => api.put(`/support/${ticketId}/respond`, data)
};

export default api;
