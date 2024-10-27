import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";

import { useAppStore } from "@/stores";
import { FirebaseStorage } from "./Storage";

export const DeckFirestore = {
  // get deck base on ID
  async getDeck(id) {
    const docSnap = await getDoc(
      doc(getFirestore(), useAppStore().getDecksCollection, id)
    );
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return false;
    }
  },

  async getDecks() {
    const db = collection(getFirestore(), useAppStore().getDecksCollection);
    const docQuery = query(db, orderBy("updated", "desc"));
    let snapshot = await getDocs(docQuery);

    return snapshot.docs;
  },

  async getLimitDecks(cateID, lim, lastDeck) {
    const db = collection(getFirestore(), useAppStore().getDecksCollection);
    let docQuery = "";
    if (lastDeck) { // get next {limit} doc
      docQuery = cateID
        ? query(
            db,
            orderBy("updated", "desc"),
            where("category_id", "==", cateID),
            startAfter(lastDeck),
            limit(lim)
          )
        : query(
            db,
            orderBy("updated", "desc"),
            startAfter(lastDeck),
            limit(lim)
          );
    } else { // get first {limit} doc
      docQuery = cateID
        ? query(
            db,
            orderBy("updated", "desc"),
            where("category_id", "==", cateID),
            limit(lim)
          )
        : query(db, orderBy("updated", "desc"), limit(lim));
    }
    let snapshot = await getDocs(docQuery);

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
        let pdfFile = {
          downloadURL: '',
          fileName: ''
        };
        let highlight = {
          downloadURL: '',
          fileName: ''
        };
        let subImages = [];
        // There is changes like add new images or replace the old ones with new ones.
        if (deckForm.images.length != 0) {
          for (let i = 0; i < deckForm.images.length; i++) {
            const folder = deckForm.images[i].type === "pdfFile" ? "deck/pdf" : "deck/images";
            const downloadURL = await FirebaseStorage.uploadFile(deckForm.images[i].file_name, deckForm.images[i].file_data, folder);
            if (deckForm.images[i].type === 'pdfFile') {
              pdfFile.downloadURL = downloadURL;
              pdfFile.fileName = deckForm.images[i].file_name;
            } else if (deckForm.images[i].type === 'highlight') {
              highlight.downloadURL = downloadURL;
              highlight.fileName = deckForm.images[i].file_name;
            } else if (deckForm.images[i].type === 'subImages') {
              subImages.push({
                name: deckForm.images[i].file_name,
                url: downloadURL
              });
            }
          }
        }
        // There is deleted old files in sub images (pdf file and highlight is not done yet)
        if (deckForm.deleted_sub_images) {
          if (deckForm.deleted_sub_images.length > 0) {
            deckForm.deleted_sub_images.forEach(async image => {
              await FirebaseStorage.deleteFile("deck/images", image.name);
            });
          }
        }

        await updateDoc(doc(db, deckForm.id), {
          title: deckForm.title || "",
          detail_description: deckForm.detail_description || "",
          category_id: deckForm.category_id || "",
          deck_highlight: highlight.downloadURL ? highlight.downloadURL : deckForm.deck_highlight,
          deck_highlight_name: highlight.fileName ? highlight.fileName : deckForm.deck_highlight_name,
          deck_images: subImages.length === 0 ? deckForm.deck_images : subImages,
          pdf: pdfFile.downloadURL,
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
      console.log(error);
      result.message = error;
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
