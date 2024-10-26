import { useAppStore } from "@/stores";
import { collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore";

export const OtherConfigFirestore = {
    getHomeSliders: async () => {
        const db = collection(getFirestore(), useAppStore().getHomeSliderCollection);
        const items = await getDocs(query(db, orderBy('order')))
        return items.docs;
    },
};