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
        result.message = useAppStore().getMessageMaster.DATA(dataObj.name).CATEGORY_CREATED;
      });
    } catch (error) {
      result.status = "error";
      result.message = error.message;
    }

    return result;
  },

  async updateCategory(categoryForm) {
    
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

        await updateDoc(doc(db, categoryForm.id), {
          name: categoryForm.name || "",
          image: categoryForm.image || "",
          image_name: categoryForm.image_name || "",
          updated: categoryForm.updated,
          updated_by: categoryForm.updated_by,
        }).then((response) => {
          result.message = useAppStore().getMessageMaster.DATA(categoryForm.name).CATEGORY_UPDATED;
        });
      } else {
        result.message = useAppStore().getMessageMaster.DATA(categoryForm.name).CATEGORY_NOT_EXISTED;
        result.status = "warning";
      }
    } catch (error) {
      result.status = "error";
      result.message = error.message;
    }

    return result;
  },

  async deleteCategory(id) {
    const result = {
      status: "success",
      message: "",
      data: {},
    };

    try {
      await deleteDoc(
        doc(getFirestore(), useAppStore().getCategoriesCollection, id)
      ).then((response) => {
        result.message = useAppStore().getMessageMaster.DATA("").CATEGORY_DELETED;
      });
    } catch (error) {
      result.status = "error";
      result.message = error.message;
    }

    return result;
  },
};
