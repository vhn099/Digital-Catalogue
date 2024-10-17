<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
const value2 = ref(null);

// components
import HeaderItem from './components/Header.vue'
import DockItem from './components/Dock.vue'
import CarouselItem from './components/Carousel.vue'
import HorizontalCatelogItem from './components/HorizontalCatelog.vue'
import SectionItem from './components/Section.vue'
import FooterItem from './components/Footer.vue'
import CardItem from './components/Card.vue'

function toggleDarkMode() {
    document.documentElement.classList.toggle('my-app-dark');
}
</script>

<template>
    <DockItem></DockItem>
    <HeaderItem></HeaderItem>
    <CarouselItem></CarouselItem>
    
    <div class="grid">
      <div class="col-1">
        
      </div>
      <div class="col-11">

        <SectionItem></SectionItem>

          <HorizontalCatelogItem></HorizontalCatelogItem>

        <SectionItem></SectionItem>
        <div class="flex">
          <CardItem></CardItem>
          <CardItem></CardItem>
        </div>
        <div class="flex">
          <CardItem></CardItem>
          <CardItem></CardItem>
          <CardItem></CardItem>
        </div>
        <!-- <CardItem></CardItem> -->
       
        <!-- <FloatLabel variant="in">
          <InputText id="in_label" v-model="value2" variant="filled" />
          <label for="in_label">In Label</label>
        </FloatLabel>
        <Button label="Submit" @click="toggleDarkMode()"/> -->
      </div>

      
  </div>

  <FooterItem></FooterItem>

  <!-- {{ value2 }} -->

</template>

<style scoped>

</style>
