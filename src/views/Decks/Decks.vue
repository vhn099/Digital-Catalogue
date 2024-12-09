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

import { onMounted, ref, watch,  } from 'vue';
import { getAuth } from 'firebase/auth';
import { DeckFirestore } from '@/lib/Deck';
import { CategoryFirestore } from '@/lib/Category';
import router from '@/router';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import _ from 'lodash';
import { useAppStore } from '@/stores';

/* REF DEFINITION START */
const op = ref();
const cateIDParm = ref('');
const all_decks = ref([]);
const top_decks = ref([]);
const normal_decks = ref([]);
const last_deck = ref({});
const orderedBy = ref();
const orderBy = ref([
  { name: 'A-z', code: 'title-asc' },
  { name: 'z-A', code: 'title-desc' },
  { name: 'Latest Update', code: 'catalogue_edition-desc' },
  { name: 'Most Favorited', code: 'favorite_count-desc' },
]);
const tagInputed = ref('');
const selectedCategories = ref();
const selectedCategoriesUsedForLogicHandler = ref(); // There is a case when users choose a category but not save that category but sort the list the list is sorted based on the category chose in the filter.
const categories = ref();
const email = ref('');
const spinner = ref(false);

/* STATIC VARIABLES */
const deckSectionPageHeader = "Lastest Decks";
const sectionIcon = Presentation;
const sectionText = "Decks";
const limit = 14;

/* FUNCTION DEFINTION START */
const toggle = (event) => {
  op.value.toggle(event);
}
const getCategories = async () => {
  const categoryList = [];
  (await CategoryFirestore.getCategories()).forEach(category => {
    const data = category.data();
    const object = {
      key: category.id,
      name: data.name,
    };
    categoryList.push(object);
  });

  return categoryList;
};
const getDecks = async (orderBy, filter, lastDeck) => {
  const deckList = [];
  const decksSnapshot = await DeckFirestore.getLimitDecks(orderBy, filter, limit, lastDeck);
  last_deck.value = decksSnapshot[decksSnapshot.length - 1];
  for (const deck of decksSnapshot) {
    const data = deck.data();
    // const categoryName = await CategoryFirestore.getCategoryName(data.category_id);
    const object = {
      id: deck.id,
      title: data.title,
      // detail_description: data.detail_description,
      category_id: data.category_id,
      // category_name: categoryName,
      deck_highlight: data.deck_highlight,
      // deck_images: data.deck_images,
      // pdf: data.pdf,
      // fav_count: await FavoriteFirestore.countFavoriteDecks(deck.id),
      tag: data.tag,
      catalogue_edition: data.catalogue_edition ? data.catalogue_edition.toDate().toLocaleString() : '',
      // created: data.created ? data.created.toDate().toLocaleString() : '',
      // created_by: data.created_by || '',
      // updated: data.updated ? data.updated.toDate().toLocaleString() : '',
      // updated_by: data.updated_by || ''
    };
    deckList.push(object);
  }
  return deckList;
};

const onLoadEvents = async () => {
  spinner.value = true;

  // const { params } = router.currentRoute.value; // open from Category
  cateIDParm.value = useAppStore().getDeckCategory;
  orderedBy.value = { name: 'Latest Update', code: 'catalogue_edition-desc' };

  if (cateIDParm.value) {
    selectedCategoriesUsedForLogicHandler.value = [cateIDParm.value];
    selectedCategories.value = [cateIDParm.value];
  } else {
    const categoryOptions = _.map(categories.value, 'key');
    selectedCategories.value = categoryOptions;
    selectedCategoriesUsedForLogicHandler.value = categoryOptions;
  }
  tagInputed.value = '';

  all_decks.value = await getDecks(orderedBy.value.code, { tag: tagInputed.value, category: selectedCategoriesUsedForLogicHandler.value });
  loadDataForDecks();

  spinner.value = false;
}

function loadDataForDecks() {
  top_decks.value = _.slice(all_decks.value, 0, 2);
  normal_decks.value = _.slice(all_decks.value, 2);
}

const nextDecks = async (lastDeck) => {
  spinner.value = true;

  const nextDecks = await getDecks(orderedBy.value.code, { tag: tagInputed.value, category: selectedCategoriesUsedForLogicHandler.value }, lastDeck);
  all_decks.value = _.concat(all_decks.value, nextDecks);
  loadDataForDecks();

  spinner.value = false;
};

async function sortData() {
  spinner.value = true;

  let selectedValue = orderedBy.value.code;

  if (selectedCategoriesUsedForLogicHandler.value.length > 0) {
    all_decks.value = await getDecks(selectedValue, { tag: tagInputed.value, category: selectedCategoriesUsedForLogicHandler.value });
  }

  loadDataForDecks();

  spinner.value = false;
};

// function sortAllDeck() {
//   let selectedValue = orderedBy.value.code;
//   selectedValue = selectedValue.split('-');
//   all_decks.value = _.orderBy(all_decks.value, selectedValue[0], selectedValue[1]);
// }

