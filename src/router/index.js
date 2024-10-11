import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home/Home.vue";
import ContactUs from "../views/ContactUs/ContactUs.vue";
import SignIn from "../views/SignIn.vue";
import Users from "../views/Settings/User.vue";

import { getAuth } from "firebase/auth";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'is-active',
  linkExactActiveClass: 'is-exact-active',
  routes: [
    {
      path: "/home",
      name: "home",
      component: Home,
      meta: {
        requireAuth: true,
        pageTitle: 'Home'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/sign-in'
    },

    {
      path: "/contact-us",
      name: "contactus",
      component: ContactUs,
      meta: {
        requireAuth: true,
        pageTitle: 'Contact Us'
      }
    },
    {
      // path: "/pages/landing-pages/basic",
      path: "/sign-in",
      name: "sign-in",
      component: SignIn,
    },
   {
      path: '/setting/users',
      name: 'setting-user',
      component: Users,
      meta: {
        requireAuth: true,
        pageTitle: 'Users'
      }
    }
  ],
});

router.beforeEach((to, from, next) => {
  const currentUser = getAuth().currentUser;
  const requireAuth = to.matched.some(record => record.meta.requireAuth);
  if (requireAuth && !currentUser) {
    next('/sign-in');
  } else if (!requireAuth && currentUser) {
    next('/home');
  } else {
    next();
  }
});

export default router;
