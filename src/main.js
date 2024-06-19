import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import './assets/css/common.css'
import './assets/font/iconfont.css'
import api from './api'

const app = createApp(App)
app.use(router)
app.provide('api', api)
app.mount('#app')
