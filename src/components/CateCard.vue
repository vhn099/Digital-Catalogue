<template>
    <div class="cate-card-box" v-for="({ id, name, image }, index) in data" :key="id">
        <div class="cate-card-image">

            <img width="110" height="110" fill="none" :src="image" />

        </div>
        <div class="cate-card-name">
            <p>{{ name }}</p>
        </div>
    </div>

</template>
<script setup>
defineProps({
    data: {
        type: Array,
        required: true,
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    }
});
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

.cate-card-image {
    display: grid;
    place-items: center;
    height: 50%;
}

.cate-card-name {
    height: 50%;
    width: 70%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    text-align: center;
    white-space: normal !important;
    font-size: 20px;
    font-weight: 600;
}
</style>