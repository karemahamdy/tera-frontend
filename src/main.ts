import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
 
// add PrimeVue configuration
import { setupPrimeVue } from './plugins/primevue';
import 'primeicons/primeicons.css';

const app = createApp(App)
setupPrimeVue(app);

app.mount('#app')
