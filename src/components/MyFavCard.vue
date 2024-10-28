<script setup>
// components
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import router from '@/router';
import { defineEmits } from 'vue';

defineProps({
    fav_id: {
        type: String,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    deck_img: {
        type: String,
    },
    isnew: {
        type: Boolean,
    },
    tag_arr: {
        type: Array,
    },

});

/* FUNCTION START */
const deckRouting = () => {
    router.push({
        name: 'decks'
    });
}

const emit = defineEmits(['callFunction']);

const callDeleteFav = (id) => {
  emit('callFunction', id);
};
const favoriteFN = () =>{
    alert("Function is under development");
}
/* FUNCTION END */
</script>

<template>
    <div class="fav-canva">
        <Card style="width: 25rem; overflow: hidden" v-if="!isnew">
            <template #header>
                <img alt="user header" :src="deck_img" draggable="false" width="400" height="256" />
            </template>
            <template #title><div class="title-fav" @click="favoriteFN()">{{ title }}</div></template>
            <template #subtitle>
                <div class="fav-tag">
                    <Tag severity="secondary" class="tag-fav" v-for="tag in tag_arr" :key="tag" :value='"#" + tag' @click="favoriteFN()"></Tag>
                </div>

            </template>
            <template #content>
                <p class="m-0 content-fav">
                    {{ description }}
                </p>
            </template>
            <template #footer>
                <Button icon="pi pi-trash" severity="warn" class="w-full" @click="callDeleteFav(fav_id)" />
            </template>
        </Card>

        <Card class="new-fav-canva" style="width: 25rem; overflow: hidden" v-if="isnew">
            <template #content>
                <div class="add-new-fav" @click="deckRouting">
                    <div class="new-icon">
                        <i class="pi pi-plus-circle" style="color: #c1c1c1; font-size: 250px;"></i>
                    </div>
                    <div class="add-more-text">
                        <span style="font-size: 28px; font-weight: 500; color: #c1c1c1;">Add More Desk</span>
                    </div>
                </div>
            </template>
        </Card>
    </div>

</template>

<style scoped>
.fav-tag .p-tag {
    background: #999999C7;
    color: white;
    font-size: 14px;
    font-weight: 600;
    margin-right: 5px;
    border-radius: 25px;
}

.fav-tag {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.title-fav {
    /* min-height: 70px; */
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    /* min-height: 155px; */
}

.title-fav:hover {
    cursor: pointer;
    text-decoration: underline;
}

:deep(.p-card-body) {
    height: 100%;
}


:deep(.p-card-body .p-card-footer) {
    margin-top: auto;
}

:deep(.p-card-content) {
    height: inherit;
}

.add-new-fav {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: inherit;
    cursor: pointer;
}

.new-fav-canva:hover {
  background-color: var(--p-button-secondary-hover-background);
}


.new-icon {
    padding: 15px;
}

.add-more-text {
    padding: 15px;
}

.tag-fav {
    cursor: pointer;
}

.content-fav {
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 155px;
}

</style>