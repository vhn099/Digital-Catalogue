<script setup>
// components
import DockItem from '../../components/Dock.vue';
import CarouselItem from '../../components/Carousel.vue'
import CateHorizonItem from '../../components/CateHorizon.vue'
import SectionItem from '../../components/Section.vue'
import DeckItem from '../../components/DeckCard.vue'
import { onMounted, ref } from 'vue';
import SupplyChainIcon from '@/assets/img/icon/supply-chain.png';
import MegaphoneIcon from '@/assets/img/icon/megaphone.png';
import { DeckFirestore } from '@/lib/Deck';
import { getAuth } from 'firebase/auth';
import moment from 'moment';
import { useAppStore } from '@/stores';
import { CommonLib } from '@/lib/CommonLib';

const top_decks = ref([]);
const normal_decks = ref([]);
const email = ref('');

function toggleDarkMode() {
  document.documentElement.classList.toggle('my-app-dark');
}

const categorySectionIcon = SupplyChainIcon;
const categorySectionText = "Category";
const categoryPageHeader = "Discover Decks by Category";

const deckSectionIcon = MegaphoneIcon;
const deckSectionText = "Deck";
const deckPageHeader = "Latest Decks";
const dateFormat = useAppStore().getDateFormats.DECK;

/* FUNCTIONS DEFINITION START */
const getDecks = async () => {
  const deckList = [];
  const decksSnapshot = await DeckFirestore.getTopDecks();
  for (const deck of decksSnapshot) {
    const data = deck.data();
    let convertedCatalogueEdition = "";
    const momentDate = moment(new Date(data.catalogue_edition.toDate())); // Have to use toDate because this field is timestamp in Firebase if we use new Date(data.catalogue_edition) for this it will not work as an normal date.
    if (momentDate.isValid()) {
      const formattedDate = momentDate.format(dateFormat);
      convertedCatalogueEdition = CommonLib.getOnlyMonthAndYearForShortDate(formattedDate, 1, 0, "/", false);
    }
    // const categoryName = await CategoryFirestore.getCategoryName(data.category_id);
    const object = {
      id: deck.id,
      title: data.title,
      // detail_description: data.detail_description,
      // category_id: data.category_id,
      // category_name: categoryName,
      deck_highlight: data.deck_highlight,
      // deck_images: data.deck_images,
      // pdf: data.pdf,
      tag: data.tag,
      catalogue_edition: convertedCatalogueEdition,
      // created: data.created ? data.created.toDate().toLocaleString() : '',
      // created_by: data.created_by || '',
      // updated: data.updated ? data.updated.toDate().toLocaleString() : '',
      // updated_by: data.updated_by || ''
    };
    deckList.push(object);
  }

  return deckList;
};

/* VUE EVENTS */
onMounted(async () => {
  if (getAuth().currentUser) {
    email.value = getAuth().currentUser.email;
  }
  
  const decks = await getDecks();
  for (let i = 0; i < decks.length; i++) {
    if (i < 2) {
      top_decks.value.push(decks[i]);
    } else {
      normal_decks.value.push(decks[i]);
    }
  }  
});
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
        <DeckItem v-for="top_deck in top_decks" :data="top_deck" :email="email"></DeckItem>
      </div>
      <div class="normal-line">
        <DeckItem v-for="nornal_deck in normal_decks" :data="nornal_deck" :email="email">
        </DeckItem>
      </div>
      <div class="view-more-router">
        <RouterLink :to="{ name: 'decks' }" class="link-router">View More</RouterLink>
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
<style scoped>
.view-more-router {
  padding: 35px;
  display: flex;
  justify-content: center;
}

.link-router {
  color: gray;
  text-decoration: underline;
  font-size: 20px;
  font-style: italic;
  font-weight: 600;
  line-height: 30px;
  text-align: center;
}
</style>