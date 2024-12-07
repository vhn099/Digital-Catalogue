<script setup>
import { CategoryFirestore } from '@/lib/Category';
import router from '@/router';
import { useAppStore } from '@/stores';
import Button from 'primevue/button';
import { computed, watch, onMounted, ref, nextTick } from 'vue';

/* REF DEFINE START */
const cards = ref();
let innerStyles = ref({});
const step = ref('');
const transitioning = ref(false);
const inner = ref(null);
/* REF DEFINE END */

/* FUNCTIONS START */
function resetTranslate() {
  innerStyles.value = {
    transition: 'none',
    transform: `translateX(-${step.value})`
  }
};

function prev() {
  if (transitioning.value) return;

  transitioning.value = true

  moveRight();

  afterTransition(() => {
    const card = cards.value.pop()
    cards.value.unshift(card)
    resetTranslate();
    transitioning.value = false
  })
};

function moveLeft() {
  innerStyles.value = {
    transform: `translateX(-${step.value})
                    translateX(-${step.value})`
  }
};

function moveRight() {
  innerStyles.value = {
    transform: `translateX(${step.value})
                    translateX(-${step.value})`
  }
};

function next() {
  if (transitioning.value) return;

  transitioning.value = true

  moveLeft();

  afterTransition(() => {
    const card = cards.value.shift();
    cards.value.push(card);
    resetTranslate();
    transitioning.value = false;
  })
};

function afterTransition(callback) {
  const listener = () => {
    callback();
    inner.value.removeEventListener('transitionend', listener);
  }
  inner.value.addEventListener('transitionend', listener);
};

function setStep() {
  const innerWidth = inner.value.scrollWidth;
  const totalCards = cards.value.length;
  step.value = `${innerWidth / totalCards}px`;
};

async function getCategories() {
  const categoryList = [];
  (await CategoryFirestore.getCategories()).forEach(category => {
    const data = category.data();
    const object = {
      id: category.id,
      name: data.name ? data.name.replaceAll(" ", "\n") : "",
      icon: data.image,
    };

    categoryList.push(object);
  });

  return categoryList;
};

const categoryRouting = (id) => {
  useAppStore().setDeckCategory(id);
  router.push({
    name: 'decks',
  });
  // router.push({
  //   name: 'decks',
  //   params: { cateID: id }
  // });
}
/* FUNCTION END */

onMounted(async () => {
  cards.value = await getCategories();
  await nextTick();
  
  const cardItems = document.getElementsByClassName("card");
  let largestWidth = 124;
  let largestHeight = 124;
  for (let i = 0; i < cardItems.length; i++) {
    if (cardItems[i].offsetWidth > largestWidth) {
      largestWidth = cardItems[i].offsetWidth;
    }
    if (cardItems[i].offsetHeight > largestHeight) {
      largestHeight = cardItems[i].offsetHeight;
    }
  }
  for (let i = 0; i < cardItems.length; i++) {
    cardItems[i].style.width = `${largestWidth}px`;
    cardItems[i].style.height = `${largestHeight + 15}px`;
  }
  setStep();
  resetTranslate();
});
</script>
<template>
  <div class="flex slide-horizontal">

    <Button icon="pi pi-angle-left" text aria-label="Filter" @click="prev" />

    <!-- <CateSmallItem v-for="data in cards"  :card="data"></CateSmallItem> -->
    <div class="carousel">
      <div class="inner" ref="inner" :style="innerStyles">
        <div class="card" v-for="card in cards" :key="card">
          <div class="cate-item" @click="categoryRouting(card.id)">
            <div class="cate-logo">
              <img draggable="false" width="52" height="52" fill="none" :src="card.icon" />
            </div>
            <div class="cate-name">
              <pre style="font-family: inherit;">{{ card.name }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Button icon="pi pi-angle-right" text aria-label="Filter" @click="next" />

  </div>
</template>

<style scoped>
:deep(.p-button-icon-only) {
  height: inherit;
}

:deep(.p-button-icon-only span) {
  font-size: 50px;
}

:deep(.p-button-text:not(:disabled):active) {
  background: transparent;
}

:deep(.p-button-text:not(:disabled):hover) {
  background: transparent;
}

.carousel {
  overflow: hidden;
}

.inner {
  transition: transform 0.2s;
  white-space: nowrap;
}

.card {
  /* width: 124px; */
  /* height: 160px; */
  display: inline-flex;
  box-shadow: 0px 4px 4px 0px #00000040;
  margin: 10px;
  /* optional */
  background-color: white;
  color: black;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.card:hover {
  background-color: var(--p-button-secondary-hover-background);
}


.cate-item {
  width: 100%;
  height: 100%;
  padding: 5px 10px 15px 10px;
}

.cate-logo {
  display: grid;
  place-items: center;
  height: 60%;
}

.cate-name {
  height: 40%;
  width: 100%;
  text-align: center;
  white-space: normal !important;
  font-size: 15px;
  font-weight: 600;
}
</style>
