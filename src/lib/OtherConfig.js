import { useAppStore } from "@/stores";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, updateDoc, where } from "firebase/firestore";
import { FirebaseStorage } from "./Storage";
import _ from 'lodash';

const folderLocation = "home_slider/images";

export const OtherConfigFirestore = {
    /* HOME SLIDER */
    getHomeSliders: async () => {
        const db = collection(getFirestore(), useAppStore().getHomeSliderCollection);
        const items = await getDocs(query(db, orderBy('order')))
        return items.docs;
    },
    addSliders: async (sliderForm) => {
        const db = collection(getFirestore(), useAppStore().getHomeSliderCollection);
        const result = {
            status: 'success',
            message: '',
            data: {}
        };
        try {
            let downloadedURL = "";
            if (!_.isEmpty(sliderForm.image)) {
                downloadedURL = await FirebaseStorage.uploadFile(sliderForm.image.image_name_id, sliderForm.image.image_data, folderLocation);
                const formData = {
                    image: downloadedURL,
                    image_name: sliderForm.image.image_name,
                    image_name_id: sliderForm.image.image_name_id,
                    banner_title: sliderForm.banner_title,
                    banner_description: sliderForm.banner_description,
                    background_color: sliderForm.background_color,
                    view_deck_url: sliderForm.view_deck_url,
                    order: sliderForm.order,
                    created: sliderForm.created,
                    created_by: sliderForm.created_by,
                    updated: sliderForm.updated,
                    updated_by: sliderForm.updated_by
                };

                await addDoc(db, formData).then(async (response) => {
                    result.message = useAppStore().getMessageMaster.DATA("").SLIDER_CREATED;
                });
            } else {
                result.status = 'error';
                result.message = useAppStore().getMessageMaster.DATA("").IMAGE_SLIDER_ERROR;
            }
        } catch (error) {
            result.status = 'error';
            console.log(error);
            result.message = error.message;
        }

        return result;
    },
    updateSlider: async (sliderForm) => {
        const result = {
            status: "success",
            message: "",
            data: {},
        };
        try {
            let downloadedURL = "";
            const db = collection(getFirestore(), useAppStore().getHomeSliderCollection);
            const docRef = doc(db, sliderForm.id);
            const notChoosingImage = _.isEmpty(sliderForm.image);
            if (!notChoosingImage) {
                const checkCurrentFile = await FirebaseStorage.checkFileExists(folderLocation, sliderForm.image_name_id);
                if (checkCurrentFile) {
                    // Delete the old image and replace it with the new one
                    const deleteOldFile = await FirebaseStorage.deleteFile(folderLocation, sliderForm.image_name_id);
                    if (!deleteOldFile.deleted) { // Error happens in replacing old image
                        result.status = "error";
                        result.message = useAppStore().getMessageMaster.DATA("").SLIDER_REPLACE_OLD_IMAGE_ERROR;
                        return result;
                    }
                }
                downloadedURL = await FirebaseStorage.uploadFile(sliderForm.image.image_name_id, sliderForm.image.image_data, folderLocation);
            }
            const formData = {
                image: downloadedURL ? downloadedURL : sliderForm.image_link,
                image_name: notChoosingImage ? sliderForm.image_name : sliderForm.image.image_name,
                image_name_id: notChoosingImage ? sliderForm.image_name_id : sliderForm.image.image_name_id,
                banner_title: sliderForm.banner_title,
                banner_description: sliderForm.banner_description,
                background_color: sliderForm.background_color,
                view_deck_url: sliderForm.view_deck_url,
                order: sliderForm.order,
                updated: sliderForm.updated,
                updated_by: sliderForm.updated_by
            };

            await updateDoc(docRef, formData).then(async (response) => {
                result.message = useAppStore().getMessageMaster.DATA("").SLIDER_UPDATED;
            });
        } catch (error) {
            result.status = 'error';
            console.log(error);
            result.message = error.message;
        }

        return result;
    },
    deleteSlider: async (id, image_name) => {
        const result = {
            status: "success",
            message: "",
            data: {},
        };

        try {
            const deleteResult = await FirebaseStorage.deleteFile(folderLocation, image_name);
            if (deleteResult.deleted) {
                const db = collection(getFirestore(), useAppStore().getHomeSliderCollection);
                const docRef = doc(db, id);
                await deleteDoc(docRef).then((response) => {
                    result.message =
                        useAppStore().getMessageMaster.DATA("").SLIDER_DELETED;
                }).catch(error => {
                    result.status = "error";
                    result.message = error.message;
                });
            } else {
                result.status = "error";
                result.message = deleteResult.message;
            }
        } catch (error) {
            result.status = "error";
            result.message = error.message;
        }

        return result;
    },

    /* EMAIL CONTACT */
    getEmailContacts: async () => {
        const db = collection(getFirestore(), useAppStore().getEmailContactCollection);
        const emailContacts = await getDocs(db);

        return emailContacts.docs;
    },

    addEmailContacts: async (emailContactForm) => {
        const db = collection(getFirestore(), useAppStore().getEmailContactCollection);
        const result = {
            status: 'success',
            message: '',
            data: {}
        };
        try {
            let findEmailContact = await getDocs(query(db, where('email', '==', emailContactForm.email)));
            if (findEmailContact.docs.length === 0) {
                await addDoc(db, emailContactForm).then(async (response) => {
                    result.message = useAppStore().getMessageMaster.DATA(
                        emailContactForm.email
                    ).EMAIL_CONTACT_CREATED;
                });
            } else {
                result.message = useAppStore().getMessageMaster.DATA(emailContactForm.email).EMAIL_CONTACT_EXISTED;
                result.status = 'warn';
            }
        } catch (error) {
            result.status = 'error';
            result.message = error.message;
            console.log(error);
        }
        return result
    },
    updateEmailContacts: async (id, emailContactForm) => {
        const db = collection(getFirestore(), useAppStore().getEmailContactCollection);
        const result = {
            status: 'success',
            message: '',
            data: {}
        };
        try {
            const docRef = getDoc(doc(db, id));
            if ((await docRef).exists()) {
                await updateDoc(doc(db, id), emailContactForm).then((response) => {
                    result.message = useAppStore().getMessageMaster.DATA(
                        emailContactForm.email
                    ).EMAIL_CONTACT_UPDATED;
                });
            } else {
                result.message = useAppStore().getMessageMaster.DATA(
                    emailContactForm.email
                ).EMAIL_CONTACT_NOT_EXISTED;
                result.status = "warning";
            }
        } catch (error) {
            result.status = 'error';
            result.message = error.message;
            console.log(error);
        }
        return result;
    }
};