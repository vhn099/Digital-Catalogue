import { defineStore } from "pinia";
export const useAppStore = defineStore("storeId", {
  state: () => ({
    collections: {
      favorite: "favorite",
      users: "users",
      categories: "category",
      decks: 'decks',
      home_slider: "home_slider",
      contact_emails: "contact_emails"
    },
    dateFormats: {
      ADMIN_DECK: "YYYY/MM/DD",
      DECK: "YYYY/MM/DD"
    },
    MessageMaster: {
      AUTH: {
        NOT_LOGGED_IN: "User is not logged in to the system",
        BLOCKED: "User's account is blocked",
        NOT_EXISTED_ACCOUNT: "User's account is not existed in the system"
      },
      DATA: (data) => {
        return {
          /* ADMIN USER */
          USER_CREATED: `Created user with email ${data}`,
          USER_EXISTED: `Email ${data} has already existed in the system.`,
          USER_NOT_EXISTED: `Email ${data} is not existed`,
          USER_UPDATE: `Update user with email ${data} successfully`,
          USER_DELETE: `Delete user with email ${data} successfully`,

          /* ADMIN CATEGORY */
          CATEGORY_CREATED: `Created category with ${data}`,
          CATEGORY_UPDATED: `Update category with name ${data} successfully`,
          CATEGORY_NOT_EXISTED: `Name ${data} is not existed`,
          CATEGORY_DELETED: "Delete category successfully",
          CATEGORY_IMAGE_NOT_FOUND: "This category image has already been deleted or not found in storage",
          CATEGORY_REPLACE_OLD_IMAGE_ERROR: "Can not replace current image with new image at the moment, please contact admin to resolve this",

          /* ADMIN DECK */
          DECK_CREATED: `Created deck with ${data}`,
          DECK_UPDATED: `Update deck with name ${data} successfully`,
          DECK_NOT_EXISTED: `Name ${data} is not existed`,
          DECK_DELETED: "Delete deck successfully",

          /* OTHER CONFIG - HOME SLIDER */
          SLIDER_CREATED: "Created slider successfully",
          IMAGE_SLIDER_ERROR: `No images were found during the upload process`,
          SLIDER_DELETED: "Deleted slider successfully",
          SLIDER_UPDATED: "Updated slider successfully",
          SLIDER_REPLACE_OLD_IMAGE_ERROR: "Can not replace current image with new image at the moment, please contact admin to resolve this",

          /* OTHER CONFIG - EMAIL CONTACT */
          EMAIL_CONTACT_CREATED: `Created contact email ${data} successfully.`,
          EMAIL_CONTACT_EXISTED: `Contact email ${data} has already existed.`,
          EMAIL_CONTACT_UPDATED: `Updated contact email ${data} successfully.`,
          EMAIL_CONTACT_DELETED: `Deleted contact email ${data} successfully.`,
          EMAIL_CONTACT_NOT_EXISTED: `Contact email ${data} is not existed.`,
        }
      },
      ADMIN_SITE: {
        NO_PERMISSION: "You don't have specific roles to make this action"
      }
    },
    DATA: {
      USER_EMAIL_RESET: '',
      DECK_CATEGORY: '',
    }
  }),
  getters: {
    // COLLECTION NAMES
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
    getHomeSliderCollection: (state) => {
      return state.collections.home_slider
    },
    getEmailContactCollection: (state) => {
      return state.collections.contact_emails
    },

    // DATA NAMES
    getUserEmailReset: (state) => {
      return state.DATA.USER_EMAIL_RESET;
    },
    getDeckCategory: (state) => {
      return state.DATA.DECK_CATEGORY;
    },

    // DATE FORMATS
    getDateFormats: (state) => {
      return state.dateFormats;
    }
  },
  actions: {
    setmail(email) {
      this.DATA.USER_EMAIL_RESET = email;
    },
    setDeckCategory(category) {
      this.DATA.DECK_CATEGORY = category;
    }
  }
});
