<script setup lang="ts">
import { ref } from 'vue';

/* REF DEFINE START */
const inner = ref(null);
/* REF DEFINE END */


defineProps({
    card: {type:Object}
})
</script>
<template>
    <div class="carousel">
        <div class="inner" ref="inner">
            <div class="card">
                <!-- {{ card }} -->
                <div class="cate-item">
                    <div class="cate-logo">
                        <img width="52" height="52" fill="none" :src="card.icon" />
                    </div>
                    <div class="cate-name">
                        {{ card.name }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.p-button-icon-only.p-button-rounded) {
    height: inherit;
}

:deep(.p-button-icon-only.p-button-rounded span) {
    font-size: 50px;
}

.carousel {
    /* width: 170px; */
    overflow: hidden;
}

.inner {
    transition: transform 0.2s;
    white-space: nowrap;
    /* margin: 10px; */
}

.card {
    width: 124px;
    height: 124px;
    display: inline-flex;
    box-shadow: 0px 4px 4px 0px #00000040;
    margin: 10px;
    /* optional */
    background-color: white;
    color: black;
    border-radius: 25px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    /* 
  display: flex;
  flex-direction: column; */
}


.cate-item {
    width: 100%;
    height: 100%;
    padding: 20px 10px 10px 10px;
}

.cate-logo {
    display: grid;
    place-items: center;
    height: 60%;
}

.cate-name {
    /* display: grid;
  place-items: center; */
    /* Centers both vertically and horizontally */
    height: 40%;
    width: 100%;
    /* Full height of the outer container */
    /* border: 1px solid black; */
    /* Optional: to see the outer container */
    word-wrap: break-word;
    /* Ensures long words wrap inside the box */
    overflow-wrap: break-word;
    /* Alternative for word wrapping */
    text-align: center;
    white-space: normal !important;
    font-size: 15px;
    font-weight: 600;
}
</style>
