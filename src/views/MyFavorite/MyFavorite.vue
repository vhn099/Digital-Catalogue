<script setup>
// components
import DockItem from '../../components/Dock.vue';
import SectionItem from '../../components/Section.vue'
import MyFavCardItem from '../../components/MyFavCard.vue';
import FavoriteBlackIcon from '@/assets/img/icon/favorite_black.png';
import { query, collection, getDocs, where, getDoc, doc, deleteDoc } from "firebase/firestore";
import { onMounted, ref } from 'vue';
import { db } from '@/main';
import { getAuth } from 'firebase/auth';
const sectionIcon = FavoriteBlackIcon;
const sectionText = "My Favorite";
const favorites = ref([]);
const email = ref('');
const decks = ref([]);

const deleteFav = async (id) => {
    const documentRef = doc(db, 'favorite', id);
    try {
        await deleteDoc(documentRef);
    } catch (error) {
        console.error('Error:', error);
    }
    decks.value = decks.value.filter((deck) => deck.fav_id != id);
};

const getFavorites = async () => {
    const favoriteTable = collection(db, 'favorite');
    const q = query(favoriteTable, where('userID', '==', email.value));
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(obj => {
            const data = obj.data();
            const object = {
                favID: obj.id,
                //userID: data.userID || '',
                deckID: data.deckID || '',
            };
            favorites.value.push(object);
        });
        //return favoriteList;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }

};
const getDeckInfo = async (arr) => {
    const promises = arr.map(async (fav) => {
        const docRef = doc(db, 'decks', fav.deckID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const obj = {
                fav_id: fav.favID,
                deck_id: fav.deckID,
                deck_image: docSnap.data().deck_highlight || '',
                deck_name: docSnap.data().title || '',
                deck_description: docSnap.data().detail_description || '',
                deck_tag: docSnap.data().tag || '',
            }
            decks.value.push(obj);
        }
    });
    // const results = await Promise.all(promises);
    // decks.value = results.filter(doc => doc !== null);
};

onMounted(async () => {
    email.value = getAuth().currentUser.email;
    await getFavorites();
    getDeckInfo(favorites.value);
});
</script>

<template>
    <DockItem></DockItem>

    <div class="flex min-height-750">
        <div class="col-1">

        </div>
        <div class="col-11">

            <!-- <SectionItem></SectionItem> -->
            <SectionItem :icon="sectionIcon" :icon_text="sectionText"></SectionItem>

            <div class="fav-canva">
                <div v-for="fav in decks" :key="fav">
                    <MyFavCardItem :fav_id="fav.fav_id" :tag_arr="fav.deck_tag" :deck_img="fav.deck_image"
                        :title="fav.deck_name" :description="fav.deck_description" :deck_id="fav.deck_id" @callFunction="deleteFav">
                    </MyFavCardItem>
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
