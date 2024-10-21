<script setup lang="ts">
import { CategoryFirestore } from '@/lib/Category';
import CateSmallItem from './CateSmall.vue';
import Button from 'primevue/button';
import { computed, onMounted, ref } from 'vue';

/* REF DEFINE START */
const cards = ref();
let innerStyles = ref({});
const step = ref('');
const transitioning = ref(false);
const inner = ref(null);
/* REF DEFINE END */

/* FUNCTIONS START */
const resetTranslate = () => {
  innerStyles.value = {
    transition: 'none',
    transform: `translateX(-${step.value})`
  }
};

const prev = () => {
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

const moveLeft = () => {
  innerStyles.value = {
    transform: `translateX(-${step.value})
                    translateX(-${step.value})`
  }
};

const moveRight = () => {
  innerStyles.value = {
    transform: `translateX(${step.value})
                    translateX(-${step.value})`
  }
};
const next = () => {
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
const afterTransition = (callback) => {
  const listener = () => {
    callback();
    inner.value.removeEventListener('transitionend', listener);
  }
  inner.value.addEventListener('transitionend', listener);
};
const setStep = () => {
  const innerWidth = inner.value.scrollWidth;
  const totalCards = cards.value.length;
  step.value = `${innerWidth / totalCards}px`;
};
const getCategories = async () => {
  const categoryList = [];
  (await CategoryFirestore.getCategories()).forEach(category => {
    const data = category.data();
    const object = {
      id: category.id,
      name: data.name,
      icon: data.image,
    };

    categoryList.push(object);
  });

  // console.log('categoryList', categoryList);
  return categoryList;
};
/* FUNCTION END */

onMounted(async () => {
  cards.value = await getCategories();
  setStep();
  resetTranslate();
});
</script>
<template>
  <div class="flex slide-horizontal">

    <Button icon="pi pi-angle-left" text rounded aria-label="Filter" @click="prev" />

    <CateSmallItem v-for="data in cards"  :card="data"></CateSmallItem>
    <!-- <div class="carousel">
      <div class="inner" ref="inner" :style="innerStyles">
        <div class="card" v-for="card in cards" :key="card">
          <div class="cate-item">
            <div class="cate-logo">
              <img width="52" height="52" fill="none" :src="card.icon" />
            </div>
            <div class="cate-name">
              {{ card.name }}
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <Button icon="pi pi-angle-right" text rounded aria-label="Filter" @click="next" />

    <!-- <Button icon="pi pi-star" severity="contrast" @click="next" text rounded aria-label="Star" /> -->
  </div>
</template>

<style scoped>
:deep(.p-button-icon-only.p-button-rounded) {
  height: inherit;
}

:deep(.p-button-icon-only.p-button-rounded span) {
  font-size: 50px;
}

/* 
.slide-horizontal {
  height: 300px;
  padding-right: 20px;
} */

.carousel {
  /* width: 170px; */
  overflow: hidden;
}

.inner {
  transition: transform 0.2s;
  white-space: nowrap;
  /* margin: 10px; */
}

.card {
  width: 124px;
  height: 124px;
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
  /* 
  display: flex;
  flex-direction: column; */
}


.cate-item {
  width: 100%;
  height: 100%;
  padding: 20px 10px 10px 10px;
}

.cate-logo {
  display: grid;
  place-items: center;
  height: 60%;
}

.cate-name {
  /* display: grid;
  place-items: center; */
  /* Centers both vertically and horizontally */
  height: 40%;
  width: 100%;
  /* Full height of the outer container */
  /* border: 1px solid black; */
  /* Optional: to see the outer container */
  word-wrap: break-word;
  /* Ensures long words wrap inside the box */
  overflow-wrap: break-word;
  /* Alternative for word wrapping */
  text-align: center;
  white-space: normal !important;
  font-size: 15px;
  font-weight: 600;
}
</style>
