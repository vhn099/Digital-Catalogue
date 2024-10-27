<script setup>
import DockItem from '../../components/Dock.vue';
import SectionItem from '../../components/Section.vue'
import Galleria from 'primevue/galleria';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import { ref, onMounted } from "vue";
import PresentationIcon from '@/assets/img/icon/presentation.png';
import router from '@/router';
import { DeckFirestore } from '@/lib/Deck';
import { CategoryFirestore } from '@/lib/Category';

const deckDetails = ref({});

onMounted(async () => {
    const { params } = router.currentRoute.value;
    deckDetails.value = await getDeckByID(params.id);
    setBreadcrumbs(createBreadcrumbObject(deckDetails.value), 'add');
});

const sectionIcon = PresentationIcon;
const sectionText = "Deck";
const isViewDeck = ref(false);
const breadcrumbs = ref([]);
const isActiveBreadCrumb = ref(0);

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

/* FUNCTIONS DEFINITION START */
const getDeckByID = async (id) => {
    const deck = {};
    const data = await DeckFirestore.getDeck(id);
    const categoryName = await CategoryFirestore.getCategoryName(data.category_id);
    deck.title = data.title;
    deck.detail_description = data.detail_description;
    deck.category_id = data.category_id;
    deck.category_name = categoryName;
    deck.deck_highlight = data.deck_highlight;
    deck.deck_images = data.deck_images;
    deck.pdf = data.pdf;
    deck.tag = data.tag;
    deck.created = data.created ? data.created.toDate().toLocaleString() : '';
    deck.created_by = data.created_by || '';
    deck.updated = data.updated ? data.updated.toDate().toLocaleString() : '';
    deck.updated_by = data.updated_by || '';

    return deck;
};


const viewDeck = (index) => {
    isViewDeck.value = true;
    isActiveBreadCrumb.value = index;
    const object = {
        title: 'View Deck',
        component: 'isViewDeck'
    };
    setBreadcrumbs(createBreadcrumbObject(object), 'add');
};

const setStateComponent = (component) => {
    console.log(component);
    if (component === 'isViewDeck') {
        isViewDeck.value = false;
    }
};

const changeActiveBreadCrumb = (index) => {
    isActiveBreadCrumb.value = index;
    for (let i = breadcrumbs.value.length - 1; i > index; --i) {
        if (breadcrumbs.value[i].component) {
            setStateComponent(breadcrumbs.value[i].component);
        }
        setBreadcrumbs({}, 'remove');
    }
};

const createBreadcrumbObject = (data) => {
    const object = {};
    if (data) {
        object.id = data.title;
        object.label = data.title;
        object.component = data.component || null;
    }
    return object;
};

const setBreadcrumbs = (data, type) => {
    if (type === 'add') {
        breadcrumbs.value.push(data);
    } else {
        breadcrumbs.value.pop();
    }
};

/* FUNCTIONS DEFINITION END */
</script>

<template>
    <DockItem></DockItem>

    <div class="flex min-height-750">
        <div class="col-1">

        </div>
        <div class="col-11">
            <SectionItem :icon="sectionIcon" :icon_text="sectionText"></SectionItem>
            <div class="breadcrumb">
                <span class="breadcrumb-header">Selected: </span>
                <div class="breadcrumb-content">
                    <span v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.id"
                        v-bind:class="{ 'active-breadcrumb': index === isActiveBreadCrumb }"
                        class="cursor-element"
                        @click="changeActiveBreadCrumb(index)">
                        {{ breadcrumb.label }}
                        <span v-if="(index + 1) < breadcrumbs.length" style="padding: 10px">></span>
                    </span>
                </div>
            </div>

            <!-- https://pdfobject.com/guide/quick-start.html -->
            <div v-if="!isViewDeck" class="deck-canva">
                <div class="deck-image">
                    <Galleria :value="deckDetails.deck_images" :responsiveOptions="responsiveOptions" :numVisible="4"
                        containerStyle="max-width: 800px" :circular="true" :autoPlay="true" :transitionInterval="4000">
                        <template #item="slotProps">
                            <img draggable="false" :src="slotProps.item.url" :alt="slotProps.item.name"
                                style="width: 100%; display: block" />
                        </template>
                        <template #thumbnail="slotProps">
                            <img draggable="false" :src="slotProps.item.url" :alt="slotProps.item.name"
                                style="max-height:100%; max-width:100% ;display: block;" />
                        </template>
                    </Galleria>
                </div>
                <div class="deck-info">
                    <div class="deck-title">
                        <div class="deck-title-left">
                            <span style="font-size: 40px;font-weight: 500;">{{ deckDetails.title }}</span>
                        </div>
                        <div class="deck-title-right">
                            <div class="button-like">

                                <Button severity="secondary" label="Favourite" @click="viewDeck(1)">
                                    <img draggable="false" width="40" height="40" fill="none"
                                        src="../../assets/img/icon/search_file.png" />
                                    <label>View Deck</label>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div class="deck-fav-button">
                        <Button label="Favourite">
                            <img draggable="false" width="23" height="23" fill="none"
                                src="../../assets/img/icon/favorite_white.png" />
                            <label>Add to my Favorite</label>
                        </Button>
                    </div>
                    <div class="deck-description">
                        <p>
                            {{ deckDetails.detail_description }}
                        </p>
                    </div>
                    <div class="deck-tags">
                        <Tag v-for="t in deckDetails.tag" severity="secondary" :value="'#' + t"></Tag>
                    </div>
                </div>
            </div>
            <div v-if="isViewDeck" class="pdf-canva">
                <div class="pdf-fav-button">
                    <Button label="Favourite">
                        <img draggable="false" width="23" height="23" fill="none"
                            src="../../assets/img/icon/favorite_white.png" />
                        <label>Add to my Favorite</label>
                    </Button>
                </div>
                <div class="pdf-place">
                    <PdfObject class="pdf-view" :url="deckDetails.pdf" />
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
        display: flex;
        justify-content: center;
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

/* BREADCRUMB CSS START */
.breadcrumb {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.breadcrumb-header {
    font-size: 24px;
    font-weight: 500;
}

.breadcrumb-content {
    margin-left: 15px;
}

.active-breadcrumb {
    font-weight: 500;
}
.cursor-element {
    cursor: pointer;
}

/* BREADCRUMB CSS END */
</style>