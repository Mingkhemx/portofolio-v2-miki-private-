import { create } from 'zustand';
import { loginApi, checkSessionApi } from '../apiClient';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true,

  login: async (username, password) => {
    set({ loading: true });
    try {
      const data = await loginApi(username, password);
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
      }
      set({ isAuthenticated: true, user: data.user, loading: false });
      return true;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  logout: async () => {
    localStorage.removeItem('admin_token');
    set({ isAuthenticated: false, user: null, loading: false });
  },

  checkSession: async () => {
    set({ loading: true });
    try {
      const data = await checkSessionApi();
      if (data.isAuthenticated) {
        set({ isAuthenticated: true, user: data.user, loading: false });
      } else {
        localStorage.removeItem('admin_token');
        set({ isAuthenticated: false, user: null, loading: false });
      }
    } catch {
      localStorage.removeItem('admin_token');
      set({ isAuthenticated: false, user: null, loading: false });
    }
  },
}));
