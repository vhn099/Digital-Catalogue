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
import { DeckFirestore } from '@/lib/Deck';
import { CategoryFirestore } from '@/lib/Category';

const value2 = ref(null);
const top_decks = ref([]);
const normal_decks = ref([]);


function toggleDarkMode() {
  document.documentElement.classList.toggle('my-app-dark');
}

const categorySectionIcon = SupplyChainIcon;
const categorySectionText = "Category";
const categoryPageHeader = "Discover Decks by Category";

const deckSectionIcon = MegaphoneIcon;
const deckSectionText = "Deck";
const deckPageHeader = "Latest Decks";

const getDecks = async () => {
  const deckList = [];
  const decksSnapshot = await DeckFirestore.getDecks();
  for (const deck of decksSnapshot) {
    const data = deck.data();
    const categoryName = await CategoryFirestore.getCategoryName(data.category_id);
    const object = {
      id: deck.id,
      title: data.title,
      detail_description: data.detail_description,
      category_id: data.category_id,
      category_name: categoryName,
      deck_highlight: data.deck_highlight,
      deck_images: data.deck_images,
      pdf: data.pdf,
      tag: data.tag,
      created: data.created ? data.created.toDate().toLocaleString() : '',
      created_by: data.created_by || '',
      updated: data.updated ? data.updated.toDate().toLocaleString() : '',
      updated_by: data.updated_by || ''
    };
    deckList.push(object);
  }

  return deckList;
};

onMounted(async () => {
  const decks = await getDecks();
  for (let i = 0; i < decks.length; i++) {
    if (i < 2) {
      top_decks.value.push(decks[i]);
    } else {
      normal_decks.value.push(decks[i]);
    }
  }
})
</script>

<template>
  <DockItem></DockItem>
  <CarouselItem></CarouselItem>

  <div class="flex min-height-750">
    <div class="col-1">

    </div>
    <div class="col-11">

      <SectionItem :icon="categorySectionIcon" :icon_text="categorySectionText" :title="categoryPageHeader" />

      <CateHorizonItem style="padding-top: 15px"></CateHorizonItem>

      <SectionItem :icon="deckSectionIcon" :icon_text="deckSectionText" :title="deckPageHeader" />
      <div class="top-line" style="padding-top: 15px">
        <DeckItem v-for="top_deck in top_decks" :data="top_deck"></DeckItem>
      </div>
      <div class="normal-line">
        <DeckItem v-for="nornal_deck in normal_decks" :data="nornal_deck"></DeckItem>
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
<style scoped></style>