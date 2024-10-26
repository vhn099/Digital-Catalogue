<script setup>
// components
import DockItem from '../../components/Dock.vue';
import SectionItem from '../../components/Section.vue';
import DeckItem from '../../components/DeckCard.vue';
import SupplyChainIcon from '@/assets/img/icon/supply-chain.png';
// import IconField from 'primevue/iconField';
// import InputText from 'primevue/inputtext';
// import InputIcon from 'primevue/inputIcon';


import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';


import { ref } from 'vue';
const sectionIcon = SupplyChainIcon;
const sectionText = "Decks";
</script>

<template>
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
                        <InputText v-model="value1" placeholder="Search" />
                        <InputIcon class="pi pi-search" variant="filled" />
                    </IconField>
                </div>
            </div>
            <div class="card normal-line">
                <DeckItem></DeckItem>
                <DeckItem></DeckItem>
                <DeckItem></DeckItem>
                <DeckItem></DeckItem>
                <DeckItem></DeckItem>
                <DeckItem></DeckItem>
                <DeckItem></DeckItem>
                <DeckItem></DeckItem>
                <DeckItem></DeckItem>
                <DeckItem></DeckItem>
                <DeckItem></DeckItem>
                <DeckItem></DeckItem>
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
</style>