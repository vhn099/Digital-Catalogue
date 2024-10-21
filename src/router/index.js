import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'
import SignIn from '../views/SignIn/SignIn.vue'
import ContactView from '../views/ContactUs/ContactView.vue'
import UserView from '../views/User/UserView.vue'
import Desks from '../views/Desks/Desks.vue'
import Category from '../views/Category/Category.vue'
import { UserFirestore } from '@/lib/User'
import AdminCategory from '@/views/AdminCategory/AdminCategory.vue'
import AdminDeck from '@/views/AdminDeck/AdminDeck.vue'
import AdminContactEmail from '@/views/ContactEmail/OtherConfig.vue'
import AdminEmailReceived from '@/views/EmailReceived/EmailReceivedView.vue'
import { getAuth } from 'firebase/auth'
import DeckDetail from '@/views/DeckDetail/DeckDetail.vue'
import MyProfile from '@/views/MyProfile/MyProfile.vue'
import MyFavorite from '@/views/MyFavorite/MyFavorite.vue'

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
      component: SignIn
    },
    {
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
      path: '/desks',
      name: 'desks',
      component: Desks,
      meta: {
        requireAuth: true,
        pageTitle: 'Desks',
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
      component: AdminContactEmail,
      meta: {
        requireAuth: true,
        pageTitle: 'Contact Email Management',
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
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const currentUser = await UserFirestore.getCurrentUser(); // Check custom authen of users.
  const requireAuth = to.matched.some(record => record.meta.requireAuth);
  const requireAdmin = to.matched.some(record => record.meta.adminSite);

  if (requireAuth && currentUser.status !== 'success') {
    next('/sign-in');
  } else if (requireAuth && requireAdmin && !currentUser.isAdmin) {
    next('/home');
  } else {
    next()
  }
  // next();
});

export default router
