<script setup>

</script>

<template>
    <h1 style="text-align: center;font-size: 36px; font-weight: 500; line-height: 54px;text-align: center;">Thank You for Reaching Out!</h1>
    <div class="content-section">
        <p>
            We’ve received your details and our team will get back to you within 24-48 hours. Meanwhile, feel free to
            explore more of our site, or contact us directly at support@example.com if you need immediate assistance.
        </p>

    </div>

    <div class="email-us">
        <div class="mail-icon">
            <img draggable="false" src="../assets/img/icon/mail.png" />
        </div>
        <div>
            <p style="font-size: 20px;font-weight: 500;">Email us</p>
            <p>Write to our friendly team, we are here to help.</p>
            <a href="#">info.au@admgroup.com</a>
        </div>
    </div>

    <div class="back-home-router">
        <RouterLink :to="{ name: 'home' }" class="back-home">Back home</RouterLink>
    </div>
</template>

<style scoped>
.content-section {
    display: flex;
    justify-content: center;
    padding: 15px 0 50px 0;
}

.content-section p {
    width: 65%;
    text-align: center;
    display: flex;
    align-items: center;
    /* padding: 15%; */
}

.email-us {
    border-radius: 5px;
    /* background-color: #C1C1C1; */
    background: #C1C1C11F;
    /* width: 45%; */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.mail-icon {
    width: 60px;
    /* margin-bottom: 5%; */
    /* padding: 0 10px; */
}

.back-home-router {
    padding-top: 100px;
}

.back-home {
    color: gray;
    font-size: 14px;
    font-weight: 700;
    font-style: italic;
    text-decoration: underline;
    /* padding-top: 1000px */
}
</style>