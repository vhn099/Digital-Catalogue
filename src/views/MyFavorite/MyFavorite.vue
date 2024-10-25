<script setup>
// components
import DockItem from '../../components/Dock.vue';
import SectionItem from '../../components/Section.vue'
import MyFavCardItem from '../../components/MyFavCard.vue';
import FavoriteBlackIcon from '@/assets/img/icon/favorite_black.png';
import { query, collection, getDocs, where } from "firebase/firestore";
import { onMounted, ref } from 'vue';
import { db } from '@/main';
import { useAppStore } from '@/stores';
import { getAuth } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
const sectionIcon = FavoriteBlackIcon;
const sectionText = "My Favorite";
const favorites = ref();
const email = ref('');

const getFavorites = async () => {
    const favoriteList = [];
    const favoriteTable = collection(db, 'favorite');
    const q = query(favoriteTable, where('userID', '==', email.value));
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(obj => {
            const data = obj.data();
            const object = {
                userID: data.userID || '',
                deckID: data.deckID || '',
            };
            favoriteList.push(object);
        });
        return favoriteList;
    } catch (error) {
        console.error('Error checking email:', error);
        return false;
    }

};
const getDeckInfo = async (arr) => {
    for (let i in arr) {
        const deckList = [];
        console.info('deckID: ' + arr[i].deckID);
        const docRef = doc(db, 'decks', arr[i].deckID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(docSnap.data());
        } else {
            console.log('No such document!');
        }

        // const deckTable = collection(db, 'decks');
        // const docRef = getDoc(doc(deckTable, arr[i].deckID));
        // console.info('Error checking email: ' + docRef.data);
    }
};
onMounted(async () => {
    email.value = getAuth().currentUser.email;
    //useAppStore().setmail(email.value);
    favorites.value = await getFavorites();
    getDeckInfo(favorites.value);
    //console.log('123:' + useAppStore().getUserEmailReset);

});
</script>

<template>
    <DockItem></DockItem>

    <div class="flex">
        <div class="col-1">

        </div>
        <div class="col-11">

            <!-- <SectionItem></SectionItem> -->
            <SectionItem :icon="sectionIcon" :icon_text="sectionText"></SectionItem>

            <div class="fav-canva">
                <div v-for="fav in favorites" :key="fav">
                    <MyFavCardItem :title="fav.deckID" :description="fav.userID"></MyFavCardItem>
                </div>
                <MyFavCardItem :isnew="true"></MyFavCardItem>
            </div>
        </div>
    </div>

</template>

<style scoped>
.fav-canva {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
    padding: 10px 0;
}
</style>