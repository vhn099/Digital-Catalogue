<!-- <template>
    <div class="grid elements-container">
        <div class="col-2">
            
        </div>
        <div class="col-2">
            <SignInForm />
        </div>
        <div class="col-6 image-container">
        </div>
        <div class="col-2">
        </div>
    </div>
</template>

<script>
import ImageContainer from './components/ImageContainer.vue';
import SignInForm from './components/SignInForm.vue';

export default {
    setup() {

    },
    components: {
        SignInForm,
        ImageContainer
    }
}

</script>
<style>
body {
    background-color: white;
}

.elements-container {
    height: 100vh;
}

.elements-container .col-4,
.col-8 {
    padding: 0px;
}

.image-container {
    background-image: url("../../assets/img/login/mask-group.png");
    background-size: contain;
    background-repeat: no-repeat;
}
</style> -->

<template>
    <div class="center-container">

        <div class="login-container">
            <!-- Left side - Login Form -->
            <div class="form-container">
                <img style="object-fit: contain;" width="125" height="125px" src="../../assets/img/adm_logo.png" />
                <!-- <span>Sign in to your account</span> -->
                <input type="text" placeholder="Username" required>
                <input type="password" placeholder="Password" required>
                <button type="submit">Login</button>
            </div>

            <!-- Right side - Image --> 
            <div class="image-container"></div>
        </div>
    </div>

</template>
<style scoped>
.center-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: #f0f0f0;

}

.login-container {
    display: flex;
    width: 80%;
    max-width: 900px;
    height: 600px;
    background-color: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    /* border-radius: 10px; */
    overflow: hidden;
}

/* Left side - login form */
.form-container {
    flex: 3;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.form-container h2 {
    margin-bottom: 20px;
    color: #333;
}

.form-container input {
    margin-bottom: 15px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.form-container button {
    padding: 10px;
    background-color: #7326D9;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.form-container button:hover {
    background-color: #218838;
}

/* Right side - image */
.image-container {
    flex: 4;
    background-image: url("../../assets/img/login/mask-group.png");
    /* background-image: url('https://via.placeholder.com/450'); */
    background-size: cover;
    background-position: center;
    display: none;
}

/* Responsive design */
@media (min-width: 768px) {
    .image-container {
        display: block;
    }
}

@media (max-width: 768px) {
    .login-container {
        flex-direction: column;
        height: auto;
    }

    .image-container {
        height: 200px;
    }
}
</style>

<script setup>

</script>