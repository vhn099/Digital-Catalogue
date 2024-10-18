import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'
import SignIn from '@/views/SignIn/SignIn.vue'
import ContactView from '@/views/ContactUs/ContactView.vue'
import UserView from '@/views/User/UserView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      redirect: HomeView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/sign-in',
      name: 'signin',
      component: SignIn
    },
    {
      path: '/contact-us',
      name: 'contactus',
      component: ContactView
    },
    {
      path: '/user',
      name: 'user',
      component: UserView
    }
  ]
})

export default router
