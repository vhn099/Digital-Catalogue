<script setup>
// components
import DockItem from '../../components/Dock.vue';
import SectionItem from '../../components/Section.vue';
import DeckItem from '../../components/DeckCard.vue';
import Presentation from '@/assets/img/icon/presentation.png';

import Select from 'primevue/select';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Popover from 'primevue/popover';
import Checkbox from 'primevue/checkbox';
import Divider from 'primevue/divider';

import { onMounted, ref } from 'vue';
import { db } from '@/main';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const sectionIcon = Presentation;
const sectionText = "Decks";

const op = ref();

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
const deckSectionPageHeader = "Last Decks";

const categories = ref([
  { name: "Accounting", key: "A" },
  { name: "Marketing", key: "M" },
  { name: "Production", key: "P" },
  { name: "Research", key: "R" }
]);

const selectedCategories = ref(['Marketing']);
const favRecord = ref({
  userID:'',
  deckID: '',
});
const email = ref('');

const favoriteFn = async (id) => {
  favRecord.value.userID = email.value;
  favRecord.value.deckID = id;
  await addDoc(collection(db, 'favorite'), favRecord.value);
  console.log('called' + id);
};

onMounted(async () => {
    email.value = getAuth().currentUser.email;
});
</script>

<template>

  <Popover ref="op">
    <div class="custom-dropdown">
      <div class="block-search">
        <span class="filter-text">Filter</span>
      </div>
      <Divider />

      <div class="block-search">
        <span class="filter-text">Search Tags</span>
        <IconField>
          <InputText v-model="value1" placeholder="Search" />
          <InputIcon class="pi pi-search" variant="filled" />
        </IconField>
      </div>
      <Divider />

      <div class="block-search">

        <span class="filter-text">Category</span>
        <div class="checkbox-area">
          <div v-for="category of categories" :key="category.key" class="checkbox-item gap-2">
            <Checkbox v-model="selectedCategories" :inputId="category.key" name="category" :value="category.name" />
            <label :for="category.key">{{ category.name }}</label>
          </div>
        </div>
      </div>
      <Divider />

      <div class="block-search">
        <a style="padding-right: 10px;" class="close" href="#" @click="">Clear</a>
        <Button label="Save" />
      </div>
    </div>
  </Popover>

  <DockItem></DockItem>

  <div class="flex min-height-750">
    <div class="col-1">
    </div>
    <div class="col-11">

      <!-- <SectionItem></SectionItem> -->
      <div class="deck-section-filter">
        <div>
          <SectionItem :icon="sectionIcon" :icon_text="sectionText" :title="deckSectionPageHeader"></SectionItem>
        </div>
        <div class="deck-filter gap-2">
          <div class="filter-input">
            <Select v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Sort By:" />

          </div>
          <div class="filter-popover">
            <Button type="button" severity="secondary" icon="pi pi-sliders-h" @click="toggle" />
          </div>
        </div>
      </div>

      <div class="card top-line">
        <DeckItem @callFavoriteFn="favoriteFn"></DeckItem>
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
  align-items: center;
}

.deck-filter {
  display: flex;

}

.filter-text {
  font-size: 20px;
  font-weight: 700;
  line-height: 36px;
  text-align: center;
}

.close {
  color: gray;
  font-size: 14px;
  font-weight: 700;
  /* font-style: italic; */
  text-decoration: underline;
  padding-top: 25px;
}

.custom-dropdown {
  display: flex;
  flex-direction: column;
  /* justify-content: space-around; */
  /* align-items: center; */
}

.block-search {
  text-align: center;
  padding: 10px 0;
  /* gap: 5px; */
}

.checkbox-area {
  display: flex;
  flex-direction: column;
  align-items: start;
  /* justify-content: start; */
  /* padding: 10px; */
}

.checkbox-item {
  display: flex;
  flex-direction: row;
  gap: 5px;
}

:deep(.p-divider-horizontal) {
  margin: 0;
}

:deep(.p-divider-horizontal:before) {
  /* border-color: #000; */
  border: 1px solid rgb(150 150 150 / 50%)
}

:deep(.p-button-secondary) {
  border: 1px solid var(--p-select-border-color);
}
</style>