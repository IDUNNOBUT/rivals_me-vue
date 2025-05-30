import { createApp } from 'vue'
import router from './routes'
import './main.scss'
import App from './App.vue'

createApp(App)
  .use(router)
  .mount('#app')
