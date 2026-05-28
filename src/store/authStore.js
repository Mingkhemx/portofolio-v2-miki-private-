import { create } from 'zustand';
import { supabase } from '../supabaseClient';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true,

  login: async (username, password) => {
    set({ loading: true });
    
    // Jika username bukan email (tidak mengandung @), otomatis tambahkan domain default
    const email = username.includes('@') ? username : `${username}@migwara.my.id`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ loading: false });
      throw error;
    }

    set({ isAuthenticated: true, user: data.user, loading: false });
    return true;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ isAuthenticated: false, user: null });
  },

  checkSession: async () => {
    set({ loading: true });
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      set({ isAuthenticated: true, user: session.user, loading: false });
    } else {
      set({ isAuthenticated: false, user: null, loading: false });
    }
  },
}));
