import type { StorybookConfig } from '@storybook/vue3-vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        alias: { '@': path.resolve(__dirname, '../src') },
      },
      optimizeDeps: {
        include: [
          'primevue/config',
          'primevue/button',
          'primevue/inputtext',
          'primevue/inputnumber',
          'primevue/card',
          'primevue/datatable',
          'primevue/column',
          'primevue/dialog',
          'primevue/progressspinner',
          'primevue/avatar',
          'primevue/tag',
          'primevue/menu',
          'primevue/badge',
          'primevue/password',
          'primevue/checkbox',
          'primevue/dropdown',
          'primevue/menubar',
          'primevue/tooltip',
          'primevue/inputgroup',
          'primevue/inputgroupaddon',
          'primevue/textarea',
          'primevue/toggleswitch',
          'primevue/radiobutton',
          'primevue/accordion',
          'primevue/accordionpanel',
          'primevue/accordionheader',
          'primevue/accordioncontent',
          'primevue/fileupload',
          'primevue/toastservice',
          'primevue/toast',
          'primevue/multiselect',
          'primevue/datepicker',
          'primevue/treeselect',
          'primevue/tabmenu',
          'primevue/tabs',
          'primevue/tablist',
          'primevue/tab',
          'primevue/tabpanels',
          'primevue/tabpanel',
          'primevue/calendar',
          'primevue/steplist',
          'primevue/steppanels',
          'primevue/stepitem',
          'primevue/step',
          'primevue/steppanel',
          'primevue/progressbar',
          'vue-iconsax',
        ],
      },
    });
  },
};

export default config;
