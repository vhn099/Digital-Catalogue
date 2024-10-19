<script setup lang="ts">
import ContactUsSuccessPage from './ContactUsSuccessPage.vue';


defineProps({
    title: {
        type: String
    },
    iconStyle: {
        type: Object
    },
    pageBody: {
        type: String
    }
});
</script>

<template>
    <div class="message-container">
        <p class="page-title">{{ title }}</p>
        <i class="pi pi-check-circle" :style="{ ...iconStyle }"></i>
        <div class="page-body-container" v-if="pageBody === 'contact'">
            <ContactUsSuccessPage />
        </div>
    </div>
</template>

<style scoped>
.page-title {
    padding-bottom: 5%;
    padding-top: 4%;
    font-size: 32px;
    font-weight: 500;
    font-family: 'Poppins';
}

.message-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.page-body-container {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
</style>