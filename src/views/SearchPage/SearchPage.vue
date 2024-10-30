<script setup>
// components
import DockItem from '../../components/Dock.vue';
import SectionItem from '../../components/Section.vue';
import DeckItem from '../../components/DeckCard.vue';
import SupplyChainIcon from '@/assets/img/icon/supply-chain.png';

import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';


import { onMounted, ref, watch } from 'vue';
import router from '@/router';
import { SearchPageFirestore } from '@/lib/SearchPage';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { getAuth } from 'firebase/auth';
import { FavoriteFirestore } from '@/lib/Favorite';
const sectionIcon = SupplyChainIcon;
const sectionText = "Decks";

/* REF DEFINITION START */
const inputSearch = ref("");
const decks = ref([]);
const spinner = ref(false);
const email = ref('');

/* NORMAL VARIABLE */
let isTag = "";

/* DEFINE PROPS */
const props = defineProps(['query']); // Receiving props data from URL everytime users search on header

/* FUNCTION START */
const createQuery = async () => {
    spinner.value = true;
    if (inputSearch.value.startsWith("#")) {
        isTag = true;
    } else {
        isTag = false;
    }

    decks.value = await SearchPageFirestore.searchDeck(inputSearch.value, isTag);
    spinner.value = false;
};
const search = async () => {
    await createQuery();
};

/* VUE EVENTS */
onMounted(async () => {
    email.value = getAuth().currentUser.email;
    inputSearch.value = props.query;
    await createQuery();
});
watch(() => props.query, async () => {
    inputSearch.value = props.query;
    await createQuery();
});
</script>

<template>
    <LoadingSpinner v-if="spinner" />
    <DockItem></DockItem>

    <div class="flex min-height-750">
        <div class="col-1">

        </div>
        <div class="col-11">

            <!-- <SectionItem></SectionItem> -->
            <SectionItem :icon="sectionIcon" :icon_text="sectionText"></SectionItem>

            <div class="search-area">
                <div class="text-result">
                    <span>Here are the search results</span>
                </div>
                <div class="input-field">
                    <IconField>
                        <InputText v-model="inputSearch" placeholder="text or #tag search ..."
                            v-on:keyup.enter="search" />
                        <InputIcon class="pi pi-search cursor" variant="filled" @click="search" />
                    </IconField>
                </div>
            </div>
            <div class="card normal-line" v-if="decks.length > 0">
                <DeckItem v-for="deck in decks" :data="deck" :email="email"></DeckItem>
            </div>
        </div>


    </div>

</template>

<style scoped>
@media (max-width: 992px) {
    .search-area {
        width: 100% !important;
    }
}

.search-area {
    width: 60%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 30px;

    .text-result {
        padding: 20px;
        text-align: center;

        span {
            font-size: 24px;
            font-weight: 500;
            line-height: 36px;
            text-align: center;
        }
    }

    .input-field {
        width: 100%;
    }
}

:deep(.input-field .p-iconfield) {
    width: 100%;

    input {
        box-shadow: 0px 4px 4px 0px #00000040;
        border-radius: 60px;
        width: 100%;

    }
}

.cursor {
    cursor: pointer;
}
</style>