<template>
    <div class="col">
        <div class="my-card-deck" :style="backgroundImage(data.deck_highlight)" :key="data.id">
            <div class="deck-date">
                <Chip :label="moment(data.catalogue_edition).format('MMM YYYY')" />
            </div>
            <div class="deck-info">
                <div class="deck-info-desc">
                    <span class="deck-name" @click="routingDeck(data.id)">{{ data.title }}</span>
                    <div class="deck-tag gap-2">
                        <Tag v-for="t in data.tag" severity="secondary" :value="'#' + t" @click="searchPage(`#${t}`)"></Tag>
                    </div>
                </div>
                <div class="deck-info-like">
                    <div class="button-like">
                        <Button severity="secondary" label="Favourite" @click="favoriteFn(data.id)">
                            <img draggable="false" width="40" height="40" fill="none" :src="FavoriteBlackIcon"
                                v-if="!fav" />
                            <img draggable="false" width="40" height="40" fill="none" :src="FavoriteRedIcon"
                                v-if="fav" />
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
import { ref, defineEmits, onMounted } from 'vue';

import FavoriteBlackIcon from '@/assets/img/icon/favorite_black.png';
import FavoriteRedIcon from '@/assets/img/icon/favorite_red.png';
import { FavoriteFirestore } from '@/lib/Favorite';
import moment from 'moment';

const props = defineProps({
    data: {
        type: Object,
    },
    email: {
        type: String,
    }
});

/* FUNCTION START */
const routingDeck = (deckID) => {
    router.push({
        name: 'deckdetail',
        params: { deckID: deckID }
    });
}

const fav = ref(false);

const favoriteClicked = async (id) => {
    await FavoriteFirestore.favoriteFn(props.email, id);
};

const favoriteFn = async (id) => {
    await favoriteClicked(id);
    fav.value = !fav.value;
};

const FavoriteIcon = async (userID, deckID) => {

    const fav = await FavoriteFirestore.isFavorite(userID, deckID)
    if (fav) {
        return true;
    }
    else return false;
};

const backgroundImage = (img) => {
    return {
        'background-image': `url('${img}')`,
        'background-size': 'cover'
    }
}
const searchPage = (value) =>{
    router.push({
        name: 'search',
        query: { query: value }
    });
}
onMounted(async () => {
    fav.value = await FavoriteIcon(props.email, props.data.id);
});
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
    padding: 0 10px;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.deck-name:hover {
    /* background-color: rgba(115, 38, 217, 0.1); */
    /* background-color: var(--p-button-secondary-hover-background); */
    /* border-radius: 20px; */
    cursor: pointer;
    text-decoration: underline;
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