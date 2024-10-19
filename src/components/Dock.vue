<template>
    <Dock class="myDock" :model="items" :position="position">
        <template #itemicon="{ item }">
            <img @click="item.eventHandler" class="icon-image" :alt="item.label" :src="item.icon" />
            <span> {{ item.label }}</span>
        </template>
    </Dock>
</template>

<script setup>
import router from '@/router';
import { getAuth, signOut } from 'firebase/auth';
import Dock from 'primevue/dock';

import { ref } from "vue";

const items = ref([
    {
        label: 'Home',
        icon: 'src/assets/img/homepage/home.png',
        eventHandler: () => {
            router.push({
                name: 'home'
            });
        }
    },
    {
        label: 'Category',
        icon: 'src/assets/img/homepage/supply-chain.png',
        eventHandler: () => {
            router.push({
                name: 'category'
            });
        }
    },
    {
        label: 'Desks',
        icon: 'src/assets/img/homepage/deck.png',
        eventHandler: () => {
            router.push({
                name: 'desks'
            });
        }
    },
    {
        label: 'Contact Us',
        icon: 'src/assets/img/homepage/support.png',
        eventHandler: () => {
            router.push({
                name: 'contactus'
            });
        }
    },
    {
        label: 'Logout',
        icon: 'src/assets/img/homepage/logout.png',
        eventHandler: async () => {
            await signOut(getAuth());
            router.push({
                name: 'signin'
            });
        }
    }
]);
const position = 'left';

</script>

<style scoped>
.myDock {
    z-index: 99999;
}

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
    margin-bottom: 13px;
}

:deep(.p-dock-list li:last-child) {
    margin: 100px 0 0 0;
}

:deep(.p-dock-item-link) {
    width: 60px;
    height: 75px;
    justify-content: unset;
    cursor: pointer;
}

:deep(.p-dock-item-link) img {
    height: 50%;
}

:deep(.p-dock-item-link) span {
    font-size: 10px;
    font-weight: 700;

}
</style>
