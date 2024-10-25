<script setup>
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';


// components
import DockItem from '../../components/Dock.vue';
import HeaderItem from '../../components/Header.vue';
import CarouselItem from '../../components/Carousel.vue'
import CateHorizonItem from '../../components/CateHorizon.vue'
import SectionItem from '../../components/Section.vue'
import DeckItem from '../../components/DeckCard.vue'
import { onMounted, ref } from 'vue';
import SupplyChainIcon from '@/assets/img/icon/supply-chain.png';
import MegaphoneIcon from '@/assets/img/icon/megaphone.png';

const value2 = ref(null);


function toggleDarkMode() {
    document.documentElement.classList.toggle('my-app-dark');
}

const categorySectionIcon = SupplyChainIcon;
const categorySectionText = "Category";
const categoryPageHeader = "Discover Decks by Category";

const deckSectionIcon = MegaphoneIcon;
const deckSectionText = "Deck";
const deckPageHeader = "Latest Decks";

onMounted(() => {

}) 
</script>

<template>
  <DockItem></DockItem>
  <CarouselItem></CarouselItem>

  <div class="flex">
    <div class="col-1">

    </div>
    <div class="col-11">

      <SectionItem :icon="categorySectionIcon" :icon_text="categorySectionText" :title="categoryPageHeader"/>

      <CateHorizonItem style="padding-top: 15px"></CateHorizonItem>

      <SectionItem :icon="deckSectionIcon" :icon_text="deckSectionText" :title="deckPageHeader"/>
      
      <div class="top-line" style="padding-top: 15px">
        <DeckItem></DeckItem>
        <DeckItem></DeckItem>
      </div>
      <div class="normal-line">
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

      <!-- <DeckItem></DeckItem> -->

      <!-- <FloatLabel variant="in">
          <InputText id="in_label" v-model="value2" variant="filled" />
          <label for="in_label">In Label</label>
        </FloatLabel>
        <Button label="Submit" @click="toggleDarkMode()"/> -->
    </div>


  </div>

</template>
<style scoped>

</style>