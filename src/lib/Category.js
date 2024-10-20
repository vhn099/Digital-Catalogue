import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { useAppStore } from "@/stores";

export const CategoryFirestore = {
  async getCategories() {
    const db = collection(
      getFirestore(),
      useAppStore().getCategoriesCollection
    );
    let snapshot = await getDocs(db);

    return snapshot.docs;
  },

  async createCategory(categoryForm) {
    console.log("createCategory:", categoryForm);
    const result = {
      status: "success",
      message: "",
      data: {},
    };

    try {
      // Set user with custom sys_id in firestore
      const colRef = collection(
        getFirestore(),
        useAppStore().getCategoriesCollection
      );
      const dataObj = categoryForm;

      await addDoc(colRef, dataObj).then(async (response) => {
        result.message = `Created category with ${result.data.name}`;
      });
    } catch (error) {
      result.status = "error";
      result.message = error.message;
    }

    return result;
  },

  async updateCategory(categoryForm) {
    console.log("updateCategory:", categoryForm);
    const db = collection(
      getFirestore(),
      useAppStore().getCategoriesCollection
    );
    const result = {
      status: "success",
      message: "",
      data: {},
    };

    try {
      const docRef = getDoc(doc(db, categoryForm.id));
      if ((await docRef).exists()) {
        console.log(categoryForm, "CATEGORY FORM");

        await updateDoc(doc(db, categoryForm.id), {
          name: categoryForm.name || "",
          image: categoryForm.image || "",
          updated: categoryForm.updated,
          updated_by: categoryForm.updated_by,
        }).then((response) => {
          result.message = `Update category with name ${categoryForm.name} successfully`;
        });
      } else {
        result.message = `Name ${categoryForm.name} is not existed`;
        result.status = "warning";
      }
    } catch (error) {
      result.status = "error";
      result.message = error.message;
    }

    return result;
  },

  async deleteCategory(id) {
    console.log("deleteCategory:", id);
    const result = {
      status: "success",
      message: "",
      data: {},
    };

    try {
      await deleteDoc(
        doc(getFirestore(), useAppStore().getCategoriesCollection, id)
      ).then((response) => {
        result.message = `Delete category successfully`;
      });
    } catch (error) {
      result.status = "error";
      result.message = error.message;
    }

    return result;
  },
};
