<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <HeaderComponent />

    <!-- Vendor Info -->
    <section v-if="loading" class="text-center py-12 px-4">
      <!-- Shimmer Loader for Vendor Info -->
      <div class="flex flex-col items-center animate-pulse">
        <div class="w-24 h-24 rounded-full bg-gray-200 mb-4"></div>
        <div class="h-6 w-40 bg-gray-200 rounded-md mb-2"></div>
        <div class="h-4 w-60 bg-gray-200 rounded-md"></div>
      </div>
    </section>
    <section v-else class="text-center py-12 px-4">
      <div class="flex flex-col items-center">
        <!-- Vendor Image -->
        <img :src="products[0]?.user?.bio?.photo?.link || '/vendor-profile.jpg'" alt="Vendor Image"
          class="w-24 h-24 rounded-full border-4 border-gray-300 mb-4" />
        <!-- Vendor Name -->
        <h2 class="font-bold text-xl text-[#232D42]">{{ products[0].user.publicName || 'Vendor Name' }}</h2>
        <!-- Vendor Description -->
        <p class="text-gray-600 text-sm max-w-lg">
          {{ products[0].description || 'Vendor description not available' }}
        </p>
      </div>
    </section>

    <!-- Menu Section -->
    <section v-if="loading" class="px-4 py-8">
      <div class="max-w-[1024px] mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          <div v-for="n in 6" :key="n" class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div class="w-full h-40 bg-gray-200"></div>
            <div class="p-4">
              <div class="h-5 w-3/4 bg-gray-200 rounded-md mb-2"></div>
              <div class="h-4 w-full bg-gray-200 rounded-md mb-2"></div>
              <div class="h-6 w-1/2 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-else class="px-4 py-8">
      <div class="max-w-[1200px] mx-auto">
        <!-- Menu Heading -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">Today's Menu</h2>
          <button class="text-purple-600 hover:underline">View All</button>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          <!-- Product Card -->
          <div v-for="product in products" :key="product.id" class="bg-white rounded-lg shadow-md overflow-hidden">
            <!-- Product Image -->
            <img :src="product.banner.link" alt="Product Image" class="w-full max-h-100 object-contain" />
            <!-- Product Details -->
            <div class="p-4">
              <h3 class="font-bold text-md text-[#232D42] truncate">
                {{ product.name }}
              </h3>
              <p class="text-gray-600 text-sm truncate">
                {{ product.description }}
              </p>
              <!-- Product Price -->
              <p class="font-bold text-[#232D42] mt-2">
                Price: {{ product.price.amount }} {{ product.price.currency }}
              </p>
              <!-- Order Controls -->
              <div class="flex items-center justify-between mt-4">
                <div class="flex items-center space-x-2">
                  <button
                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-300"
                    @click="decrementQuantity(product.id)">
                    -
                  </button>
                  <span>{{ product.quantity }}</span>
                  <button
                    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-300"
                    @click="incrementQuantity(product.id)">
                    +
                  </button>
                </div>
                <button class="bg-custom-gradient text-white px-4 py-2 rounded-lg hover:opacity-90"
                  @click="selectProductAndOrder(product)">
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <div v-if="isModalVisible" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-md p-6 mx-auto max-w-2xl relative">
        <!-- Close Icon -->
        <button @click="closeModal" class="absolute top-2 right-2 text-gray-600 text-2xl hover:text-gray-800">
          &times;
        </button>

        <!-- Product Info Section -->
        <div class="bg-white rounded-lg shadow-md p-4 mb-6">
          <div class="flex items-center">
            <img :src="selectedProduct?.banner?.link" alt="Product Image" class="w-16 h-16 rounded-full object-cover" />
            <div class="ml-4">
              <h3 class="text-lg font-semibold">{{ selectedProduct?.title }}</h3>
              <p class="text-sm text-gray-500">x{{ selectedProduct?.quantity }}</p>
            </div>
            <div class="ml-auto text-right">
              <span class="text-sm text-gray-500">by {{ selectedProduct?.user?.publicName }}</span>
              <p class="text-lg font-bold text-green-600">₺{{ selectedProduct?.price?.amount * selectedProduct?.quantity
              }}</p>
            </div>
          </div>
        </div>

        <!-- Delivery Form Section -->
        <h2 class="text-xl font-bold text-center mb-4">Tell Us Where to Deliver Your Order</h2>
        <form @submit.prevent="submitForm">
          <!-- Apartment Name -->
          <div class="mb-4">
            <label for="apartment" class="block text-gray-600 mb-2">Apartment Name</label>
            <input type="text" id="apartment" placeholder="Enter your Apartment Name" v-model="form.apartment"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            <p v-if="errors.apartment" class="text-red-500 text-xs mt-1">{{ errors.apartment }}</p>
          </div>

          <!-- Door Number -->
          <div class="mb-4">
            <label for="door" class="block text-gray-600 mb-2">Door Number</label>
            <input type="text" id="door" placeholder="Enter your Door Number" v-model="form.door"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            <p v-if="errors.door" class="text-red-500 text-xs mt-1">{{ errors.door }}</p>
          </div>

          <!-- Location -->
          <div class="mb-4">
            <label for="location" class="block text-gray-600 mb-2">Pin your location</label>
            <div class="relative">
              <input type="text" id="location" placeholder="Drop your pin here" v-model="form.location"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled />
              <button type="button" @click="getLocation"
                class="absolute right-3 top-2 bg-green-500 text-white p-2 rounded-full">
                +
              </button>
            </div>
            <p v-if="errors.location" class="text-red-500 text-xs mt-1">{{ errors.location }}</p>
          </div>



          <!-- Notes (Optional) -->
          <div class="mb-4">
            <label for="notes" class="block text-gray-600 mb-2">Optional Landmark or Delivery Notes</label>
            <textarea id="notes" placeholder="Description" v-model="form.notes"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
          </div>

          <!-- Submit Button -->
          <button type="submit"
            class="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition">
            Submit Delivery Details
          </button>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import { useVendorStore } from '@/store/vendor';
