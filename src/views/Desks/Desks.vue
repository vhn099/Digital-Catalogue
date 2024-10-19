<script setup>
// components
import DockItem from '../../components/Dock.vue';
import SectionItem from '../../components/Section.vue'
import DeckItem from '../../components/DeckCard.vue'
import { ref } from 'vue';
const sectionIcon = "src/assets/img/icon/supply-chain.png";
const sectionText = "Decks";
</script>

<template>
  <DockItem></DockItem>

  <div class="flex">
    <div class="col-1">

    </div>
    <div class="col-11">

      <!-- <SectionItem></SectionItem> -->
      <SectionItem :icon="sectionIcon" :icon_text="sectionText"></SectionItem>

      <div class="flex">
        <DeckItem></DeckItem>
        <DeckItem></DeckItem>
      </div>
      <div class="flex">
        <DeckItem></DeckItem>
        <DeckItem></DeckItem>
        <DeckItem></DeckItem>
      </div>
      <div class="flex">
        <DeckItem></DeckItem>
        <DeckItem></DeckItem>
        <DeckItem></DeckItem>
      </div>
      <div class="flex">
        <DeckItem></DeckItem>
        <DeckItem></DeckItem>
        <DeckItem></DeckItem>
      </div>
      <div class="flex">
        <DeckItem></DeckItem>
        <DeckItem></DeckItem>
        <DeckItem></DeckItem>
      </div>
    </div>


  </div>

</template>
