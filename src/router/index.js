import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'
import SignIn from '../views/SignIn/SignIn.vue'
import ContactView from '../views/ContactUs/ContactView.vue'
import UserView from '../views/User/UserView.vue'
import Desks from '../views/Desks/Desks.vue'
import Category from '../views/Category/Category.vue'
import { UserFirestore } from '@/lib/User'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      redirect: to => {
        return {
          path: '/home'
        }
      }
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: {
        requireAuth: true,
        pageTitle: 'Home',
        adminSite: true
      }
    },
    {
      path: '/sign-in',
      name: 'signin',
      component: SignIn
    },
    {
      path: '/contact-us',
      name: 'contactus',
      component: ContactView,
      meta: {
        requireAuth: true,
        pageTitle: 'Contact Us',
        adminSite: true
      }
    },
    {
      path: '/users',
      name: 'users',
      component: UserView,
      meta: {
        requireAuth: true,
        pageTitle: 'Users',
        adminSite: true
      }
    },
    {
      path: '/desks',
      name: 'desks',
      component: Desks,
      meta: {
        requireAuth: true,
        pageTitle: 'Desks',
        adminSite: true
      }
    },
    {
      path: '/category',
      name: 'category',
      component: Category,
      meta: {
        requireAuth: true,
        pageTitle: 'Category',
        adminSite: true
      }
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const currentUser = await UserFirestore.getCurrentUser(); // Check custom authen of users.
  const requireAuth = to.matched.some(record => record.meta.requireAuth);

  if (requireAuth && currentUser.status !== 'success') {
    next('/sign-in');
  } else if (!requireAuth && currentUser.status == 'success') {
    next('/home');
  } else {
    next();
  }
  // next();
});

export default router