import { useAuthStore } from '~/store/user';
import HeaderComponent from "@/components/HeaderComponent.vue";
export default {
  components: {
    HeaderComponent,
  },
  data() {
    return {
      vendorId: this.$route.params.id,
      products: [],
      loading: true,
      form: {
        apartment: '',
        door: '',
        location: '',
        notes: '',
        latitude: null,
        longitude: null,
      },
      errors: {
        apartment: '',
        door: '',
        location: '',
      },
      selectedProduct: null,
      isModalVisible: false,
      whatsappNumber: '+2348082205956',
    };
  },
  methods: {
    selectProductAndOrder(product) {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        this.$router.push({ name: 'signin' });
      } else {
        this.selectedProduct = product;
        this.isModalVisible = true;
      }
    },
    closeModal() {
      this.isModalVisible = false;
    },
    validateForm() {
      this.errors = {}; // Reset errors
      let isValid = true;

      if (!this.form.apartment) {
        this.errors.apartment = 'Apartment name is required.';
        isValid = false;
      }
      if (!this.form.door) {
        this.errors.door = 'Door number is required.';
        isValid = false;
      }
      if (!this.form.location) {
        this.errors.location = 'Location is required.';
        isValid = false;
      }

      return isValid;
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          this.handleSuccess,
          this.handleError
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    },
    handleSuccess(position) {
      const { latitude, longitude } = position.coords;
      this.form.latitude = latitude;
      this.form.longitude = longitude;

      const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      this.form.location = googleMapsLink;
    },
    handleError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          this.errors.location = "User denied the request for Geolocation.";
          break;
        case error.POSITION_UNAVAILABLE:
          this.errors.location = "Location information is unavailable.";
          break;
        case error.TIMEOUT:
          this.errors.location = "The request to get user location timed out.";
          break;
        case error.UNKNOWN_ERROR:
          this.errors.location = "An unknown error occurred.";
          break;
      }
    },
    incrementQuantity(productId) {
      const product = this.products.find((p) => p.id === productId);
      if (product) {
        if (product.quantity < 10) {
          product.quantity++;
        }
      }
    },
    decrementQuantity(productId) {
      const product = this.products.find((p) => p.id === productId);
      if (product) {
        if (product.quantity > 1) {
          product.quantity--;
        }
      }
    },
    submitForm() {
      if (!this.validateForm()) {
        return;
      }

      const message = `
        Hello ${this.selectedProduct.user.publicName}, I’d like to order the following items: ${this.selectedProduct.title}.
        Quantity: ${this.selectedProduct.quantity}
        __________________________________

        Apartment name: ${this.form.apartment}
        Door number: ${this.form.door}
        Location: ${this.form.location}
        Landmark or delivery notes: ${this.form.notes || 'None'}
        Please confirm the availability.

        Powered by GREEP
      `;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      this.closeModal();
    },
  },
  async mounted() {
    const vendorStore = useVendorStore();
    if (vendorStore.vendors.length === 0) {
      await vendorStore.fetchVendors();
    }
    const vendorProducts = vendorStore.vendors.filter(
      (vendor) => vendor.user.id === this.vendorId
    );
    this.products = vendorProducts.map((product) => ({
      ...product,
      quantity: 1,
    }));
    this.loading = false;
  },
};
</script>
