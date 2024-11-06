<template>

    <div class="flex myNav">
        <div class="flex-1 flex align-items-center m-2 px-5 py-1 my-nav-1">
            <div class="my-logo">
                <img draggable="false" style="cursor: pointer;" @click="() => { router.push({ name: 'home' }) }"
                    alt="logo" src="../assets/img/logo.png" />
            </div>
        </div>

        <div class="flex-1 flex align-items-center justify-content-center m-2 px-5 py-1 my-nav-2">
            <span class="my-nav-text">Innovation Portal</span>
        </div>
        <div class="flex-1 flex gap-3 align-items-center justify-content-end m-2 px-5 py-1 my-nav-3">
            <Menubar :model="items" class="admin-menu" v-if="admin" />
            <!-- <InputText placeholder="Search" type="text" class="w-32 sm:w-auto" /> -->
            <IconField>
                <InputText v-model="inputSearch" placeholder="text or #tag search ..." v-on:keyup.enter="searchData" />
                <InputIcon class="pi pi-search" variant="filled" @click="searchData" style="cursor: pointer;" />
            </IconField>
            <!-- <i @click="routing('myfavorite')" class="pi pi-heart" style="font-size: 43px; color: white; cursor: pointer;"></i> -->
            <img draggable="false" width="45" class="fav-header" height="45" @click="routing('myfavorite')" fill="none"
                src="../assets/img/icon/favorite_white.png" />
            <Avatar @click="routing('profile')" :label="avatarName" class="my-avatar" shape="circle" />
        </div>
    </div>

</template>

<script setup>
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';
import Menubar from 'primevue/menubar';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';


import { onMounted, ref, watch } from "vue";
import router from '@/router';
import { UserFirestore } from '@/lib/User';
import { COMMON_FUNCTIONS } from '@/lib/Common';
import { useAppStore } from '@/stores';

/* REF DEFINITIONS START */
const currentUser = ref({});
const admin = ref(false);
const inputSearch = ref("");
const avatarName = ref("");
/* REF DEFINITION END */

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
                label: 'Favorite',
                icon: 'pi pi-heart',
                command: () => {
                    router.push({
                        name: 'adminfavorite'
                    });
                },
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
                label: 'Received Messages',
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
const routing = (routeName) => {
    useAppStore().setDeckCategory("");
    router.push({
        name: routeName
    })
};
const searchData = () => {
    router.push({
        name: 'search',
        query: { query: inputSearch.value }
    });
};
const handleCheckingAdmin = () => {
    const cookie = UserFirestore.getCookie("user-auth");
    if (COMMON_FUNCTIONS.isJSONString(cookie)) {
        currentUser.value = JSON.parse(cookie);
        if (currentUser.value.userData) {
            admin.value = currentUser.value.userData.isAdmin;
            const firstname = currentUser.value.userData.firstname;
            const lastname = currentUser.value.userData.lastname;
            if (firstname || lastname) {
                let finalName = "";
                const fullName = firstname + " " + lastname;
                const arrayName = fullName.split(" ");
                arrayName.forEach(name => {
                    finalName += name[0].toUpperCase();
                });
                avatarName.value = finalName
            }
        }
    }
}
/* FUNCTION END */

onMounted(() => {
    handleCheckingAdmin();
});

watch(() => router.currentRoute.value.name, () => {
    handleCheckingAdmin()
});
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

@media (max-width: 992px) {
    .my-nav-2 {
        display: none !important;
    }

    .my-nav-1 {
        display: none !important;
    }
}

.my-avatar:hover {
    background-color: white;
}

.fav-header {
    cursor: pointer;
}

.fav-header:hover {
    content: url('../assets/img/icon/favorite_red.png')
}


:deep(.p-menubar) {
    min-height: 43px;
    border-radius: 25px;
}

:deep(.p-menubar-root-list) {
    height: 43px;
    border-radius: 25px;
}

:deep(.p-menubar-item-content) {
    height: 43px;
    border-radius: 25px !important;
}

:deep(.p-menubar-item-link) {
    height: 100%;
}

:deep(.p-menubar-submenu) {
    border-radius: 25px;
}
</style>
