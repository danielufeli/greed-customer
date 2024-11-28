import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    errors: {} as Record<string, string>,
  }),

  actions: {
    setUser(userData: null) {
      this.user = userData;
      this.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
    },
    loadUserFromStorage() {
      const user = localStorage.getItem('user');
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      if (user && isAuthenticated) {
        this.user = JSON.parse(user);
        this.isAuthenticated = true;
      }
    },
    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    },
    async signupUser(payload: { email: string; password: string }) {
      this.loading = true;
      try {
        const response = await axios.post(
          'https://development.apis.greep.io/api/auth/emails/signup',
          payload
        );

        this.user = response.data.user;
        this.accessToken = response.data.accessToken;
        this.refreshToken = response.data.refreshToken;
        this.isAuthenticated = true;
        this.errors = {};

        this.setUser(response.data.user);

        console.log('Signup successful:', this.user);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
          const apiErrors = error.response.data;
          this.errors = {};

          apiErrors.forEach((err: { field: string; message: string }) => {
            this.errors[err.field] = err.message;
          });
        } else {
          this.errors = { general: 'An unexpected error occurred' };
        }
      } finally {
        this.loading = false;
      }
    },
    async signinUser(payload: { email: string; password: string }) {
      this.loading = true;
      try {
        const response = await axios.post(
          'https://development.apis.greep.io/api/auth/emails/signin',
          payload
        );

        this.user = response.data.user;
        this.accessToken = response.data.accessToken;
        this.refreshToken = response.data.refreshToken;
        this.isAuthenticated = true;
        this.errors = {};

        this.setUser(response.data.user);

        console.log('Signin successful:', this.user);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
          const apiErrors = error.response.data;
          this.errors = {};

          apiErrors.forEach((err: { field: string; message: string }) => {
            this.errors[err.field] = err.message;
          });
        } else {
          this.errors = { general: 'An unexpected error occurred' };
        }
      } finally {
        this.loading = false;
      }
    }

  },
});
