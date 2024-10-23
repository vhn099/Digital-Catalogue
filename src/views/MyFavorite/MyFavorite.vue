<script setup>
// components
import DockItem from '../../components/Dock.vue';
import SectionItem from '../../components/Section.vue'
import MyFavCardItem from '../../components/MyFavCard.vue';
import FavoriteBlackIcon from '@/assets/img/icon/favorite_black.png';

import { ref } from 'vue';
const sectionIcon = FavoriteBlackIcon;
const sectionText = "My Favorite";
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
                <MyFavCardItem title="Placeholder for the product" description="Short detail information about the product"></MyFavCardItem>
                <MyFavCardItem></MyFavCardItem>
                <!-- <MyFavCardItem></MyFavCardItem> -->
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