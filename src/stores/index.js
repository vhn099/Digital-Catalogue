import { defineStore } from "pinia";
export const useAppStore = defineStore("storeId", {
  state: () => ({
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
