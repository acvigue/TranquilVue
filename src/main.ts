import '@/assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import { createVfm } from 'vue-final-modal'

import { plugin, defaultConfig } from '@formkit/vue'
import formKitConfig from '@/formkit.config'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createVfm())
app.use(plugin, defaultConfig(formKitConfig))

app.mount('#app')

window.authInProgress = false
