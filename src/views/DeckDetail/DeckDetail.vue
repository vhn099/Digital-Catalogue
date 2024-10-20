<script setup>
import DockItem from '../../components/Dock.vue';
import SectionItem from '../../components/Section.vue'
import Galleria from 'primevue/galleria';
import { ref, onMounted } from "vue";
onMounted(() => {
    console.log('yo moe m');
});
const sectionIcon = "src/assets/img/homepage/support.png";
const sectionText = "Contact us";

const images = [
    {
        itemImageSrc: '../src/assets/img/carousel/CAP.png',
        thumbnailImageSrc: '../src/assets/img/carousel/CAP.png',
        alt: 'Description for Image 1',
        title: 'Title 1'
    }, {
        itemImageSrc: '../src/assets/img/carousel/CARLTON DRAUGHT _ESKY - 2 - CUB-CND-1004 1.png',
        thumbnailImageSrc: '../src/assets/img/carousel/CARLTON DRAUGHT _ESKY - 2 - CUB-CND-1004 1.png',
        alt: 'Description for Image 1',
        title: 'Title 2'
    }, {
        itemImageSrc: '../src/assets/img/carousel/Pepsi_Shirt.png',
        thumbnailImageSrc: '../src/assets/img/carousel/Pepsi_Shirt.png',
        alt: 'Description for Image 1',
        title: 'Title 3',
        backgroundColor: ''
    }
];

const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);
</script>


<template>
    <DockItem></DockItem>

    <div class="flex">
        <div class="col-1">

        </div>
        <div class="col-11">
            <div class="col-12">
                <SectionItem :icon="sectionIcon" :icon_text="sectionText" line3="true"></SectionItem>
                <div class="flex flex-column">
                    <!-- https://pdfobject.com/guide/quick-start.html -->
                     <div class="deck-canva">
                     <div class="deck-image">
                        <Galleria :value="images" :responsiveOptions="responsiveOptions" :numVisible="5" containerStyle="max-width: 640px"
                            :circular="true" :autoPlay="false" :transitionInterval="3000">
                            <template #item="slotProps">
                                <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block" />
                            </template>
                            <template #thumbnail="slotProps">
                                <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="max-height:100%; max-width:100% ;display: block;" />
                            </template>
                        </Galleria>
                     </div>
                     <div class="deck-info">
                        yo
                     </div>
                     </div>
                    <!-- <PdfObject class="pdf-view" url="https://file-examples.com/storage/feb05093336710053a32bc1/2017/10/file-sample_150kB.pdf" /> -->
                </div>
            </div>

        </div>


    </div>

</template>



<style scoped>
.pdf-view {
    height: 700px;
}

.deck-canva{
    display: flex;
    flex-direction: row;
}

.deck-image {
    background-color: antiquewhite;
}

.deck-info {
    background-color: aqua;
}

:deep(.p-galleria-thumbnail){
    max-width: 80px;
    max-height: 80px;
}
</style>