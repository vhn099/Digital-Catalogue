import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";

export const FirebaseStorage = {
    getStorageInfo: () => {
        return getStorage();
    },

    uploadFile: async (imageName, imageData, folder) => {
        const storage = getStorage();
        let downloadableURL = '';
        const categoryRef = ref(storage, `${folder}/${imageName}`);
        await uploadBytes(categoryRef, imageData);
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
        downloadableURL = await getDownloadURL(categoryRef);
        return downloadableURL;
    }
};