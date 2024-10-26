<template>
    <div class="col">
        <div class="my-card-deck" :style="backgroundImage(data.deck_highlight)" :key="data.id">
            <div class="deck-date">
                <Chip :label="data.created" />
            </div>
            <div class="deck-info">
                <div class="deck-info-desc">
                    <span class="deck-name" @click="routingDeck(data.id)">{{ data.title }}</span>
                    <div class="deck-tag gap-2">
                        <Tag v-for="t in data.tag" severity="secondary" :value="'#' + t"></Tag>
                    </div>
                </div>
                <div class="deck-info-like">
                    <div class="button-like">
                        <Button severity="secondary" label="Favourite" @click="favoriteFn('5KGLQrFEKbZBUmAcEYpd')">
                            <!-- <img draggable="false" width="40" height="40" fill="none" :src="FavoriteBlackIcon" /> -->
                            <img draggable="false" width="40" height="40" fill="none" :src="FavoriteRedIcon" />
                            <label>Favourite</label>
                        </Button>
                        <!-- <Button label="Favourite" icon="pi pi-heart" iconPos="top" /> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Chip from 'primevue/chip';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import router from '@/router';
import { computed, defineEmits } from 'vue';

import FavoriteBlackIcon from '@/assets/img/icon/favorite_black.png';
import FavoriteRedIcon from '@/assets/img/icon/favorite_red.png';

defineProps({
    data: {
        type: Object,
    }
});

/* FUNCTION START */
const routingDeck = (deckID) => {
    router.push({
        name: 'deckdetail',
        params: { id: deckID }
    });
}

const emit = defineEmits(['callFavoriteFn']);

const favoriteFn = (id) => {
  emit('callFavoriteFn', id);
};

const backgroundImage = (img) => {
   return {
     'background-image': `url(${img})`,
     'background-size': 'cover'
   }
}
/* FUNCTION END */
</script>

<style scoped>
:deep(.deck-date .p-chip) {
    background: #999999C7;
    color: white;
    font-size: 14px;
    font-weight: 900;
}

:deep(.deck-tag .p-tag) {
    background: #999999C7;
    color: white;
    font-size: 10px;
    font-weight: 600;
    margin-left: 5px;
    border-radius: 25px;
    cursor: pointer;
}

.deck-name {
    font-size: 36px;
    font-weight: 500;
    line-height: 54px;
    cursor: pointer;
    padding: 0 10px;
}

.deck-name:hover {
    background-color: rgba(115, 38, 217, 0.1);
    border-radius: 20px;
}

.my-card-deck {
    height: 365px;
    min-width: 365px;
    background-color: bisque;
    border-radius: 10px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.deck-date {
    align-self: flex-end;
    padding: 20px;
}

.deck-info {
    align-items: flex-end;
    display: flex;
    padding: 50px 20px 20px 20px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%);
    /* margin-top: 30px; */
    justify-content: space-between;
}

.deck-info-desc {
    align-self: flex-end;
}

.deck-info-like {
    align-items: flex-end;
}

/* .button-like {
    align-items: end;
} */
 
/* :deep(.button-like .p-button-icon) {
    font-size: 50px;
}

:deep(.button-like .p-button-label) {
    font-size: 10px;
    font-weight: 700;
} */

:deep(.button-like .p-button) {
    /* font-size: 50px; */
    display: flex;
    flex-direction: column;
    width: 90px;
}
:deep(.button-like .p-button) {
    font-size: 10px;
    font-weight: 700;
}
</style>