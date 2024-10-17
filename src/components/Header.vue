<template>

    <div class="flex myNav">
        <div class="flex-1 flex align-items-center m-2 px-5 py-1">
            <div class="my-logo">
                <img alt="logo" src="../assets/img/logo.png"/>
            </div>
        </div>

        <div class="flex-1 flex align-items-center justify-content-center m-2 px-5 py-1">
            <span class="my-nav-text">Innovation Portal</span>
        </div>
        <div class="flex-1 flex gap-2 align-items-center justify-content-end m-2 px-5 py-1">

            <!-- <ToggleSwitch v-model="checked" class="myHeaderToggle">
                <template #handle="{ checked }">
                    <i :class="['!text-xs pi', { 'pi-check': checked, 'pi-times': !checked }]" />
                </template>
            </ToggleSwitch> -->
            <InputText placeholder="Search" type="text" class="w-32 sm:w-auto" />
            <i class="pi pi-heart" style="font-size: 43px; color: white;"></i>

            <Avatar label="T" class="my-avatar" shape="circle" />
        </div>
    </div>

</template>

<script setup>
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';
import Image from 'primevue/image';
import ToggleSwitch from 'primevue/toggleswitch';

import Button from 'primevue/button';

import { ref } from "vue";
const checked = ref(false);

</script>

<style scoped>
.myNav {
    background-color: #7326D9;
;
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


.my-logo > img{
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
    width: 43px;
    height: 43px;
}
</style>
