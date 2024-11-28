<template>
  <div class="bg-gray-50 min-h-screen">
    <HeaderComponent />

    <!-- Hero Section -->
    <section class="text-center py-12 px-4">
      <h1 class="bg-text-gradient bg-clip-text text-transparent font-bold text-[28px]">
        Search for the Best Vendors <br /> and Delicious Menus!
      </h1>

      <div class="mt-6 max-w-3xl mx-auto">
        <div class="flex items-center border border-gray-300 rounded-full overflow-hidden">
          <input type="text" placeholder="Search..." v-model="searchQuery"
            class="flex-1 p-4 outline-none text-gray-700" />
          <select v-model="selectedCategory"
            class="border-l border-gray-300 px-4 py-3 outline-none bg-white text-gray-700 appearance-none">
            <option value="">Category</option>
            <option value="foods">Foods</option>
          </select>
          <button class="bg-gray-900 text-white px-6 py-3" @click="searchVendors">Search</button>
        </div>
      </div>
    </section>

    <!-- Vendors Section -->
    <section class="px-4 py-8">
      <div class="max-w-[1024px] mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">Vendors</h2>
          <button class="text-blue-600 hover:underline">View All</button>
        </div>

        <!-- Shimmer Loader -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div v-for="n in 6" :key="n" class="bg-white rounded-lg shadow-md overflow-hidden">
            <!-- Shimmer Image -->
            <div class="w-full h-40 shimmer-wave"></div>

            <!-- Shimmer Text -->
            <div class="p-4">
              <div class="w-32 h-6 shimmer-wave mb-2"></div>
              <div class="w-48 h-4 shimmer-wave mb-2"></div>
              <div class="flex justify-between items-center mt-4">
                <div class="w-16 h-4 shimmer-wave"></div>
                <div class="w-20 h-8 shimmer-wave rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vendors Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div v-for="vendor in filteredVendors" :key="vendor.id" class="bg-white rounded-lg shadow-md overflow-hidden">
            <img :src="vendor.user?.bio?.photo?.link" alt="Vendor Image" class="w-full h-40 object-cover" />
            <div class="p-4">
              <h3 class="font-bold text-lg">{{ vendor.user.publicName }}</h3>
              <p class="text-gray-600 text-sm">{{ vendor.description }}</p>
              <div class="flex items-center justify-between mt-4">
                <span class="text-green-600 text-sm">Open</span>
                <button @click="goToVendorProducts(vendor.user.id)"
                  class="bg-gray-800 text-white px-3 py-1 rounded-lg hover:bg-gray-700">
                  View Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>



<script>
import { useVendorStore } from '@/store/vendor';
import HeaderComponent from "@/components/HeaderComponent.vue";

export default {
  components: {
    HeaderComponent,
  },
  data() {
    return {
      vendors: [],
      loading: true,
      searchQuery: '', // Stores search input
      selectedCategory: '', // Stores selected category
    };
  },
  computed: {
    filteredVendors() {
      return this.vendors.filter(vendor => {
        // Filter by search query
        const matchesSearch = vendor.user.publicName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          vendor.description.toLowerCase().includes(this.searchQuery.toLowerCase());

        // Filter by selected category (assuming each vendor has a category id)
        const matchesCategory = this.selectedCategory ? vendor.categoryId === parseInt(this.selectedCategory) : true;

        return matchesSearch && matchesCategory;
      });
    }
  },
  methods: {
    uniqueVendors(vendors) {
      const unique = new Map();
      vendors.forEach(vendor => {
        if (!unique.has(vendor.user.id)) {
          unique.set(vendor.user.id, vendor);
        }
      });
      return Array.from(unique.values());
    },
    goToVendorProducts(vendorId) {
      this.$router.push({
        name: 'vendor-id',
        params: { id: vendorId },
      });
    },
    searchVendors() {
      this.loading = true;
      const vendorStore = useVendorStore();
      vendorStore
        .fetchVendors()
        .then(() => {
          this.vendors = this.uniqueVendors(vendorStore.vendors);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  mounted() {
    const vendorStore = useVendorStore();
    vendorStore
      .fetchVendors()
      .then(() => {
        this.vendors = this.uniqueVendors(vendorStore.vendors);
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>


<style>
.shimmer-wave {
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg,
      rgba(229, 229, 229, 1) 25%,
      rgba(243, 243, 243, 1) 50%,
      rgba(229, 229, 229, 1) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}


.placeholder {
  height: 100px;
  border-radius: 8px;
  background: #e0e0e0;
}
</style>


