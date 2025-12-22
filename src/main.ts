import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import router from './app/router'
import { setupPrimeVue } from './plugins/primevue';
import 'primeicons/primeicons.css';
import i18n from './plugins/i18n';
import { setupPrimeVueIcons } from './plugins/primevueIcons';
import { GlobalComponents } from './plugins/globalComponents';


const app = createApp(App)

const pinia = createPinia();
app.use(i18n);
app.use(pinia);
app.use(router)
app.use(GlobalComponents);
setupPrimeVue(app);
setupPrimeVueIcons(app);
app.mount('#app')
