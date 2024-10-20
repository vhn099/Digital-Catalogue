<template>
    <div class="col">
        <div class="my-card-deck">
            <div class="deck-date">
                <Chip label="Oct 2024" />
            </div>
            <div class="deck-info">
                <div class="deck-info-desc">
                    <span class="deck-name">Placeholder for the title of deck 1</span>
                    <div class="deck-tag gap-2">
                        <Tag severity="secondary" value="#news"></Tag>
                        <Tag severity="secondary" value="#news"></Tag>
                        <Tag severity="secondary" value="#news"></Tag>
                        <Tag severity="secondary" value="#news"></Tag>
                    </div>
                </div>
                <div class="deck-info-like">
                    <div class="button-like">
                        <Button severity="secondary" label="Favourite">
                            <img width="40" height="40" fill="none" src="../assets/img/icon/favorite_black.png" />
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
    font-weight: 900;
    margin-left: 5px;
    border-radius: 25px;
}

.deck-name {
    font-size: 36px;
    font-weight: 500;
    line-height: 54px;
}

.my-card-deck {
    height: 365px;
    min-width: 365px;
    background-color: bisque;
    border-radius: 10px;
    background-image: url("../assets/img/demo/peroni.png");
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