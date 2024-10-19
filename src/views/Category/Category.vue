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
import CardItem from '../../components/DeckCard.vue'
import { ref } from 'vue';
const value2 = ref(null);


function toggleDarkMode() {
    document.documentElement.classList.toggle('my-app-dark');
}
</script>

<template>
  <DockItem></DockItem>
  <CarouselItem></CarouselItem>

  <div class="flex">
    <div class="col-1">

    </div>
    <div class="col-11">

      <SectionItem></SectionItem>

      <CateHorizonItem></CateHorizonItem>

      <SectionItem></SectionItem>
      <div class="flex">
        
      </div>
      <div class="flex">
        <CardItem></CardItem>
        <CardItem></CardItem>
        <CardItem></CardItem>
      </div>
    </div>


  </div>

</template>
