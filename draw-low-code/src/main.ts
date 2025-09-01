import { createApp } from 'vue'
import 'normalize.css'
import './style.scss'
import App from './App.vue'
import router from '@/routers/index'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(createPersistedState())
createApp(App).use(router).use(pinia).use(ElementPlus).mount('#app')
