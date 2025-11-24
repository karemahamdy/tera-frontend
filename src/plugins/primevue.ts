// src/plugins/primevue.ts
import type { App } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';

export function setupPrimeVue(app: App) {
  app.use(PrimeVue, { theme: { preset: Aura } });

  // Register global components
  app.component('Button', Button);
  app.component('InputText', InputText);
  app.component('Card', Card);
}
