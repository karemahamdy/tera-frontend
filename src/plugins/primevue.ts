// src/plugins/primevue.ts
import type { App } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';
import Menu from 'primevue/menu';
import Badge from 'primevue/badge';
import Password from "primevue/password";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";
import Menubar from 'primevue/menubar'
import Tooltip from 'primevue/tooltip'
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Textarea from 'primevue/textarea';


export function setupPrimeVue(app: App) {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: false,
        cssVariables: true,
      },
    },
  });

  app.component('Button', Button);
  app.component('InputText', InputText);
  app.component('Card', Card);
  app.component('Password', Password);
  app.component('Checkbox', Checkbox);
  app.component('Dropdown', Dropdown);
  app.component('DataTable', DataTable);
  app.component('Column', Column);
  app.component('Dialog', Dialog);
  app.component('ProgressSpinner', ProgressSpinner);
  app.component('Avatar', Avatar);
  app.component('Tag', Tag);
  app.component('Menu', Menu);
  app.component('Badge', Badge);
  app.component('Badge', Badge);
  app.component('Avatar', Avatar);
  app.component('Menubar', Menubar);
  app.directive('tooltip', Tooltip);
  app.component('InputGroup', InputGroup);
  app.component('InputGroupAddon', InputGroupAddon);
  app.component('Textarea', Textarea);
}
