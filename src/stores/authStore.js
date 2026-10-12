import { defineStore } from 'pinia';
import api from '@/services/api'; // Importación ajustada a la carpeta services

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.roles?.[0]?.name || 'CLIENTE',
  },

  actions: {
    async login(email, password) {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      this.token = response.data.access_token;
      this.user = response.data.user;
    },

    // MÉTODO NUEVO PARA EL REGISTRO
    async register(userData) {
      const response = await api.post('/auth/register', userData);
      
      // Laravel nos devuelve un token y usuario igual que en el login. 
      // Al asignarlos, Pinia persist los guardará automáticamente.
      this.token = response.data.access_token;
      this.user = response.data.user;
      
      return response.data;
    },

    async validarDui(payload) {
      const response = await api.post('/auth/validar-dui', payload);
      return response.data;
    },

    async fetchUser() {
      if (!this.token) return;
      try {
        const response = await api.get('/auth/me');
        this.user = response.data;
      } catch (error) {
        this.logoutLocally();
      }
    },

    async logout() {
      try {
        if (this.token) {
          await api.post('/auth/logout');
        }
      } catch (error) {
        console.error("Error al cerrar sesión en el servidor", error);
      } finally {
        this.logoutLocally();
      }
    },

    logoutLocally() {
      this.user = null;
      this.token = null;
      window.location.href = '/login';
    }
  },
  
  persist: true, 
});