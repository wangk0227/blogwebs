import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUIPlus from 'view-ui-plus';

import './assets/base.css'
import 'view-ui-plus/dist/styles/viewuiplus.css'


const app = createApp(App)
app.config.productionTip = false

app.use(store)
app.use(router)
app.use(ViewUIPlus)
app.mount('#app')

