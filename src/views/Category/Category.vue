<script setup>
// import

// components
import DockItem from '../../components/Dock.vue';
import CarouselItem from '../../components/Carousel.vue'
import CateCardItem from '../../components/CateCard.vue'
import SectionItem from '../../components/Section.vue'
import SupplyChainIcon from '@/assets/img/icon/supply-chain.png';
import { onMounted, ref } from 'vue';
import { CategoryFirestore } from "@/lib/Category";

const sectionIcon = SupplyChainIcon;
const sectionText = "Category";
const sectionTitle = "Browse by Category:";

const categories = ref();

onMounted(async () => {
  categories.value = await getCategories();
});

const getCategories = async () => {
  const categoryList = [];
  (await CategoryFirestore.getCategories()).forEach(category => {
    const data = category.data();
    const object = {
      id: category.id,
      name: data.name ? data.name.replaceAll(" ", "\n") : "",
      image: data.image,
      created: data.created ? data.created.toDate().toLocaleString() : '',
      created_by: data.created_by || '',
      updated: data.updated ? data.updated.toDate().toLocaleString() : '',
      updated_by: data.updated_by || ''
    };

    categoryList.push(object);
    // console.log('categoryList', categoryList);
  });

  return categoryList;
};
</script>

<template>
  <DockItem></DockItem>
  <CarouselItem></CarouselItem>

  <div class="flex min-height-750">
    <div class="col-1">
    </div>
    <div class="col-11">

      <SectionItem :title="sectionTitle" :icon="sectionIcon" :icon_text="sectionText"></SectionItem>

      <div class="card-container">
        <CateCardItem v-for="data in categories"  :data="data"></CateCardItem>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
}
</style>
