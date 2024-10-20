import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';
import { createPinia } from "pinia";
import ToastService from 'primevue/toastservice';

/* FIREBASE START */
import environment from '../firebase-config.json';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
const initial = initializeApp(environment.FIREBASE_INFO);
const db = getFirestore(initial);
/* FIREBASE END */
export { db };

let app = '';
export const auth = getAuth(initial)

onAuthStateChanged(auth, currentUser => {
    if (!app) {
        app = createApp(App);
        app.use(createPinia()); // Store service
        app.use(router); // Router service
        app.use(PrimeVue, { // PrimeVue component definition
            theme: {
                preset: {
                    ...Aura,
                    semantic: {
                        ...Aura.semantic,
                        primary: {
                            50: '{purple.50}',
                            100: '{purple.100}',
                            200: '{purple.200}',
                            300: '{purple.300}',
                            400: '{purple.400}',
                            500: '{purple.500}',
                            600: '{purple.600}',
                            700: '{purple.700}',
                            800: '{purple.800}',
                            900: '{purple.900}',
                            950: '{purple.950}'
                        },
                    }
                },
                // preset: Aura,
                options: {
                    darkModeSelector: '.my-app-dark'
                }
            }
        });
        app.use(ToastService); // Alert Service
        app.mount('#app');
    }
});
