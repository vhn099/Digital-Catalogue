<script setup>


defineProps({
    icon: {
        type: String,
    },
    icon_text: {
        type: String,
    },
    line2: {
        type: String
    },
    line3: {
        type: String
    },
    line4: {
        type: Object
    }
});
</script>

<template>
    <div class="flex gap-1 mt-1 pt-4">
        <!-- <i class="pi pi-cog"></i> -->
         <img :src="icon" width="25">
        <span>{{ icon_text }}</span>
    </div>
    <span class="my-second-line" v-if="line2">Discover Decks by Category</span>
    <span class="my-second-line" v-if="line3" style="font-size: 32px;">Get in touch with us to get the ball rolling</span>
    <span class="my-second-line" v-if="line4">{{line4.title}}: {{ line4.deck }}</span>
</template>


<style scoped>
.my-second-line {
    font-weight: 500;
    font-size: 24px;
}
</style>