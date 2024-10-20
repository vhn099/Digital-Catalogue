import { defineStore } from "pinia";
export const useAppStore = defineStore("storeId", {
  state: () => ({
    collections: {
      users: "users",
      categories: "category",
    },
  }),
  getters: {
    getUsersCollection: (state) => {
      return state.collections.users;
    },
    getCategoriesCollection: (state) => {
      return state.collections.categories;
    },
  },
});
