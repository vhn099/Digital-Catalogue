import { defineStore } from "pinia";
import bootstrap from "bootstrap/dist/js/bootstrap.min.js";
export const useAppStore = defineStore("storeId", {
  state: () => ({
    bootstrap,
    collections: {
      users: 'users'
    }
  }),
  getters: {
    getUsersCollection: state => {
      return state.collections.users
    }
  }
});
