<template>
    <div class="cate-card-box" :key="data.id" @click="deckRouting(data.id)" id="cate-box">
        <div class="cate-card-image">

            <img draggable="false" width="110" height="110" fill="none" :src="data.image" />

        </div>
        <div class="cate-card-name">
            <pre style="font-family: inherit; word-wrap: break-word; white-space: break-spaces; overflow: hidden;">{{ data.name }}</pre>
        </div>
    </div>

</template>
<script setup>
import router from '@/router';
import { useAppStore } from '@/stores';

defineProps({
    data: {
        type: Object,
        // required: true,
        // id: {
        //     type: String,
        //     required: true,
        // },
        // name: {
        //     type: String,
        //     required: true,
        // },
        // image: {
        //     type: String,
        //     required: true,
        // },
    }
});

const deckRouting = (id) => {
    useAppStore().setDeckCategory(id);
    router.push({
        name: 'decks'
    });
    // router.push({
    //     name: 'decks',
    //     params: { cateID: id },
    // });
};
</script>
<style scoped>
.cate-card-box {
    width: 258px;
    height: 258px;
    display: grid;
    margin: 25px;
    place-items: center;
    box-shadow: 0px 4px 4px 0px #00000040;
    background: #FFFFFF;
    cursor: pointer;
    border-radius: 11px;
}

.cate-card-box:hover {
  background-color: var(--p-button-secondary-hover-background);
}

.cate-card-image {
    display: grid;
    place-items: center;
    height: 50%;
}

.cate-card-name {
    height: auto;
    width: 70%;
    overflow: hidden;
    /* word-wrap: break-word;
    overflow-wrap: break-word; */
    text-align: center;
    font-size: 20px;
    font-weight: 600;
}
</style>