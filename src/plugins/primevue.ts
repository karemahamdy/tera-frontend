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
import Badge from 'primevue/badge'
import Avatar from 'primevue/avatar'
import Menubar from 'primevue/menubar'
import Tooltip from 'primevue/tooltip'
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';

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
  app.component('Badge', Badge);
  app.component('Avatar', Avatar);
  app.component('Menubar', Menubar);
  app.directive('tooltip', Tooltip);
  app.component('InputGroup', InputGroup);
  app.component('InputGroupAddon', InputGroupAddon);
}
