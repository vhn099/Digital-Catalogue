<template>

    <div class="my-footer">
        <div class="flex-1 flex align-items-center justify-content-center">
            <div class="my-footer-logo">
                <img alt="logo" src="../assets/img/logo.png" draggable="false"/>
            </div>
        </div>
      
       <div class="footer-link">
        <a href="https://www.admgroup.com/cookie-policy">Cookie Policy,</a>
        <a href="https://www.admgroup.com/website-accessibility-statement">Website Accessibility Statement,</a>

        <a href="https://www.admgroup.com/website-terms-of-use">Website Terms of Use,</a>
        <a href="https://www.admgroup.com/website-privacy-policy">Website Privacy Policy,</a>
        <a href="https://www.admgroup.com/data-security-policy">Data Security Policy</a>

       </div>
    </div>

</template>

<script setup>
</script>

<style scoped>
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
}

.my-footer {
    width: 100%;
    background-color: #7326D9;
}

.footer-link {
    /* background-color: aqua; */
    margin-top: -25px;
    padding-bottom: 50px;
    display: flex;
    gap: 10px;
    text-align: center;
    justify-content: center;
}

@media (max-width: 920px) {
    .footer-link {
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
    }
}

.footer-link a{
    color: white;
    font-weight: 500;
    font-size: 15px;
    text-decoration: none;
}
</style>
