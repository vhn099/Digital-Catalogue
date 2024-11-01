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

  async getTopDecks() {
    const db = collection(getFirestore(), useAppStore().getDecksCollection);
    let docQuery = query(db, orderBy("catalogue_edition", "desc"), limit(5));
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
          orderBy("catalogue_edition", "desc"),
          where("category_id", "==", cateID),
          startAfter(lastDeck),
          limit(lim)
        )
        : query(
          db,
          orderBy("catalogue_edition", "desc"),
          startAfter(lastDeck),
          limit(lim)
        );
    } else { // get first {limit} doc
      docQuery = cateID
        ? query(
          db,
          orderBy("catalogue_edition", "desc"),
          where("category_id", "==", cateID),
          limit(lim)
        )
        : query(db, orderBy("catalogue_edition", "desc"), limit(lim));
    }
    let snapshot = await getDocs(docQuery);

    return snapshot.docs;
  },

  // Process file handler for deck highlight images and deck sub images and deck pdf file
  async fileHandlerInDeck(deckForm) {
    let pdfFile = {
      downloadURL: '',
      fileName: '',
      fileNameID: '',
    };
    let highlight = {
      downloadURL: '',
      fileName: '',
      fileNameID: '',
    };
    let subImages = [];
    // There is changes like add new images or replace the old ones with new ones. this logic will catch it and process it
    if (deckForm.images.length != 0) {
      for (let i = 0; i < deckForm.images.length; i++) {
        const folder = deckForm.images[i].type === "pdfFile" ? "deck/pdf" : "deck/images";
        let downloadURL = "";
        if (deckForm.images[i].isNew) {
          downloadURL = await FirebaseStorage.uploadFile(deckForm.images[i].file_name_id, deckForm.images[i].file_data, folder);
        } else {
          downloadURL = deckForm.images[i].file_data.objectURL;
        }
        if (deckForm.images[i].type === 'pdfFile') {
          pdfFile.downloadURL = downloadURL;
          pdfFile.fileName = deckForm.images[i].file_name;
          pdfFile.fileNameID = deckForm.images[i].file_name_id
        } else if (deckForm.images[i].type === 'highlight') {
          highlight.downloadURL = downloadURL;
          highlight.fileName = deckForm.images[i].file_name;
          highlight.fileNameID = deckForm.images[i].file_name_id
        } else if (deckForm.images[i].type === 'subImages') {
          subImages.push({
            name: deckForm.images[i].file_name,
            name_id: deckForm.images[i].file_name_id,
            url: downloadURL
          });
        }
      }
    }
    // There is deleted old files in sub images (pdf file and highlight is not done yet)
    if (deckForm.deleted_sub_images) {
      if (deckForm.deleted_sub_images.length > 0) {
        deckForm.deleted_sub_images.forEach(async image => {
          await FirebaseStorage.deleteFile("deck/images", image.name_id);
        });
      }
    }

    return {
      pdfFile: pdfFile,
      highlight: highlight,
      subImages: subImages
    }
  },

  async createDeck(deckForm) {
    const result = {
      status: "success",
      message: "",
      data: {},
    };

    try {
      // Set user with custom sys_id in firestore
      const fileHandlerResult = await this.fileHandlerInDeck(deckForm);


      const colRef = collection(
        getFirestore(),
        useAppStore().getDecksCollection
      );
      const dataObj = {
        title: deckForm.title || "",
          detail_description: deckForm.detail_description || "",
          category_id: deckForm.category_id || "",
          /* DECK HIGHLIGHT */
          deck_highlight: fileHandlerResult.highlight.downloadURL ? fileHandlerResult.highlight.downloadURL : deckForm.deck_highlight,
          deck_highlight_name: fileHandlerResult.highlight.fileName ? fileHandlerResult.highlight.fileName : deckForm.deck_highlight_name,
          deck_highlight_name_id: fileHandlerResult.highlight.fileNameID ? fileHandlerResult.highlight.fileNameID : deckForm.deck_highlight_name_id,
          /* DECK SUBIMAGES */
          deck_images: fileHandlerResult.subImages.length === 0 ? deckForm.deck_images : fileHandlerResult.subImages,
          pdf: fileHandlerResult.pdfFile.downloadURL || deckForm.pdf,
          tag: deckForm.tag || [],
          catalogue_edition: deckForm.catalogue_edition,
          created: deckForm.created,
          created_by: deckForm.created_by,
          updated: deckForm.updated,
          updated_by: deckForm.updated_by,
      };

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
        const fileHandlerResult = await this.fileHandlerInDeck(deckForm);

        await updateDoc(doc(db, deckForm.id), {
          title: deckForm.title || "",
          detail_description: deckForm.detail_description || "",
          category_id: deckForm.category_id || "",
          /* DECK HIGHLIGHT */
          deck_highlight: fileHandlerResult.highlight.downloadURL ? fileHandlerResult.highlight.downloadURL : deckForm.deck_highlight,
          deck_highlight_name: fileHandlerResult.highlight.fileName ? fileHandlerResult.highlight.fileName : deckForm.deck_highlight_name,
          deck_highlight_name_id: fileHandlerResult.highlight.fileNameID ? fileHandlerResult.highlight.fileNameID : deckForm.deck_highlight_name_id,
          /* DECK SUBIMAGES */
          deck_images: fileHandlerResult.subImages.length === 0 ? deckForm.deck_images : fileHandlerResult.subImages,
          pdf: fileHandlerResult.pdfFile.downloadURL || deckForm.pdf,
          tag: deckForm.tag || [],
          catalogue_edition: deckForm.catalogue_edition,
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

  async deleteDeck(deckData) {
    const result = {
      status: "success",
      message: "",
      data: {},
    };

    try {
      const deckImages = [];
      const imageFolder = "deck/images";
      deckImages.push({
        folder: imageFolder,
        name: deckData.deck_highlight_name_id
      });
      deckData.deck_images.forEach(image => {
        deckImages.push({
          folder: imageFolder,
          name: image.name_id
        });
      });

      console.log(deckImages, "DECK IMAGES");
      deckImages.forEach(async image => {
        await FirebaseStorage.deleteFile(image.folder, image.name);
      });
      await deleteDoc(
        doc(getFirestore(), useAppStore().getDecksCollection, deckData.id)
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
