<template>
    <Galleria :value="sliders" :numVisible="5" containerStyle="max-width: 100%; height: 425px" :showThumbnails="false"
        :showIndicators="true" :circular="true" :autoPlay="true" :transitionInterval="3000"
        :showIndicatorsOnItem="inside" :indicatorsPosition="position">
        <template #item="slotProps">

            <div class="slideshow-canva" :style="{ background: `${slotProps.item.background_color}` }">
                <div class="slideshow-text">
                    <span class="line-1">{{ slotProps.item.banner_title }}</span>
                    <span class="line-2">{{ slotProps.item.banner_description }}</span>
                    <Button class="button-view-deck" @click="viewDeck(slotProps.item.view_deck_url)"
                        label="View Deck" />
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

import { OtherConfigFirestore } from "@/lib/OtherConfig";

const position = ref('bottom');
const sliders = ref();
const inside = ref(true);

// Control view deck URL set Home Slider manage because users can put different URL in this and we need to restrict this
const arrayDomain = [
    "http://localhost:3000/",
    "https://digital-catalogue-15dcb.web.app/",
    "https://admgroupinnovationportal.com/"
];

/* FUNCTIONS START */
const viewDeck = (url) => {
    if (url) {
        let domainIndex = -1;
        arrayDomain.forEach((element, index) => {
            if (url.indexOf(element) !== -1) {
                domainIndex = index;
            }
        });
        if (domainIndex !== -1) {
            const arrayURLs = url.split(arrayDomain[domainIndex]);
            const route = arrayURLs[1];
            if (route) { // If url is directed to other pages like: https://domain.com/deck/:deckID. If our domain like this it will runs into error https://domain.com
                router.push({
                    path: route
                });
            }
        }
    }
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
            view_deck_url: data.view_deck_url
        };
        if (object.background_color.indexOf(";") !== -1) {
            object.background_color = object.background_color.replaceAll(";", ""); // Putting ; inside this property will break CSS and it won't run the dynamic style
        }
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
    padding-bottom: 20px;
}

.slideshow-text button {
    border: 3px solid #FFFFFF;
    width: 30%;
    background: transparent;
    width: 200px;
}

.slideshow-text button::hover {
    border: 3px solid #FFFFFF;
    width: 200px;
}

:deep(.p-button:not(:disabled):hover) {
    border: 3px solid #FFFFFF;
    width: 200px;
}

.slideshow-image {
    justify-content: flex-end;
}

.pedding-border {
    width: 10%;
}
</style>
