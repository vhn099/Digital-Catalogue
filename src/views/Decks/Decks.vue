<script setup>
// components
import DockItem from '../../components/Dock.vue';
import SectionItem from '../../components/Section.vue';
import DeckItem from '../../components/DeckCard.vue';
import SupplyChainIcon from '@/assets/img/icon/supply-chain.png';

import { ref } from 'vue';
const sectionIcon = SupplyChainIcon;
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

      <div class="card top-line">
        <DeckItem></DeckItem>
        <DeckItem></DeckItem>
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

</style>