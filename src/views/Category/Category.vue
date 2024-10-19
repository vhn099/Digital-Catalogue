<script setup>
// import

// components
import DockItem from '../../components/Dock.vue';
import CarouselItem from '../../components/Carousel.vue'
import CateCardItem from '../../components/CateCard.vue'
import SectionItem from '../../components/Section.vue'
import { ref } from 'vue';

const sectionIcon = "src/assets/img/icon/supply-chain.png";
const sectionText = "Category";

</script>

<template>
  <DockItem></DockItem>
  <CarouselItem></CarouselItem>

  <div class="flex">
    <div class="col-1">
    </div>
    <div class="col-11">

        <SectionItem :icon="sectionIcon" :icon_text="sectionText"></SectionItem>


      <SectionItem></SectionItem>

      <div class="card-container">
        <CateCardItem></CateCardItem>
        <CateCardItem></CateCardItem>
        <CateCardItem></CateCardItem>
        <CateCardItem></CateCardItem>
        <CateCardItem></CateCardItem>
        <CateCardItem></CateCardItem>
        <CateCardItem></CateCardItem>
        <CateCardItem></CateCardItem>
        <CateCardItem></CateCardItem>
        <CateCardItem></CateCardItem>
        <CateCardItem></CateCardItem>
        <CateCardItem></CateCardItem>
        <CateCardItem></CateCardItem>

      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
    display: flex;
    flex-wrap: wrap;
}
</style>
