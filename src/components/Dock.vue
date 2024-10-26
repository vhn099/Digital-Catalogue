<template>
    <Dock class="myDock" :model="items" :position="position">
        <template #itemicon="{ item }">
            <!-- <div> -->
                <img @click="item.eventHandler" class="icon-image" :alt="item.label" :src="item.icon"
                    draggable="false" />
            <!-- </div> -->
            <span> {{ item.label }}</span>
        </template>
    </Dock>
</template>

<script setup>
import router from '@/router';
import { getAuth, signOut } from 'firebase/auth';
import Dock from 'primevue/dock';
import HomeIcon from '@/assets/img/homepage/home.png';
import SupplyChainIcon from '@/assets/img/homepage/supply-chain.png';
import DeckIcon from '@/assets/img/homepage/deck.png';
import SupportIcon from '@/assets/img/homepage/support.png';
import LogoutIcon from '@/assets/img/homepage/logout.png';

import { ref } from "vue";
import { UserFirestore } from '@/lib/User';

const items = ref([
    {
        label: 'Home',
        icon: HomeIcon,
        eventHandler: () => {
            router.push({
                name: 'home'
            });
        }
    },
    {
        label: 'Category',
        icon: SupplyChainIcon,
        eventHandler: () => {
            router.push({
                name: 'category'
            });
        }
    },
    {
        label: 'Decks',
        icon: DeckIcon,
        eventHandler: () => {
            router.push({
                name: 'decks'
            });
        }
    },
    {
        label: 'Contact Us',
        icon: SupportIcon,
        eventHandler: () => {
            router.push({
                name: 'contactus'
            });
        }
    },
    {
        label: 'Logout',
        icon: LogoutIcon,
        eventHandler: async () => {
            await signOut(getAuth());
            UserFirestore.setCookie("user-auth", "", 0);
            setTimeout(() => {
                router.push({
                    name: 'signin'
                });
            }, 200);
        }
    }
]);
const position = 'left';

</script>

<style scoped>
.myDock {
    z-index: 99999;
    top: 150px !important;
    height: 600px;
    display: block;
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
    height: 80%;
    padding: 5px;
}


:deep(.p-dock-item-link) img:hover {
    background-color: #7326D9;
    border-radius: 50px;
}


:deep(.p-dock-item-link) span {
    font-size: 10px;
    font-weight: 700;
}
</style>
