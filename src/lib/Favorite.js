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
  
  export const DeckFirestore = {
    // get deck base on ID
    async getDeck(id) {
      const docSnap = await getDoc(
        doc(getFirestore(), useAppStore().getDecksCollection, id)
      );
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return "Deck does not exsist";
      }
    },
     //get user name base on ID
     async getUserName(id) {
        const docSnap = await getDoc(
            doc(getFirestore(), useAppStore().getUsersCollection, id)
          );
          if (docSnap.exists()) {
            return docSnap.data().firstname + " "  + docSnap.data().lastname;
          } else {
            return "User does not exsist";
          }
    },
  
    async getDecks() {
      const db = collection(getFirestore(), useAppStore().getDecksCollection);
      let snapshot = await getDocs(query(db, orderBy('updated', 'desc')));
  
      return snapshot.docs;
    },
  
    async createDeck(deckForm) {
      const result = {
        status: "success",
        message: "",
        data: {},
      };
  
      try {
        // Set user with custom sys_id in firestore
        const colRef = collection(
          getFirestore(),
          useAppStore().getDecksCollection
        );
        const dataObj = deckForm;
  
        await addDoc(colRef, dataObj).then(async (response) => {
          result.message = useAppStore().getMessageMaster.DATA(
            dataObj.title
          ).DECK_CREATED;
        });
      } catch (error) {
        result.status = "error";
        result.message = error.message;
      }
  
      return result;
    },
  
    async updateDeck(deckForm) {
      const db = collection(getFirestore(), useAppStore().getDecksCollection);
      const result = {
        status: "success",
        message: "",
        data: {},
      };
  
      try {
        const docRef = getDoc(doc(db, deckForm.id));
        if ((await docRef).exists()) {
          await updateDoc(doc(db, deckForm.id), {
            title: deckForm.title || "",
            detail_description: deckForm.detail_description || "",
            category_id: deckForm.category_id || "",
            deck_highlight: deckForm.deck_highlight || "",
            deck_highlight_name: deckForm.deck_highlight_name || "",
            deck_images: deckForm.deck_images || [],
            pdf: deckForm.pdf || "",
            tag: deckForm.tag || [],
            updated: deckForm.updated,
            updated_by: deckForm.updated_by,
          }).then((response) => {
            result.message = useAppStore().getMessageMaster.DATA(
              deckForm.title
            ).DECK_UPDATED;
          });
        } else {
          result.message = useAppStore().getMessageMaster.DATA(
            deckForm.title
          ).DECK_NOT_EXISTED;
          result.status = "warning";
        }
      } catch (error) {
        result.status = "error";
        result.message = error.message;
      }
  
      return result;
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
  