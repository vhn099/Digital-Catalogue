import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'
import SignIn from '../views/SignIn/SignIn.vue'
import ContactView from '../views/ContactUs/ContactView.vue'
import SearchView from '../views/SearchPage/SearchPage.vue'
import UserView from '../views/User/UserView.vue'
import Decks from '../views/Decks/Decks.vue'
import Category from '../views/Category/Category.vue'
import { UserFirestore } from '@/lib/User'
import AdminCategory from '@/views/AdminCategory/AdminCategory.vue'
import AdminDeck from '@/views/AdminDeck/AdminDeck.vue'
import AdminOtherConfig from '@/views/AdminOtherConfig/OtherConfig.vue'
import AdminEmailReceived from '@/views/EmailReceived/EmailReceivedView.vue'
import { getAuth } from 'firebase/auth'
import DeckDetail from '@/views/DeckDetail/DeckDetail.vue'
import MyProfile from '@/views/MyProfile/MyProfile.vue'
import MyFavorite from '@/views/MyFavorite/MyFavorite.vue'
import { nextTick } from 'vue'
import AdminFavorite from '@/views/AdminFavorite/AdminFavorite.vue'
import { COMMON_FUNCTIONS } from '@/lib/Common'

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
        adminSite: false
      }
    },
    {
      path: '/sign-in',
      name: 'signin',
      component: SignIn,
      meta: {
        pageTitle: "Sign In",
      }
    },{
      path: '/contact-us',
      name: 'contactus',
      component: ContactView,
      meta: {
        requireAuth: true,
        pageTitle: 'Contact Us',
        adminSite: false
      }
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
      meta: {
        requireAuth: true,
        pageTitle: 'Search',
        adminSite: false
      }
    },
    {
      path: '/admin/users',
      name: 'adminusers',
      component: UserView,
      meta: {
        requireAuth: true,
        pageTitle: 'Users',
        adminSite: true
      }
    },
    {
      path: '/decks/:cateID?',
      name: 'decks',
      component: Decks,
      meta: {
        requireAuth: true,
        pageTitle: 'Decks',
        adminSite: false
      }
    },
    {
      path: '/category',
      name: 'category',
      component: Category,
      meta: {
        requireAuth: true,
        pageTitle: 'Category',
        adminSite: false
      }
    },
    {
      path: '/admin/category',
      name: 'admincategory',
      component: AdminCategory,
      meta: {
        requireAuth: true,
        pageTitle: 'Category Management',
        adminSite: true
      }
    },
    {
      path: '/admin/deck',
      name: 'admindeck',
      component: AdminDeck,
      meta: {
        requireAuth: true,
        pageTitle: 'Desk Management',
        adminSite: true
      }
    },
    {
      path: '/admin/otherconfig',
      name: 'otherconfig',
      component: AdminOtherConfig,
      meta: {
        requireAuth: true,
        pageTitle: 'Other Configs Management',
        adminSite: true
      }
    },
    {
      path: '/admin/receivedemail',
      name: 'receivedemail',
      component: AdminEmailReceived,
      meta: {
        requireAuth: true,
        pageTitle: 'Emails Received Management',
        adminSite: true
      }
    },
    {
      path: '/deck/:id',
      name: 'deckdetail',
      component: DeckDetail,
      meta: {
        requireAuth: true,
        pageTitle: 'Deck Detail',
      },
      sensitive: true
    },
    {
      path: '/profile',
      name: 'profile',
      component: MyProfile,
      meta: {
        requireAuth: true,
        pageTitle: 'My Profile',
      }
    },
    {
      path: '/favorite',
      name: 'myfavorite',
      component: MyFavorite,
      meta: {
        requireAuth: true,
        pageTitle: 'My Favorite',
      }
    },
    {
      path: '/admin/favorite',
      name: 'adminfavorite',
      component: AdminFavorite,
      meta: {
        requireAuth: true,
        pageTitle: 'Favorite Management',
        adminSite: true
      }
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const cookie = UserFirestore.getCookie("user-auth");
  let currentUser = "";
  let disabled = false;
  let isAdmin = false;
  if (COMMON_FUNCTIONS.isJSONString(cookie)) {
    currentUser = JSON.parse(cookie); // Check custom authen of users.
    if (currentUser.userData) {
      disabled = currentUser.userData.disabled || false;
      isAdmin = currentUser.userData.isAdmin || false;
    }
  }
  const requireAuth = to.matched.some(record => record.meta.requireAuth);
  const requireAdmin = to.matched.some(record => record.meta.adminSite);

  if (disabled) {
    next('sign-in');
  }

  if (requireAuth && !currentUser) { // User is not authen will be redirected to sign in page
    next('/sign-in');
  } else if (requireAuth && requireAdmin && !isAdmin) { // If user doesn't have roles for admin sites redirecting back to home
    next('/home');
  } else if (currentUser && !requireAuth) { // Redirect users back to /home if they tries to access to sign-in page when they are authenticated
    next('/home');
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  document.title = to.meta.pageTitle;
});

export default router
