<script setup>
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';


// components
import DockItem from '../../components/Dock.vue';
import HeaderItem from '../../components/Header.vue';
import CarouselItem from '../../components/Carousel.vue'
import HorizontalCatelogItem from '../../components/HorizontalCatelog.vue'
import SectionItem from '../../components/Section.vue'
import FooterItem from '../../components/Footer.vue'
import CardItem from '../../components/Card.vue'
import { ref } from 'vue';
const value2 = ref(null);


function toggleDarkMode() {
    document.documentElement.classList.toggle('my-app-dark');
}
</script>

<template>
  <DockItem></DockItem>
  <HeaderItem></HeaderItem>
  <CarouselItem></CarouselItem>

  <div class="flex">
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
</template>
