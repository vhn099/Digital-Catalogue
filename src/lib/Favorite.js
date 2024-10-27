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
  
  export const FavoriteFirestore = {
  
    async getFavorites() {
      const db = collection(getFirestore(), useAppStore().getFavoriteCollection);
      let snapshot = await getDocs(db);
      return snapshot.docs;
    },
  
    async deleteDeck(id) {
      const result = {
        status: "success",
        message: "",
        data: {},
      };
  
      try {
        await deleteDoc(
          doc(getFirestore(), useAppStore().getDecksCollection, id)
        ).then((response) => {
          result.message = useAppStore().getMessageMaster.DATA("").DECK_DELETED;
        });
      } catch (error) {
        result.status = "error";
        result.message = error.message;
      }
  
      return result;
    },
  };
  