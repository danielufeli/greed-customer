<template>
  <!-- Header -->
  <header class="bg-white shadow-md px-8 py-4 flex justify-between items-center">
    <nuxt-link to="/">
      <div class="flex items-center space-x-3">
        <img src="/greep.svg" alt="Greep" class="h-8" />
        <span class="font-montserrat font-bold text-2xl text-[#232D42]">Greep</span>
      </div>
    </nuxt-link>

    <!-- Check if user is authenticated -->
    <div v-if="isAuthenticated" class="flex items-center space-x-4">
      <div class="flex flex-col text-right">
        <span class="font-semibold">{{ userName }}</span>
        <span class="text-sm text-gray-500">{{ userRole }}</span>
      </div>
      <div class="relative flex items-center">
        <!-- User Initials Circle -->
        <div class="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full text-white font-bold">
          {{ userInitials }}
        </div>
        <!-- Down Arrow beside Initials Circle -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 ml-2 cursor-pointer"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2"
          @click="toggleDropdown"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <!-- Dropdown Menu -->
        <div v-if="dropdownVisible" class="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
          <ul>
            <li @click="logout" class="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200">
              Logout
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Show "Get Started" button if not authenticated -->
    <div v-else>
      <button class="bg-custom-gradient text-white px-4 py-2 rounded-lg hover:opacity-90">
        <nuxt-link to="/signup">Get Started</nuxt-link>
      </button>
    </div>
  </header>
</template>


<script>
import { useAuthStore } from '~/store/user';

export default {
  name: "HeaderComponent",
  computed: {
    isAuthenticated() {
      return useAuthStore().isAuthenticated;
    },
    userName() {
      const user = useAuthStore().user;
      return user ? user.username : '';
    },
    userEmail() {
      const user = useAuthStore().user;
      return user ? user.email : '';
    },
    userRole() {
      const user = useAuthStore().user;
      return user ? user.role : '';
    },
    userInitials() {
      const user = useAuthStore().user;
      if (user && user?.username) {
        return user.username.split(' ').map(name => name[0]).join('');
      } else if (user && user.email) {
        return user.email.split('@')[0].slice(0, 2).toUpperCase();
      }
      return '';
    },
  },
  data() {
    return {
      dropdownVisible: false,
    };
  },
  mounted() {
    const authStore = useAuthStore();
    authStore.loadUserFromStorage();
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$router.push('/');
    },
  },
};
</script>
