import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { useAppStore } from "@/stores";
import { FirebaseStorage } from "./Storage";
import _ from 'lodash';

const folder = "category";

export const CategoryFirestore = {
  async getCategoryName(id) {
    const docSnap = await getDoc(
      doc(getFirestore(), useAppStore().getCategoriesCollection, id)
    );
    if (docSnap.exists()) {
      return docSnap.data().name;
    } else {
      return "Category does not exsist";
    }
  },

  async getCategories() {
    const db = collection(
      getFirestore(),
      useAppStore().getCategoriesCollection
    );
    let snapshot = await getDocs(query(db, orderBy('updated', 'desc')));

    return snapshot.docs;
  },

  async fileHandler(fileName, fileData) {
    let downloadURL = "";
    downloadURL = await FirebaseStorage.uploadFile(fileName, fileData, folder);
    return downloadURL;
  },

  async createCategory(categoryForm, categoryImage) {
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

      if (!_.isEmpty(categoryImage)) {
        categoryForm.image = await this.fileHandler(categoryImage.file_name_id, categoryImage.file_data);
        categoryForm.image_name = categoryImage.file_name;
        categoryForm.image_name_id = categoryImage.file_name_id;
      }

      const dataObj = categoryForm;

      await addDoc(colRef, dataObj).then(async (response) => {
        result.message = useAppStore().getMessageMaster.DATA(
          dataObj.name
        ).CATEGORY_CREATED;
      });
    } catch (error) {
      result.status = "error";
      result.message = error.message;
    }

    return result;
  },

  async updateCategory(categoryForm, categoryImage) {
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
      if (!_.isEmpty(categoryImage)) {
        const checkCurrentFile = await FirebaseStorage.checkFileExists(folder, categoryForm.image_name_id);
        if(checkCurrentFile) {
          // Each category must have image when they are created successful which means when users update images will remove the old image and replace it with new image
          const deleteOldFile = await FirebaseStorage.deleteFile(folder, categoryForm.image_name_id);
          if (!deleteOldFile.deleted) { // Error happens in replacing old image
            result.status = "error";
            result.message = useAppStore().getMessageMaster.DATA("").CATEGORY_REPLACE_OLD_IMAGE_ERROR;
            return result;
          }
        }
        categoryForm.image = await this.fileHandler(categoryImage.file_name_id, categoryImage.file_data);
        categoryForm.image_name = categoryImage.file_name;
        categoryForm.image_name_id = categoryImage.file_name_id;
      }
      if ((await docRef).exists()) {
        await updateDoc(doc(db, categoryForm.id), {
          name: categoryForm.name || "",
          image: categoryForm.image || "",
          image_name: categoryForm.image_name || "",
          image_name_id: categoryForm.image_name_id || "",
          updated: categoryForm.updated,
          updated_by: categoryForm.updated_by,
        }).then((response) => {
          result.message = useAppStore().getMessageMaster.DATA(
            categoryForm.name
          ).CATEGORY_UPDATED;
        });
      } else {
        result.message = useAppStore().getMessageMaster.DATA(
          categoryForm.name
        ).CATEGORY_NOT_EXISTED;
        result.status = "warning";
      }
    } catch (error) {
      result.status = "error";
      result.message = error.message;
    }

    return result;
  },

  async deleteCategory(id, fileNameID) {
    const result = {
      status: "success",
      message: "",
      data: {},
    };

    try {
      const q = query(collection(getFirestore(), useAppStore().getDecksCollection), where('category_id', '==', id))
      const deck = await getDocs(q);
      if (deck.docs.length > 0) { // If category has deck. dont allow to delete
        result.message = "This Category is using in Deck";
        result.status = 'error'
      } else {
        const deleted = await FirebaseStorage.deleteFile(folder, fileNameID);
        if (deleted.deleted) {
          await deleteDoc(
            doc(getFirestore(), useAppStore().getCategoriesCollection, id)
          ).then((response) => {
            result.message = useAppStore().getMessageMaster.DATA("").CATEGORY_DELETED;
          });
        } else {
          result.message = useAppStore().getMessageMaster.DATA("").CATEGORY_IMAGE_NOT_FOUND;
          result.status = 'error'
        }
      }
    } catch (error) {
      result.status = "error";
      result.message = error.message;
    }

    return result;
  },
};
