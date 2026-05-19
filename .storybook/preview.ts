import type { Preview } from '@storybook/vue3';
import { setup } from '@storybook/vue3';
import { createPinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { setupPrimeVue } from '../src/plugins/primevue';
import { setupPrimeVueIcons } from '../src/plugins/primevueIcons';
import { GlobalComponents } from '../src/plugins/globalComponents';
import i18n from '../src/app/i18n/index';
import 'primeicons/primeicons.css';
import '../src/style.css';

setup((app) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  });

  app.use(createPinia());
  app.use(router);
  app.use(i18n);
  app.use(GlobalComponents as any);
  setupPrimeVue(app);
  setupPrimeVueIcons(app);
});

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'white',
      values: [
        { name: 'white', value: '#ffffff' },
        { name: 'light', value: '#f5f5f5' },
        { name: 'dark', value: '#181d27' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px' } },
      },
    },
  },
};

export default preview;
