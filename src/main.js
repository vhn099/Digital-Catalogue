import { createApp } from "vue";
import { createPinia } from "pinia";

// Nucleo Icons
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";

import materialKit from "./material-kit";

/* App variable Definition start */
import App from "./App.vue";
import router from "./router";
import environment from '../firebase-config.json';
/* App variable Definition end */

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

/* FIREBASE START */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
const initial = initializeApp(environment.FIREBASE_INFO);
/* FIREBASE END */

let app = '';
const auth = getAuth();

// Card: views/Presentation/Components/Card
// Card data: views/Presentation/Sections/Data
onAuthStateChanged(auth, (currentUser) => {
    if (!app) {
        app = createApp(App);
        /* Global variable define start */
        app.config.globalProperties.$db = getFirestore(initial);
        /* Global varaible define end */
        app.use(createPinia());
        app.use(router);
        app.use(materialKit);
        app.use(ElementPlus);
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
        app.mount("#app");
    }
});