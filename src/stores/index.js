import { defineStore } from "pinia";
export const useAppStore = defineStore("storeId", {
  state: () => ({
    collections: {
      favorite: "favorite",
      users: "users",
      categories: "category",
      decks: 'decks',
      home_slider: 'home_slider'
    },
    MessageMaster: {
      AUTH: {
        NOT_LOGGED_IN: "User is not logged in to the system",
        BLOCKED: "User's account is blocked",
        NOT_EXISTED_ACCOUNT: "User's account is not existed in the system"
      },
      DATA: (data) => {
        return {
          USER_CREATED: `Created user with email ${data}`,
          USER_EXISTED: `Email ${data} has already existed in the system.`,
          USER_NOT_EXISTED: `Email ${data} is not existed`,
          USER_UPDATE: `Update user with email ${data} successfully`,
          USER_DELETE: `Delete user with email ${data} successfully`,

          CATEGORY_CREATED: `Created category with ${data}`,
          CATEGORY_UPDATED: `Update category with name ${data} successfully`,
          CATEGORY_NOT_EXISTED: `Name ${data} is not existed`,
          CATEGORY_DELETED: "Delete category successfully",

          DECK_CREATED: `Created deck with ${data}`,
          DECK_UPDATED: `Update deck with name ${data} successfully`,
          DECK_NOT_EXISTED: `Name ${data} is not existed`,
          DECK_DELETED: "Delete deck successfully",

          SLIDER_CREATED: "Created slider successfully",
          IMAGE_SLIDER_ERROR: `No images were found during the upload process`,
          SLIDER_DELETED: "Deleted slider successfully",
          SLIDER_UPDATED: "Updated slider successfully"
        }
      },
      ADMIN_SITE: {
        NO_PERMISSION: "You don't have specific roles to make this action"
      }
    },
    DATA: {
      USER_EMAIL_RESET: ''
    }
  }),
  getters: {
    getFavoriteCollection: (state) => {
      return state.collections.favorite;
    },
    getDecksCollection: (state) => {
      return state.collections.decks;
    },
    getUsersCollection: (state) => {
      return state.collections.users;
    },
    getCategoriesCollection: (state) => {
      return state.collections.categories;
    },
    getMessageMaster: (state) => {
      return state.MessageMaster;
    },
    getUserEmailReset: (state) => {
      return state.DATA.USER_EMAIL_RESET;
    },
    getHomeSliderCollection: (state) => {
      return state.collections.home_slider
    }
  },
  actions: {
    setmail(email) {
      this.DATA.USER_EMAIL_RESET = email;
    }
  }
});
