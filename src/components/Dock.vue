<template>
    <Dock class="myDock" :model="items" :position="position">
        <template #itemicon="{ item }">
            <div class="icon-hover" @click="item.eventHandler">
                <img class="icon-image" :alt="item.label" :src="item.icon"
                    draggable="false" />
            </div>
            <span> {{ item.label }}</span>
        </template>
    </Dock>
    <div class="hidden-image-load">
        <img :src="HomeWhiteIcon" />
        <img :src="CateWhiteIcon" />
        <img :src="DeckWhiteIcon" />
        <img :src="SPWhiteIcon" />
        <img :src="LogoutWhiteIcon" />
    </div>
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

import HomeWhiteIcon from '@/assets/img/icon/home_white.png';
import CateWhiteIcon from '@/assets/img/icon/supply-chain_white.png';
import DeckWhiteIcon from '@/assets/img/icon/presentation_white.png';
import SPWhiteIcon from '@/assets/img/icon/support_white.png';
import LogoutWhiteIcon from '@/assets/img/icon/logout_white.png';

import { ref } from "vue";
import { UserFirestore } from '@/lib/User';
import { useAppStore } from '@/stores';

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
            useAppStore().setDeckCategory("");
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
    height: 100%;
    /* height: 50px;
    width: 50px; */
    /* padding: 10px; */
}


/* Cực khổ vãi cái lồn, xin đừng đụng vào CSS này */
:deep(.p-dock-list) li:nth-child(1):hover .icon-hover {
    background-color: #7326D9;
    border-radius: 50px;   
}
:deep(.p-dock-list) li:nth-child(1):hover img {
    content: url('../assets/img/icon/home_white.png')
}

:deep(.p-dock-list) li:nth-child(2):hover .icon-hover {
    background-color: #7326D9;
    border-radius: 50px;   
}
:deep(.p-dock-list) li:nth-child(2):hover img {
    content: url('../assets/img/icon/supply-chain_white.png')
}

:deep(.p-dock-list) li:nth-child(3):hover .icon-hover {
    background-color: #7326D9;
    border-radius: 50px;   
}
:deep(.p-dock-list) li:nth-child(3):hover img {
    content: url('../assets/img/icon/presentation_white.png')
}

:deep(.p-dock-list) li:nth-child(4):hover .icon-hover {
    background-color: #7326D9;
    border-radius: 50px;   
}
:deep(.p-dock-list) li:nth-child(4):hover img {
    content: url('../assets/img/icon/support_white.png')
}

:deep(.p-dock-list) li:nth-child(5):hover .icon-hover {
    background-color: #7326D9;
    border-radius: 50px;   
}
:deep(.p-dock-list) li:nth-child(5):hover img {
    content: url('../assets/img/icon/logout_white.png')
}

:deep(.p-dock-item-link) span {
    font-size: 10px;
    font-weight: 700;
}

.icon-hover {
    width: 60px;
    height: 60px;
    padding: 10px;
}

.hidden-image-load {
    display: none;
}
</style>
