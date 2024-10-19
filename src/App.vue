<script setup>
import { ref } from 'vue';
import { RouterView, useRoute } from "vue-router";
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

const route = useRoute();
</script>

<template>
  <!-- {{ value2 }} -->
  <Header v-if="route.name != 'signin'"></Header>
  <router-view />
  <Footer v-if="route.name != 'signin'"></Footer>
</template>

<style scoped>

</style>
