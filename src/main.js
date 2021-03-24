import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // <---
import ElementPlus from 'element-plus';
import { createPinia } from 'pinia'

import 'element-plus/lib/theme-chalk/index.css';
import '@/assets/css/tailwind.css'

const app = createApp(App);
app.use(ElementPlus)
app.use(router)
app.use(createPinia())
app.mount('#app')
