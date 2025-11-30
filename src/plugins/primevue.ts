// src/plugins/primevue.ts
import type { App } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import Password from "primevue/password";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";

export function setupPrimeVue(app: App) {
  app.use(PrimeVue, { theme: { preset: Aura,  options: {
        darkModeSelector: false,
        cssVariables: true,
      } } });

  // Register global components
  app.component('Button', Button);
  app.component('InputText', InputText);
  app.component('Card', Card);
  app.component('Password', Password);
  app.component('Checkbox', Checkbox);
  app.component('Dropdown', Dropdown);
}
