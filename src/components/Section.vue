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
        type: String
    },
    line4: {
        type: Object
    }
});
</script>

<template>
    <div class="flex gap-2 mt-1 pt-4">
        <!-- <i class="pi pi-cog"></i> -->
         <img :src="icon" width="25">
        <span>{{ icon_text }}</span>
    </div>
    <span class="my-second-line" v-if="title">
        {{ title }}
    </span>
</template>


<style scoped>
.my-second-line {
    font-weight: 500;
    font-size: 24px;
}
</style>