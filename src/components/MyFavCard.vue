<script setup>
// components
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import router from '@/router';

defineProps({
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
/* FUNCTION END */
</script>

<template>
    <div class="fav-canva">
        <Card style="width: 25rem; overflow: hidden" v-if="!isnew">
            <template #header>
                <img alt="user header" :src="deck_img" draggable="false" width="400" height="256" />
            </template>
            <template #title>{{ title }}</template>
            <template #subtitle>
                <div class="fav-tag">
                    <Tag severity="secondary" v-for="tag in tag_arr" :key="tag" :value='"#" + tag'></Tag>
                </div>

            </template>
            <template #content>
                <p class="m-0">
                    {{ description }}
                </p>
            </template>
            <template #footer>
                <Button icon="pi pi-trash" severity="warn" class="w-full" @click="deleteFav()" />
            </template>
        </Card>

        <Card style="width: 25rem; overflow: hidden" v-if="isnew">
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

.new-icon {
    padding: 15px;
}

.add-more-text {
    padding: 15px;
}
</style>