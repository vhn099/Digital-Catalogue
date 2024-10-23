<script setup>
import DockItem from '../../components/Dock.vue';
import SectionItem from '../../components/Section.vue'
import Galleria from 'primevue/galleria';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import { ref, onMounted } from "vue";
import SectionIcon from '@/assets/img/homepage/support.png';

onMounted(() => {
    console.log('yo moe m');
});
const sectionIcon = SectionIcon;
const sectionText = "Contact us";
const isViewDeck = ref(false);

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
function viewDeck() {
    isViewDeck.value = true;
}
</script>

<template>
    <DockItem></DockItem>

    <div class="flex">
        <div class="col-1">

        </div>
        <div class="col-11">
            <SectionItem :icon="sectionIcon" :icon_text="sectionText" line3="true"></SectionItem>

            <!-- https://pdfobject.com/guide/quick-start.html -->
            <div v-if="!isViewDeck" class="deck-canva">
                <div class="deck-image">
                    <Galleria :value="images" :responsiveOptions="responsiveOptions" :numVisible="5"
                        containerStyle="max-width: 640px" :circular="true" :autoPlay="false" :transitionInterval="3000">
                        <template #item="slotProps">
                            <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt"
                                style="width: 100%; display: block" />
                        </template>
                        <template #thumbnail="slotProps">
                            <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt"
                                style="max-height:100%; max-width:100% ;display: block;" />
                        </template>
                    </Galleria>
                </div>
                <div class="deck-info">
                    <div class="deck-title">
                        <div class="deck-title-left">
                            <span style="font-size: 40px;font-weight: 500;">Placeholder for the title</span>
                        </div>
                        <div class="deck-title-right">
                            <div class="button-like">

                                <Button severity="secondary" label="Favourite" @click="viewDeck()">
                                    <img width="40" height="40" fill="none"
                                        src="../../assets/img/icon/search_file.png" />
                                    <label>View Deck</label>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div class="deck-fav-button">
                        <Button label="Favourite">
                            <img width="23" height="23" fill="none" src="../../assets/img/icon/favorite_white.png" />
                            <label>Add to my Favorite</label>
                        </Button>
                    </div>
                    <div class="deck-description">
                        <p>
                            Crafted from high-quality stainless steel, the Ultimate Ice Bucket offers excellent
                            insulation, keeping ice
                            frozen for hours. Its double-walled construction prevents condensation, ensuring your table
                            or countertop
                            stays dry while maintaining a sleek, polished look.

                            The bucket's large capacity makes it ideal for serving beverages, from chilled wines and
                            champagnes to sodas
                            and cocktails.
                        </p>
                    </div>
                    <div class="deck-tags">
                        <Tag severity="secondary" value="#news"></Tag>
                        <Tag severity="secondary" value="#news"></Tag>
                        <Tag severity="secondary" value="#news"></Tag>
                    </div>
                </div>
            </div>
            <div v-if="isViewDeck" class="pdf-canva">
                <div class="pdf-fav-button">
                    <Button label="Favourite">
                        <img width="23" height="23" fill="none" src="../../assets/img/icon/favorite_white.png" />
                        <label>Add to my Favorite</label>
                    </Button>
                </div>
                <div class="pdf-place">
                    <PdfObject class="pdf-view"
                        url="https://file-examples.com/storage/feb05093336710053a32bc1/2017/10/file-sample_150kB.pdf" />
                </div>
            </div>
        </div>


    </div>

</template>



<style scoped>
.pdf-place {
    padding-top: 10px;
}

.pdf-view {
    height: 800px;
}

.pdf-fav-button {
    /* align-items: end; */
    display: flex;
    justify-content: end;
}

@media (max-width: 992px) {
    .deck-canva {
        flex-direction: column !important;
        /* width: 100%; */
    }

    .deck-info {
        width: 100% !important;
    }

    .deck-image {
        width: 100% !important;
    }
}

.deck-canva {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    width: 100%;
    /* min-height: 700px; */
    /* background-color: blue; */

    .deck-image {
        width: 50%;
        background-color: antiquewhite;
    }

    .deck-info {
        width: 50%;
        padding: 20px 50px;
        /* background-color: aqua; */
        display: flex;
        flex-direction: column;
    }
}

.deck-description {
    padding: 30px 0 50px 0;
}

.deck-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

:deep(.p-galleria-thumbnail) {
    max-width: 80px;
    max-height: 80px;
}

:deep(.button-like .p-button) {
    /* font-size: 50px; */
    display: flex;
    flex-direction: column;
    width: 90px;
    box-shadow: 0px 4px 4px 0px #00000040;
    font-size: 10px;
    font-weight: 700;
}

.deck-tags .p-tag {
    background: #999999C7;
    color: white;
    font-size: 14px;
    font-weight: 600;
    margin-right: 5px;
    border-radius: 25px;
}
</style>