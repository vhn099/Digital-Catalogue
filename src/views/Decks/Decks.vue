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

import { onMounted, ref, watch } from 'vue';
import { getAuth } from 'firebase/auth';
import { DeckFirestore } from '@/lib/Deck';
import { CategoryFirestore } from '@/lib/Category';
import { FavoriteFirestore } from '@/lib/Favorite';
import router from '@/router';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const sectionIcon = Presentation;
const sectionText = "Decks";

const op = ref();
const cateIDParm = ref('');
const top_decks = ref([]);
const normal_decks = ref([]);
const last_deck = ref({});

const toggle = (event) => {
  op.value.toggle(event);
}

const orderedBy = ref({ name: 'Latest Update', code: 'lu' });
const orderBy = ref([
  { name: 'A-z', code: 'az' },
  { name: 'z-A', code: 'za' },
  { name: 'Latest Update', code: 'lu' },
  { name: 'Most Favorited', code: 'mf' },
]);
const deckSectionPageHeader = "Lastest Decks";

const selectedCategories = ref();
const categories = ref();

const favRecord = ref({
  created: '',
  userID: '',
  deckID: '',
});
const email = ref('');
const spinner = ref(false);

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

const getDecks = async (cateID, lastDeck) => {
  const deckList = [];
  const decksSnapshot = await DeckFirestore.getLimitDecks(cateID, 14, lastDeck);
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

const onLoadEvents = async () => {
  spinner.value = true;
  const { params } = router.currentRoute.value; // open from Category
  cateIDParm.value = params.cateID;

  categories.value = await getCategories();
  selectedCategories.value = [cateIDParm.value];

  const decks = await getDecks(cateIDParm.value);
  for (let i = 0; i < decks.length; i++) {
    if (i < 2) {
      top_decks.value.push(decks[i]);
    } else {
      normal_decks.value.push(decks[i]);
    }
  }
  spinner.value = false;
}

onMounted(async () => {
  email.value = getAuth().currentUser.email;
  await onLoadEvents();
});

watch(() => router.currentRoute.value.params, async () => {
  await onLoadEvents()
});

const nextDecks = async (lastDeck) => {
  const decks = await getDecks(cateIDParm.value, lastDeck);
  for (let i = 0; i < decks.length; i++) {
    normal_decks.value.push(decks[i]);
  }
};
</script>

<template>
  <LoadingSpinner v-if="spinner"/>
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
            <Checkbox v-model="selectedCategories" :inputId="category.key" name="category" :value="category.key" />
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
            <Select v-model="orderedBy" :options="orderBy" optionLabel="name" placeholder="Sort By:" />

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
        <RouterLink v-if="last_deck" :to="{}" class="link-router" @click="nextDecks(last_deck)">View More</RouterLink>
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
}
</style>