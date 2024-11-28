import Vue from 'vue';
import { createPinia, PiniaVuePlugin } from 'pinia';

Vue.use(PiniaVuePlugin);

export default (context, inject) => {
  const pinia = createPinia();
  context.app.pinia = pinia;
  inject('pinia', pinia);
};
