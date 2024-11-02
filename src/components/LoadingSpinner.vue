<script setup>
import ProgressSpinner from 'primevue/progressspinner';


</script>

<template>
    <div class="container">
        <ProgressSpinner />
    </div>
</template>

<style>
.container {
    position: fixed;
    top: 0; /* Ensure it starts at the top */
    left: 0; /* Ensure it starts at the left */
    height: 100vh;
    width: 100vw;
    background: rgba(238, 238, 238, 0.6); /* Use rgba for background to maintain opacity */
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>