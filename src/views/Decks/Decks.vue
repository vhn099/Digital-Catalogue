<script setup>
// components
import DockItem from '../../components/Dock.vue';
import SectionItem from '../../components/Section.vue';
import DeckItem from '../../components/DeckCard.vue';
import Presentation from '@/assets/img/icon/presentation.png';

import Select from 'primevue/select';
import Button from 'primevue/button';

import Popover from 'primevue/popover';


import { ref } from 'vue';
const sectionIcon = Presentation;
const sectionText = "Decks";

const op = ref();
const members = ref([
  { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
  { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
  { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
]);

const toggle = (event) => {
  op.value.toggle(event);
}


const selectedCity = ref();
const cities = ref([
  { name: 'A-z', code: 'NY' },
  { name: 'z-A', code: 'RM' },
  { name: 'Latest Update', code: 'LDN' },
  { name: 'Most Favorited', code: 'IST' },
]);

</script>

<template>

  <Popover ref="op">
    <div class="flex flex-col gap-4 w-[25rem]">
      <div>
        <span class="font-medium block mb-2">Share this document</span>
        <InputGroup>
          <InputText value="https://primevue.org/12323ff26t2g243g423g234gg52hy25XADXAG3" readonly class="w-[25rem]">
          </InputText>
          <InputGroupAddon>
            <i class="pi pi-copy"></i>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div>
        <span class="font-medium block mb-2">Invite Member</span>
        <InputGroup>
          <InputText disabled />
          <Button label="Invite" icon="pi pi-users"></Button>
        </InputGroup>
      </div>
      <div>
        <span class="font-medium block mb-2">Team Members</span>
        <ul class="list-none p-0 m-0 flex flex-col gap-4">
          <li v-for="member in members" :key="member.name" class="flex items-center gap-2">
            <img :src="`https://primefaces.org/cdn/primevue/images/avatar/${member.image}`" style="width: 32px" />
            <div>
              <span class="font-medium">{{ member.name }}</span>
              <div class="text-sm text-surface-500 dark:text-surface-400">{{ member.email }}</div>
            </div>
            <div class="flex items-center gap-2 text-surface-500 dark:text-surface-400 ml-auto text-sm">
              <span>{{ member.role }}</span>
              <i class="pi pi-angle-down"></i>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </Popover>

  <DockItem></DockItem>

  <div class="flex">
    <div class="col-1">

    </div>
    <div class="col-11">

      <!-- <SectionItem></SectionItem> -->
      <div class="deck-section-filter">
        <SectionItem :icon="sectionIcon" :icon_text="sectionText"></SectionItem>
        <div class="deck-filter gap-2">
          <div class="filter-input">
            <Select v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Sort By:" />

          </div>
          <div class="filter-popover">
            <Button type="button" icon="pi pi-sliders-h" @click="toggle" />

          </div>
        </div>
      </div>

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
.deck-section-filter {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.deck-filter {
  display: flex;
}

.deck-filter {
  padding-top: 15px;
}
</style>