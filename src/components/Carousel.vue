<template>
    <Galleria :value="sliders" :numVisible="5" containerStyle="max-width: 100%; height: 425px" :showThumbnails="false"
        :showIndicators="true" :circular="true" :autoPlay="true" :transitionInterval="3000"
        :showIndicatorsOnItem="inside" :indicatorsPosition="position">
        <template #item="slotProps">

            <div class="slideshow-canva" :style="{backgroundColor: `${slotProps.item.background_color}`}">
                <div class="slideshow-text">
                    <span class="line-1">{{ slotProps.item.banner_title }}</span>
                    <span class="line-2">{{ slotProps.item.banner_description }}</span>
                    <Button @click="viewDeck" label="View Deck" />
                </div>
                <div class="slideshow-image">
                    <img draggable="false" height="100%" fill="none" :src="slotProps.item.image" />
                </div>
            </div>

            <!-- <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block" /> -->
        </template>
        <!-- <template #caption="slotProps">
            <div class="text-xl mb-2 font-bold">{{ slotProps.item.title }}</div>
            <p class="text-white">{{ slotProps.item.alt }}</p>
        </template> -->
    </Galleria>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Galleria from 'primevue/galleria';
import Button from 'primevue/button';
import router from "@/router";

import CapImage from '@/assets/img/carousel/CAP.png';
import CarltonImage from '@/assets/img/carousel/CARLTON DRAUGHT _ESKY - 2 - CUB-CND-1004 1.png';
import PepsiShirtImage from '@/assets/img/carousel/Pepsi_Shirt.png';
import { OtherConfigFirestore } from "@/lib/OtherConfig";

const position = ref('bottom');
// const images = [
//     {
//         itemImageSrc: CapImage,
//         alt: 'Description for Image 1',
//         title: 'Title 1'
//     },
//     {
//         itemImageSrc: CarltonImage,
//         alt: 'Description for Image 1',
//         title: 'Title 2'
//     },
//     {
//         itemImageSrc: PepsiShirtImage,
//         alt: 'Description for Image 1',
//         title: 'Title 3',
//         backgroundColor: ''
//     }
// ];
const sliders = ref();
const inside = ref(true);

/* FUNCTIONS START */
const viewDeck = () => {
    router.push({
        name: 'decks'
    });
};
const getHomeSliders = async () => {
    const sliderList = [];
    (await OtherConfigFirestore.getHomeSliders()).forEach(slider => {
        const data = slider.data();
        const object = {
            image: data.image,
            banner_title: data.banner_title,
            banner_description: data.banner_description,
            background_color: data.background_color,
        };
        sliderList.push(object);
    });
    return sliderList;
};
/* FUNCTIONS END */


onMounted(async () => {
    sliders.value = await getHomeSliders();
});
</script>

<style scoped>
:deep(.p-galleria-indicator-list) {
    background: none !important;
}

:deep(.p-galleria-content) {
    height: 425px;
}

:deep(.p-galleria-items-container) {
    height: 425px;
}

:deep(.p-galleria-caption) {
    background: none;
}

.p-galleria {
    border: none;
    border-radius: 0;
}

.slideshow-canva {
    width: 100%;
    height: 100%;
    padding-left: 10%;
    background-color: aliceblue;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.slideshow-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.slideshow-text .line-1 {
    font-size: 58px;
    font-weight: 700;
    line-height: 87px;
    text-align: left;
    color: white;
}

.slideshow-text .line-2 {
    font-size: 32px;
    font-weight: 500;
    line-height: 48px;
    text-align: left;
    color: white;
}

.slideshow-text button {
    border: 5px solid #FFFFFF;
    width: 30%;
}

.slideshow-text button::hover {
    border: 5px solid #FFFFFF;
    width: 30%;
}

:deep(.p-button:not(:disabled):hover) {
    border: 5px solid #FFFFFF;
    width: 30%;
}

.slideshow-image {
    justify-content: flex-end;
}

.pedding-border {
    width: 10%;
}
</style>
