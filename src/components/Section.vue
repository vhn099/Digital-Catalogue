<script setup lang="ts">
import Breadcrumb from "primevue/breadcrumb";
import { ref } from "vue";
const items = ref([
    { label: 'Electronics' },
    { label: 'Computer' },
    { label: 'Accessories' },
    { label: 'Keyboard' },
    { label: 'Wireless' }
]);

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
    }
});
</script>

<template>
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
</style>