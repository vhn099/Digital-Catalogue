<template>
    <div class="cate-card-box">
        <div class="cate-card-image">

            <img width="110" height="110" fill="none" src="../assets/img/icon/tshirt.png" />

        </div>
        <div class="cate-card-name">
            <p>Shopper</p>
        </div>
    </div>

</template>
<script setup></script>
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