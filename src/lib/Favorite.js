import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { useAppStore } from "@/stores";

export const FavoriteFirestore = {
  async favoriteFn(userID, deckID) {
    const isFavorite = await this.isFavorite(userID, deckID);
    const favCollection = collection(getFirestore(), useAppStore().getFavoriteCollection);
    if (isFavorite == true) {
      await this.deleteFav(userID, deckID);
    }
    else {
      const favRecord = {
        userID: userID,
        deckID: deckID,
        created: Timestamp.now().toDate(),
      }
      await addDoc(favCollection, favRecord);
    }

    /* RE-CALCULATE FAVORITE OF A DECK */
    const favQuery = query(favCollection, where("deckID", "==", deckID));
    const favDocs = await getCountFromServer(favQuery);
    const deckCollection = collection(getFirestore(), useAppStore().getDecksCollection);
    const deckRef = getDoc(doc(deckCollection, deckID));
    if ((await deckRef).exists()) {
      await updateDoc(doc(deckCollection, deckID), {
        favorite_count: favDocs.data().count
      }).catch(error => {
        console.log(error);
      });
    }

  },
  async getFavorites() {
    const db = collection(getFirestore(), useAppStore().getFavoriteCollection);
    let snapshot = await getDocs(db);
    return snapshot.docs;
  },
  async isFavorite(userID, deckID) {
    const db = collection(getFirestore(), useAppStore().getFavoriteCollection);
    const userQuery = query(db, where('userID', "==", userID), where('deckID', "==", deckID));
    const userDoc = await getDocs(userQuery);

    if (userDoc.docs.length > 0) {
      return true;
    } else {
      return false;
    }
  },
  async deleteFav(userID, deckID, deckDeleted) {
    const listID = [];
    const db = collection(getFirestore(), useAppStore().getFavoriteCollection);
    const favQuery = query(db, deckDeleted ? '' : where('userID', "==", userID), where('deckID', "==", deckID));
    const favDoc = await getDocs(favQuery);
    favDoc.forEach(async fav => {
      await this.delete(fav.id);
    });
  },

  async delete(id) {
    const result = {
      status: "success",
      message: "",
      data: {},
    };

    try {
      await deleteDoc(
        doc(getFirestore(), useAppStore().getFavoriteCollection, id)
      ).then((response) => {
        result.message =
          useAppStore().getMessageMaster.DATA("").FAV_DELETED;
      });
    } catch (error) {
      result.status = "error";
      result.message = error.message;
    }

    return result;
  },

  async countFavoriteDecks(deck_id) {
    const db = collection(getFirestore(), useAppStore().getFavoriteCollection);
    const q = query(db, where("deckID", "==", deck_id));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  },
};
