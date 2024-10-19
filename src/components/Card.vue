
<template>
    <div class="col">
    <div class="my-card-deck">
        <div class="second-layout">
            <div class="deck-date">Oct 2024</div>
        </div>
    </div>
</div>
</template>

<script setup>

import { ref, onMounted } from "vue";
import Button from 'primevue/button';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
</script>

<style scoped>
.my-card-deck {
    height: 365px;
    /* width: inherit; */
    background-color: bisque;
    border-radius: 10px;
    border: 1px solid #000000;
    background-image: url("../assets/img/login/mask-group.png");
}

.second-layout {
    height: inherit;
    width: inherit;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%);
}


</style>