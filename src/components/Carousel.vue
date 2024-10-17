<template>

    <Galleria :value="images" :numVisible="5" containerStyle="max-width: 100%; height: 350px" :showThumbnails="false"
        :showIndicators="true" :circular="true" :autoPlay="true" :transitionInterval="3000"
        :showIndicatorsOnItem="inside" :indicatorsPosition="position">
        <template #item="slotProps">
            <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block" />
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
const position = ref('bottom');
const images = [
    {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria1.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria1s.jpg',
        alt: 'Description for Image 1',
        title: 'Title 1'
    }, {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria2.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria1s.jpg',
        alt: 'Description for Image 1',
        title: 'Title 2'
    }, {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria3.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria1s.jpg',
        alt: 'Description for Image 1',
        title: 'Title 3'
    }, {
        itemImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria4.jpg',
        thumbnailImageSrc: 'https://primefaces.org/cdn/primevue/images/galleria/galleria1s.jpg',
        alt: 'Description for Image 1',
        title: 'Title 4'
    },
];
const inside = ref(true);

</script>

<style scoped>
:deep(.p-galleria-indicator-list) {
    background: none !important;
}

:deep(.p-galleria-content) {
    height: 350px;
}

:deep(.p-galleria-items-container) {
    height: 350px;
}

:deep(.p-galleria-caption) {
    background: none;
}

.p-galleria {
    border: none;
    border-radius: 0;
}


</style>
