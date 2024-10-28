import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";

export const FirebaseStorage = {
    getStorageInfo: () => {
        return getStorage();
    },

    checkFileExists: async (folder, imageName) => {
        const storage = getStorage();
        const imageRef = ref(storage, `${folder}/${imageName}`);
        let result = true;
        try {
            await getDownloadURL(imageRef);
        } catch (error) {
            result = false;
        }
        return result;
    },

    uploadFile: async (imageName, imageData, folder) => {
        const storage = getStorage();
        let downloadableURL = '';
        const fileRef = ref(storage, `${folder}/${imageName}`);
        await uploadBytes(fileRef, imageData);
        // Keep this code if we want to show image uploading progress
        // const uploadTask = uploadBytesResumable(categoryRef, imageData);
        // await uploadTask.on('state_changed', (snapshot) => {
        //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //     console.log('Upload is ' + progress + '% done');

        //     switch (snapshot.state) {
        //         case 'paused':
        //             console.log('Upload is paused');
        //             break;
        //         case 'running':
        //             console.log('Upload is running');
        //             break;
        //     }
        // }, (error) => {
        //   console.log(error);  
        // });
        downloadableURL = await getDownloadURL(fileRef);
        return downloadableURL;
    },
    deleteFile: async (folder, imageName) => {
        const storage = getStorage();
        const imageRef = ref(storage, `${folder}/${imageName}`);
        let result = {
            message: 'Deleted file successfully',
            deleted: false
        };

        if (!folder || !imageName) {
            result.message = "No folder name or file name specified to delete";
        } else {
            await deleteObject(imageRef).then(() => {
                result.deleted = true;
            }).catch(error => {
                result.message = error.message;
            });
        }      
        return result;
    },
};