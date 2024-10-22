<script setup>

</script>

<template>
    <h1 style="text-align: center;font-size: 33px; font-weight: 500; line-height: 54px;text-align: center;">Check Your Inbox!</h1>
    <div class="content-section">
        <p> We've sent a password reset link to </p>
        <p style="padding: 10px 0;color: #7326D9;font-size: 15px;">[your email address]</p>
        <p>Please follow the instructions in the email to reset your password.</p>
    </div>

  

    <!-- <div class="back-home-router">
        <RouterLink :to="{ name: 'home' }" class="back-home">Back to Login Page</RouterLink>
    </div> -->
</template>

<style scoped>
/* .content-section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
} */

.content-section p {
    text-align: center;
    /* display: flex; */
    align-items: center;
}


.back-home-router {
    padding-top: 20px;
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