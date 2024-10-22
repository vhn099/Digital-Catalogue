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
    text-align: center;
    background: #eee;
    opacity: 0.6;
    z-index: 99999;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
    overflow-x: hidden;
    overflow-y: hidden;
}
</style>