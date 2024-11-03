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
import { FavoriteFirestore } from "./Favorite";

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

  // async getLimitDecks(cateID, lim, lastDeck) {
  //   const db = collection(getFirestore(), useAppStore().getDecksCollection);
  //   let docQuery = "";
  //   if (lastDeck) { // get next {limit} doc
  //     docQuery = cateID
  //       ? query(
  //         db,
  //         orderBy("catalogue_edition", "desc"),
  //         where("category_id", "==", cateID),
  //         startAfter(lastDeck),
  //         limit(lim)
  //       )
  //       : query(
  //         db,
  //         orderBy("catalogue_edition", "desc"),
  //         startAfter(lastDeck),
  //         limit(lim)
  //       );
  //   } else { // get first {limit} doc
  //     docQuery = cateID
  //       ? query(
  //         db,
  //         orderBy("catalogue_edition", "desc"),
  //         where("category_id", "==", cateID),
  //         limit(lim)
  //       )
  //       : query(db, orderBy("catalogue_edition", "desc"), limit(lim));
  //   }
  //   let snapshot = await getDocs(docQuery);

  //   return snapshot.docs;
  // },

  async getLimitDecks(order, filter, lim, lastDeck) {
    const order_by = order.split('-');
    const tag_filter = filter.tag;
    const category_filter = filter.category;
    const db = collection(getFirestore(), useAppStore().getDecksCollection);
    let docQuery = query(db, orderBy(order_by[0], order_by[1]));
    if (tag_filter) {
      docQuery = query(docQuery, where("tag", "array-contains-any", tag_filter.split(',')));
    }
    if (category_filter.length > 0) {
      docQuery = query(docQuery, where("category_id", "in", category_filter));
    }
    if (lastDeck) {
      docQuery = query(docQuery, startAfter(lastDeck), limit(lim));
    } else {
      docQuery = query(docQuery, limit(lim));
    }
    let snapshot = await getDocs(docQuery);

    return snapshot.docs;
  },

  // Process file handler for deck highlight images and deck sub images and deck pdf file
  async removeOldFile(folder, fileName) {
    const existedPdfFile = await FirebaseStorage.checkFileExists(folder, fileName);
    let result = {
      success: true,
      message: ''
    };
    if (existedPdfFile) {
      const deleted = await FirebaseStorage.deleteFile(folder, fileName);
      if (!deleted.deleted) {
        result.success = false;
        result.message = deleted.message;
      }
    }
    return result;
  },
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

    // There is deleted old files in sub images (pdf file and highlight is not done yet)
    if (deckForm.deleted_sub_images) {
      if (deckForm.deleted_sub_images.length > 0) {
        for (let i = 0 ; i < deckForm.deleted_sub_images.length; i++) {
          const result = await FirebaseStorage.deleteFile("deck/images", deckForm.deleted_sub_images[i].name_id);
          if (!result.deleted) {
            return {
              success: false,
              message: result.message
            }
          }
        }
      }
    }

    // There is changes like add new images or replace the old ones with new ones. this logic will catch it and process it
    if (deckForm.images.length != 0) {
      for (let i = 0; i < deckForm.images.length; i++) {
        const folder = deckForm.images[i].type === "pdfFile" ? "deck/pdf" : "deck/images";
        let downloadURL = "";
        let resultCheckingFile = {}

        if (deckForm.images[i].type === 'pdfFile') { // If user action is to replace the pdf file with new ones then we must remove the old file then add the new one.
          if (deckForm.pdf_name_id) {
            resultCheckingFile = await this.removeOldFile(folder, deckForm.pdf_name_id);
            if (!resultCheckingFile.success) {
              return {
                success: false,
                message: resultCheckingFile.message
              }
            }
          }
        } else if (deckForm.images[i].type === 'highlight') { // If user action is to replace the highlight file with new ones then we must remove the old file then add the new one.
          if (deckForm.deck_highlight_name_id) {
            resultCheckingFile = await this.removeOldFile(folder, deckForm.deck_highlight_name_id);
            if (!resultCheckingFile.success) {
              return {
                success: false,
                message: resultCheckingFile.message
              }
            }
          }
        }

        if (deckForm.images[i].isNew) {
          downloadURL = await FirebaseStorage.uploadFile(deckForm.images[i].file_name_id, deckForm.images[i].file_data, folder);
        } else {
          downloadURL = deckForm.images[i].file_data.objectURL;
        }
        if (deckForm.images[i].type === 'pdfFile') {
          pdfFile.downloadURL = downloadURL;
          pdfFile.fileName = deckForm.images[i].file_name;
          pdfFile.fileNameID = deckForm.images[i].file_name_id;
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
    return {
      pdfFile: pdfFile,
      highlight: highlight,
      subImages: subImages,
      success: true,
      message: ''
    }
  },

  async createDeck(deckForm) {
    const result = {
      status: "success",
      message: "",
      data: {},
    };

    try {
      const fileHandlerResult = await this.fileHandlerInDeck(deckForm);
      if (!fileHandlerResult.success) {
        result.status = "error";
        result.message = fileHandlerResult.message;
        return result;
      }

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
        /* DECK PDF FILE */
        pdf: fileHandlerResult.pdfFile.downloadURL || deckForm.pdf,
        pdf_name: fileHandlerResult.pdfFile.fileName || deckForm.pdf_name,
        pdf_name_id: fileHandlerResult.pdfFile.fileNameID || deckForm.pdf_name_id,

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
        if (!fileHandlerResult.success) {
          result.status = "error";
          result.message = fileHandlerResult.message;
          return result;
        }
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
          /* DECK PDF FILE */
          pdf: fileHandlerResult.pdfFile.downloadURL || deckForm.pdf,
          pdf_name: fileHandlerResult.pdfFile.fileName || deckForm.pdf_name,
          pdf_name_id: fileHandlerResult.pdfFile.fileNameID || deckForm.pdf_name_id,

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
      const pdfFolder = "deck/pdf";

      deckImages.push({
        folder: imageFolder,
        name: deckData.deck_highlight_name_id
      });
      deckImages.push({
        folder: pdfFolder,
        name: deckData.pdf_name_id
      });

      deckData.deck_images.forEach(image => {
        deckImages.push({
          folder: imageFolder,
          name: image.name_id
        });
      });

      deckImages.forEach(async image => {
        const deleted = await FirebaseStorage.deleteFile(image.folder, image.name);
        if (!deleted.deleted) {
          result.status = "error";
          result.message = deleted.message;
          return result;
        }
      });
      await deleteDoc(
        doc(getFirestore(), useAppStore().getDecksCollection, deckData.id)
      ).then((response) => {
        result.message = useAppStore().getMessageMaster.DATA("").DECK_DELETED;
      });
      //Delete Favorite
      FavoriteFirestore.deleteFav('', deckData.id, true);
    } catch (error) {
      result.status = "error";
      result.message = error.message;
    }

    return result;
  },
};
