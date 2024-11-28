import { defineStore } from 'pinia';
import axios from 'axios';
import { Product, ApiResponse } from '@/types/api';

export const useVendorStore = defineStore('vendorStore', {
  state: () => ({
    vendors: [] as Product[],
    loading: false,
    error: null as string | null,
    selectedProduct: null as Product | null,
  }),
  actions: {
    async fetchVendors() {
      this.loading = true;
      this.error = null;

      try {

        const response = await axios.get<ApiResponse>(`https://development.apis.greep.io/api/marketplace/products`);
        this.vendors = response.data.results;
      } catch (err) {
        this.error = 'Failed to fetch data';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    setSelectedProduct(product: Product) {
      this.selectedProduct = product;
    },

    clearSelectedProduct() {
      this.selectedProduct = null;
    },
  },
});
