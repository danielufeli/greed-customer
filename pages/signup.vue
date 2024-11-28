<template>
  <div class="flex min-h-screen flex-col lg:flex-row">
    <!-- Left Section -->
    <div class="bg-gradient-to-br from-gray-800 to-green-700 flex-1 flex items-center justify-center hidden lg:flex">
      <div>
        <h1 class="text-white text-[72px] font-bold">Greep</h1>
        <p class="text-white text-[40px]">Customer</p>
      </div>
    </div>
    <!-- Right Section -->
    <div class="flex-1 flex items-center justify-center">
      <div class="w-full max-w-md p-8">
        <!-- Logo -->
        <nuxt-link to="/">
          <img src="/greep.svg" alt="Greep Logo" class="mx-auto w-12 h-12" />
        </nuxt-link>
        <h2 class="text-2xl font-bold text-center mb-4">Sign Up</h2>
        <p class="text-center mb-6 text-gray-500">Become an Ambassador today on Greep</p>
        <button
          class="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg py-2 mb-4 hover:bg-gray-100">
          <img src="https://img.icons8.com/color/24/google-logo.png" alt="Google Icon" class="mr-2" />
          Continue with Google
        </button>
        <div class="text-center text-gray-400 mb-4">Or</div>
        <form @submit.prevent="handleSignup">
          <div class="mb-4">
            <label for="email" class="block text-gray-600 mb-2">Email</label>
            <input id="email" type="email" v-model="form.email" placeholder="Enter your email"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
          </div>
          <div class="mb-4">
            <label for="password" class="block text-gray-600 mb-2">Password</label>
            <input id="password" type="password" v-model="form.password" placeholder="Enter your password"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
          </div>
          <button
            type="submit"
            class="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
            :disabled="loading">
            <span v-if="loading">Loading...</span>
            <span v-else>Get Started</span>
          </button>
        </form>
        <p class="mt-4 text-center text-gray-500">
          Have an account?
          <nuxt-link to="/signin" class="text-blue-600 font-bold">Login</nuxt-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '~/store/user';

export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
    };
  },
  computed: {
    errors() {
      return useAuthStore().errors;
    },
    loading() {
      return useAuthStore().loading;
    },
  },
  methods: {
    async handleSignup() {
      const authStore = useAuthStore();
      authStore.errors = {};
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.form.email) {
        authStore.errors.email = 'Email is required';
        return;
      } else if (!emailPattern.test(this.form.email)) {
        authStore.errors.email = 'Please enter a valid email';
        return;
      }

      if (!this.form.password) {
        authStore.errors.password = 'Password is required';
        return;
      } else if (this.form.password.length < 6) {
        authStore.errors.password = 'Password must be at least 6 characters long';
        return;
      }

      try {
        await authStore.signupUser({
          email: this.form.email,
          password: this.form.password,
        });

        if (authStore.isAuthenticated) {
          this.$router.push('/');
        }
      } catch (error) {
        console.error('Signup failed:', error);
      }
    },
  },
};
</script>
