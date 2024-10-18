<script setup>
import { ref } from 'vue';


import { RouterView } from "vue-router";
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <!-- {{ value2 }} -->
  <Header v-if="this.$route.name !== 'signin'"></Header>
  <router-view />
  <Footer v-if="this.$route.name !== 'signin'"></Footer>
</template>

<style scoped>

</style>
