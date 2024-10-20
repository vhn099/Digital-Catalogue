<template>

    <div class="my-footer">
        <div class="flex-1 flex align-items-center justify-content-center">
            <div class="my-footer-logo">
                <img alt="logo" src="../assets/img/logo.png"/>
            </div>
        </div>
      
       <div class="footer-link flex-1 flex align-items-center justify-content-center gap-2">
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
    height: 251px;
    width: 100%;
    background-color: #7326D9;
}

.footer-link {
    /* background-color: aqua; */
    margin-top: -25px;
}

.footer-link a{
    color: white;
    font-weight: 500;
    font-size: 15px;
    text-decoration: none;
}
</style>
