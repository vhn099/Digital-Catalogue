import { collection, getDocs, getFirestore } from "firebase/firestore";

import { useAppStore } from "@/stores";

export const UserFirestore = {
    async getUsers() {
        const db = collection(getFirestore(), useAppStore().getUsersCollection);
        let snapshot = await getDocs(db);
        return snapshot.docs;
    },
};