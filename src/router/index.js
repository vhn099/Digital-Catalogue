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
      path: '/users',
      name: 'users',
      component: UserView
    },
    {
      path: '/desks',
      name: 'desks',
      component: Desks
    },
    {
      path: '/category',
      name: 'category',
      component: Category
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  // const currentUser = await UserFirestore.getCurrentUser(); // Check custom authen of users.
  // const requireAuth = to.matched.some(record => record.meta.requireAuth);

  // if (requireAuth && currentUser.status !== 'success') {
  //   next('/sign-in');
  //   // ElMessage({
  //   //   type: currentUser.status,
  //   //   message: currentUser.message
  //   // });
  // } else if (!requireAuth && currentUser.status == 'success') {
  //   next('/home');
  // } else {
  //   next();
  // }
  next();
});

export default router
