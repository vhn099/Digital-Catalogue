<template>

    <div class="my-footer">
        <div class="flex-1 flex align-items-center justify-content-center">
            <div class="my-footer-logo">
                <img alt="logo" src="../assets/img/logo.png"/>
            </div>
        </div>
      
       <div class="qua-troi-link-roi flex-1 flex align-items-center justify-content-center gap-2">
        <a href="https://www.w3schools.com">Cookie Policy,</a>
        <a href="https://www.w3schools.com">Website Accessibility Statement,</a>

        <a href="https://www.w3schools.com">Website Terms of Use,</a>
        <a href="https://www.w3schools.com">Website Privacy Policy,</a>
        <a href="https://www.w3schools.com">Data Security Policy</a>

       </div>
    </div>

</template>

<script setup>
import { ref } from "vue";
</script>

<style scoped>
/* .my-footer-logo {
    height: 48px;
    width: 48px;
} */


.my-footer-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    width: 200px;
    padding-top: 63px;
}


.my-footer-logo > img{
    object-fit: cover;
    /* height: 100px; */
}


.my-footer {
    height: 251px;
    width: 100%;
    background-color: #7326D9;
}

.qua-troi-link-roi {
    /* background-color: aqua; */
    margin-top: -25px;
}

.qua-troi-link-roi a{
    color: white;
    font-weight: 500;
    font-size: 15px;
    text-decoration: none;
}
</style>
