
<template>
         <Dock class="myDock" :model="items" :position="position" >
                <template #itemicon="{ item }">
                    <img :alt="item.label" :src="item.icon"/>
                    <span> {{ item.label }}</span>
                </template>
            </Dock>
</template>

<script setup>
import Dock from 'primevue/dock';

import { ref } from "vue";

const items = ref([
    {
        label: 'Home',
        icon: 'src/assets/img/homepage/home.png'
    },
    {
        label: 'Category',
        icon: 'src/assets/img/homepage/supply-chain.png'
    },
    {
        label: 'Desks',
        icon: 'src/assets/img/homepage/deck.png'
    },
    {
        label: 'Contact Us',
        icon: 'src/assets/img/homepage/support.png'
    },
    {
        label: 'Logout',
        icon: 'src/assets/img/homepage/logout.png'
    }
]);
const position = 'left';

</script>

<style scoped>
:deep(.p-dock-list-container) {
  background-color: white;
  padding: 30px 5px;
  margin: 25px;
  border-radius: 35px;
  box-shadow: 0px 4px 4px 0px #00000040;
}
:deep(.p-dock-item) {
  padding: 0px;
}

:deep(.p-dock-list li) {
  margin-bottom: 30px;
}

:deep(.p-dock-list li:last-child) {
  margin: 200px 0 0 0;
}

:deep(.p-dock-item-link) {
    width: 60px;
    height: 60px;
}

:deep(.p-dock-item-link) img{
    height: 50%;
}

:deep(.p-dock-item-link) span{
    font-size: 10px;
    font-weight: 700;

}

</style>
