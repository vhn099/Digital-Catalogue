import { useAppStore } from "@/stores";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, updateDoc } from "firebase/firestore";
import { FirebaseStorage } from "./Storage";
import _ from 'lodash';

const folderLocation = "home_slider/images";

export const OtherConfigFirestore = {
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
                    image_name_id: sliderForm.image_name_id,
                    banner_title: sliderForm.banner_title,
                    banner_description: sliderForm.banner_description,
                    background_color: sliderForm.background_color,
                    deck_id: sliderForm.deck_id,
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
            if (!_.isEmpty(sliderForm.image)) {
                downloadedURL = await FirebaseStorage.uploadFile(sliderForm.image.image_name_id, sliderForm.image.image_data, folderLocation);
            }
            const formData = {
                image: downloadedURL ? downloadedURL : sliderForm.image_link,
                image_name: sliderForm.image_name,
                image_name_id: sliderForm.sliderForm.image_name,
                banner_title: sliderForm.banner_title,
                banner_description: sliderForm.banner_description,
                background_color: sliderForm.background_color,
                deck_id: sliderForm.deck_id,
                order: sliderForm.order,
                updated: sliderForm.updated,
                updated_by: sliderForm.updated_by
            };

            await updateDoc(docRef, formData).then(async (response) => {
                result.message = useAppStore().getMessageMaster.DATA("").SLIDER_UPDATED;
            });
        } catch (error) {
            result.status = 'error';
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
};