async function addFilter() {
  spinner.value = true;

  const tagFilter = tagInputed.value;
  const cateFilter = (selectedCategories.value.length == 1 && selectedCategories.value[0]) || selectedCategories.value.length > 1 ? selectedCategories.value : [];
  selectedCategoriesUsedForLogicHandler.value = selectedCategories.value;
  if (cateFilter.length === 0) { // If users don't choose any category then there will be no decks show on the page.
    all_decks.value = [];
    last_deck.value = null;
  } else {
    all_decks.value = await getDecks(orderedBy.value.code, { tag: tagFilter, category: cateFilter });
  }
  loadDataForDecks();

  spinner.value = false;
};

// function filterOnDecks() {
//   const tagFilter = tagInputed.value ? tagInputed.value.split(',') : [];
//   const cateFilter = (selectedCategories.value.length == 1 && selectedCategories.value[0]) || selectedCategories.value.length > 1 ? selectedCategories.value : [];
//   const filteredDecks = _.filter(all_decks.value, (deck) => {
//     // Check if tagFilter is not empty
//     const matchesTagFilter = tagFilter.length > 0
//       ? _.some(deck.tag, (val) => _.includes(tagFilter, val))
//       : true; // If tagFilter is empty, ignore this filter

//     // Check if cateFilter is not empty
//     const matchesCateFilter = cateFilter.length > 0
//       ? _.includes(cateFilter, deck.category_id)
//       : true; // If cateFilter is empty, ignore this filter


//     if (tagFilter.length > 0 && cateFilter.length > 0) {
//       return matchesTagFilter && matchesCateFilter;
//     }
//     if (tagFilter.length > 0) {
//       return matchesTagFilter;
//     }
//     if (cateFilter.length > 0) {
//       return matchesCateFilter;
//     }
//   });

//   if ((tagFilter.length > 0 || cateFilter.length > 0) || filteredDecks.length > 0) {
//     top_decks.value = [];
//     normal_decks.value = [];
//     for (let i = 0; i < filteredDecks.length; i++) {
//       if (i < 2) {
//         top_decks.value.push(filteredDecks[i]);
//       } else {
//         normal_decks.value.push(filteredDecks[i]);
//       }
//     }
//   } else {
//     loadDataForDecks();
//   }
// }

async function clearFilter() {
  tagInputed.value = '';
  // const categoryOptions = _.map(categories.value, 'key');
  const categoryOptions = [];
  selectedCategories.value = categoryOptions;
  selectedCategoriesUsedForLogicHandler.value = categoryOptions;
  // all_decks.value = await getDecks(orderedBy.value.code, { tag: tagInputed.value, category: selectedCategoriesUsedForLogicHandler.value });
  all_decks.value = [];
  last_deck.value = null;
  loadDataForDecks();
};

/* VUE EVENTS */
onMounted(async () => {
  email.value = getAuth().currentUser.email;
  categories.value = await getCategories();
  await onLoadEvents();
});

watch(() => router.currentRoute.value.params, async () => {
  await onLoadEvents();
});
</script>

<template>
  <LoadingSpinner v-if="spinner" />
  <Popover ref="op">
    <div class="custom-dropdown">
      <div class="block-search">
        <span class="filter-text">Filter</span>
      </div>
      <Divider />

      <div class="block-search">
        <span class="filter-text">Search Tags</span>
        <IconField>
          <InputText v-model="tagInputed" placeholder="tag search" />
          <InputIcon class="pi pi-search" variant="filled" />
        </IconField>
      </div>
      <Divider />

      <div class="block-search">

        <span class="filter-text">Category</span>
        <div class="checkbox-area">
          <div v-for="category of categories" :key="category.key" class="checkbox-item gap-2">
            <Checkbox v-model="selectedCategories" :inputId="category.key" name="category" :value="category.key" />
            <label :for="category.key">{{ category.name }}</label>
          </div>
        </div>
      </div>
      <Divider />

      <div class="block-search">
        <!-- <a style="padding-right: 10px;" class="close" href="" @click="clearFilter">Clear</a> -->
        <Button severity="warn" label="Clear" @click="clearFilter" />
        <Button label="Save" @click="addFilter" style="margin-left: 5px;" />
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
            <Select v-model="orderedBy" :options="orderBy" optionLabel="name" placeholder="Sort By:"
              @change="sortData" />

          </div>
          <div class="filter-popover">
            <Button type="button" severity="secondary" icon="pi pi-sliders-h" @click="toggle" />
          </div>
        </div>
      </div>

      <div class="card top-line">
        <DeckItem v-for="top_deck in top_decks" :data="top_deck" :email="email"></DeckItem>
      </div>
      <div class="card normal-line">
        <DeckItem v-for="nornal_deck in normal_decks" :data="nornal_deck" :email="email"></DeckItem>
      </div>
      <div class="view-more-router">
        <p v-if="last_deck" class="link-router" @click="nextDecks(last_deck)">View More</p>
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
  cursor: pointer;
}
</style>