import { defineStore } from "pinia";
export const useAppStore = defineStore("storeId", {
  state: () => ({
    collections: {
      users: "users",
      categories: "category",
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
    }
  },
  actions: {
    setmail(email) {
      this.DATA.USER_EMAIL_RESET = email;
    }
  }
});
