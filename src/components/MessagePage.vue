<script setup lang="ts">
import ContactUsSuccessPage from './ContactUsSuccessPage.vue';
import LinkSent from './LinkSent.vue';


defineProps({
    title: {
        type: String
    },
    iconName: {
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
        <p v-if="title" class="page-title">{{ title }}</p>
        <i :class="iconName" :style="{ ...iconStyle }"></i>
        <div class="page-body-container">
            <ContactUsSuccessPage v-if="pageBody === 'contact'"></ContactUsSuccessPage>
            <LinkSent v-if="pageBody === 'login'"></LinkSent>
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