<script setup>

</script>

<template>
    <div>

    </div>
    <h1 style="text-align: center;">Thank You for Reaching Out!</h1>
    <div class="content-section">
        <p>
            We’ve received your details and our team will get back to you within 24-48 hours. Meanwhile, feel free to
            explore more of our site, or contact us directly at support@example.com if you need immediate assistance.
        </p>

    </div>

    <div class="email-us">
        <div class="mail-icon">
            <img src="../assets/img/icon/mail.png" />
        </div>
        <div>
            <p>Email us</p>
            <p>Write to our friendly team, we are here to help.</p>
            <a href="#">info.au@admgroup.com</a>
        </div>
    </div>

    <div>
        <RouterLink :to="{ name: 'home' }" class="back-home">Back home</RouterLink>
    </div>
</template>

<style scoped>
.content-section {
    display: flex;
    justify-content: center;
}

.content-section p {
    width: 65%;
    text-align: center;
    display: flex;
    align-items: center;
}

.email-us {
    padding-top: 5%;
    border-radius: 5px;
    background-color: #C1C1C1;
    width: 45%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.mail-icon {
    margin-bottom: 5%;
}

.back-home{
    color: gray;
    font-size: 24px;
    font-style: italic;
    text-decoration: underline;
    padding-top: 1000px
}
</style>