<script setup lang="ts">
import router from "@/router";
import { onMounted, ref, watch } from "vue";
import _ from 'lodash';
const items = ref([
    { label: 'Electronics' },
    { label: 'Computer' },
    { label: 'Accessories' },
    { label: 'Keyboard' },
    { label: 'Wireless' }
]);
const showBack = ref(false);

defineProps({
    icon: {
        type: String,
    },
    icon_text: {
        type: String,
    },
    title: {
        type: String
    },
    breadcrumb: {
        type: Array
    },
    line4: {
        type: Object
    },
});

const back = () => {
    router.back();
};

onMounted(() => {
    const { params } = router.currentRoute.value;
    if (_.isEmpty(params)) {
        showBack.value = false;
    }
    if (params.cateID || params.deckID) {
        showBack.value = true;
    }
});

watch(() => router.currentRoute.value.params, () => {
    const { params } = router.currentRoute.value;
    if (_.isEmpty(params)) {
        showBack.value = false;
    }
    if (params.cateID || params.deckID) {
        showBack.value = true;
    }
});
</script>

<template>
    <div v-if="showBack">
        <span style="padding-right: 5px; list-style: none"><</span>
        <span class="back" @click="back">Back</span>
    </div>
    <div class="flex gap-2 section">
        <!-- <i class="pi pi-cog"></i> -->
        <img :src="icon" width="25" height="25" draggable="false">
        <span>{{ icon_text }}</span>
    </div>
    <span class="my-second-line" v-if="title">
        {{ title }}
    </span>
</template>


<style scoped>
.my-second-line {
    display: flex;
    flex-direction: row;
    font-weight: 500;
    font-size: 24px;
}

.section {
    padding-top: 15px;
}
.back:hover {
    cursor: pointer;
    text-decoration: underline;
}
</style>