// src/plugins/primevue.ts
import type { App } from 'vue';
import { VsxIcon } from "vue-iconsax";


export function setupPrimeVueIcons(app: App) {
  app.component("VsxIcon", VsxIcon);
}
