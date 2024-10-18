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

const sectionIcon = "src/assets/img/homepage/support.png";
const sectionText = "Contact us";
const line4 = {
  title: 'Selected',
  deck: 'Glassware Design'
}
</script>

<template>
  <DockItem></DockItem>
  <HeaderItem></HeaderItem>
  <div class="flex">
    <div class="col-1 disable-margin">

    </div>
    <div class="col-11 disable-margin">
      <div class="flex">
        <div class="col-8">
          <div class="flex flex-column">
            <SectionItem :icon="sectionIcon" :icon_text="sectionText" line3="true"></SectionItem>
            <!-- <SectionItem :icon="sectionIcon" :icon_text="sectionText" :line4="line4"></SectionItem> -->
            <span>Please fill con cặc nè. đĩ mẹ mầy</span>
            <FloatLabel variant="on">
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText id="on_label" v-model="value3" autocomplete="off" />
              </IconField>
              <!-- <label for="on_label">On Label</label> -->
            </FloatLabel>
            <!-- <div class="card grid pb-0.5 grid-cols-1 md:grid-cols-2 gap-4">
              <FloatLabel variant="in">
                <InputText id="in_label" v-model="value1" autocomplete="off" />
                <label for="in_label">In Label</label>
              </FloatLabel>
              <FloatLabel variant="in">
                <InputText id="in_label" v-model="value1" autocomplete="off" />
                <label for="in_label">In Label</label>
              </FloatLabel>
            </div>
            <div class="card grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatLabel variant="in">
              <InputText id="in_label" v-model="value1" autocomplete="off" />
              <label for="in_label">In Label</label>
            </FloatLabel>
            </div>
            -->
          </div>

        </div>
        <div class="col-4" style="background-color: black;">

        </div>
      </div>

    </div>
  </div>

  <FooterItem></FooterItem>
</template>
<style scoped>
.disable-margin {
  margin: 0;
  padding: 0;
}

.t-con {
  height: 10px;
  width: 100%;
  display: flex;
}

.t-left {
  width: 60%;
  height: 100%;
  background-color: antiquewhite;
}

.t-right {
  width: 40%;
  height: 100%;
  background-color: blue;
}
</style>
