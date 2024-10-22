<template>

    <div class="flex myNav">
        <div class="flex-1 flex align-items-center m-2 px-5 py-1">
            <div class="my-logo">
                <img draggable="false" style="cursor: pointer;" @click="() => { router.push({ name: 'home' }) }" alt="logo"
                    src="../assets/img/logo.png" />
            </div>
        </div>

        <div class="flex-1 flex align-items-center justify-content-center m-2 px-5 py-1">
            <span class="my-nav-text">Innovation Portal</span>
        </div>
        <div class="flex-1 flex gap-3 align-items-center justify-content-end m-2 px-5 py-1">
            <Menubar :model="items" class="admin-menu" v-if="currentUser.isAdmin"/>
            <InputText placeholder="Search" type="text" class="w-32 sm:w-auto" />
            <!-- <i @click="routing('myfavorite')" class="pi pi-heart" style="font-size: 43px; color: white; cursor: pointer;"></i> -->
            <img width="45" height="45" @click="routing('myfavorite')" style="cursor: pointer;" fill="none" src="../assets/img/icon/favorite_white.png" />
            <Avatar @click="routing('profile')" label="T" class="my-avatar" shape="circle" />
        </div>
    </div>

</template>

<script setup>
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';
import Menubar from 'primevue/menubar';

import { onMounted, ref } from "vue";
import router from '@/router';
import { UserFirestore } from '@/lib/User';
const checked = ref(false);
const currentUser = ref({});

const items = ref([
    {
        label: 'Setting',
        icon: 'pi pi-wrench',
        items: [
            {
                label: 'Users',
                icon: 'pi pi-user',
                command: () => {
                    router.push({
                        name: 'adminusers'
                    });
                }
            },
            {
                label: 'Categories',
                icon: 'pi pi-th-large',
                command: () => {
                    router.push({
                        name: 'admincategory'
                    });
                }
            },
            {
                label: 'Decks',
                icon: 'pi pi-clipboard',
                command: () => {
                    router.push({
                        name: 'admindeck'
                    });
                }
            },
            {
                label: 'Received emails',
                icon: 'pi pi-inbox',
                command: () => {
                    router.push({
                        name: 'receivedemail'
                    });
                }
            },
            // {
            //     label: 'Like',
            //     icon: 'pi pi-thumbs-up',
            //     items: [
            //         {
            //             label: 'Apollo',
            //             icon: 'pi pi-heart'
            //         },
            //         {
            //             label: 'Ultima',
            //             icon: 'pi pi-palette'
            //         }
            //     ]
            // },
            {
                label: 'Other config',
                icon: 'pi pi-cog',
                command: () => {
                    router.push({
                        name: 'otherconfig'
                    });
                }
            }
        ]
    }
]);

/* FUNCTION START */
onMounted(async () => {
    currentUser.value = await UserFirestore.getCurrentUser();
});
const routing = (routeName) => {
    router.push({
        name: routeName
    })
}
/* FUNCTION END */
</script>

<style scoped>
.admin-menu {
    padding: 0;
    /* background-color: #7326D9; */
    border: none;
    /* color: white; */
}

.myNav {
    background-color: #7326D9;
}

.myFav {
    color: aliceblue;
}

.p-inputtext {
    border-radius: 25px;
}

.my-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    width: 48px;
}


.my-logo>img {
    object-fit: cover;
    height: 100px;
    margin-top: 27px;
    margin-left: 27px;
}

.my-nav-text {
    font-weight: 700;
    color: white;
    font-size: 25px;
}

.my-avatar {
    cursor: pointer;
    width: 43px;
    height: 43px;
}
</style>
