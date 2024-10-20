<script setup>
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { watch, reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import router from '@/router';
import { auth } from '@/main';
const siteKey = '6Lea3WMqAAAAAB8InVXkbFEjCkXPkf_IJ6nNlaKT';

const formFields = reactive({
    username: { label: 'Username', type: 'text', value: '' },
    password: { label: 'Password', type: 'password', value: '' },
});

const rules = {
    username: { required },
    password: { required: false }
};

const v$ = useVuelidate(rules, formFields);

const email = ref(null);
const isSignIn = ref(true);
const isForgotPassword = ref(false);
const isSendLink = ref(false);

function forgotPassWord() {

    isForgotPassword.value = true;
    isSendLink.value = false;
    isSignIn.value = false;
    setTimeout(() => {
        grecaptcha.render('recaptcha_element1', {
            'sitekey': siteKey
        });
    }, "1");
}

async function sendLink() {
    if (typeof window.grecaptcha === 'undefined') {
        alert('reCAPTCHA is not loaded');
        return;
    }
    const captchaResponse = grecaptcha.getResponse();
    if (!captchaResponse) {
        alert('Please complete the reCAPTCHA');
        return;
    }

    try {
        const actionCodeSettings = {
            url: 'http://localhost:3000/home',
            handleCodeInApp: true,
        };
        console.log(email.value);

        const x = await sendPasswordResetEmail(auth, email.value, actionCodeSettings);
        console.log('Email reset password be sent!');
    } catch (error) {
        console.log('Error: ' + error.message);
    }

    isSendLink.value = true;
    isSignIn.value = false;
    isForgotPassword.value = false;
}

</script>

<template>
    <div class="center-container">
        <div class="login-container">
            <!-- Left side - Login Form -->
            <div class="form-container">
                <img style="object-fit: contain;" width="125" height="125px" src="../../assets/img/adm_logo.png" />
                <div v-if="isSignIn && !isForgotPassword && !isSendLink">
                    <span>Sign in to your account</span>
                    <InputText :fluid="true" class="input" placeholder="Username" id="username"
                        v-model="v$.username.$model.value" :class="{ 'p-invalid': v$.username.$error }" />
                    <Password :feedback="false" :fluid="true" class="input" placeholder="Password" id="password"
                        v-model="v$.password.$model.value" />
                    <div class="form-captcha" id="recaptcha_element"></div>
                    <div id="error_recaptcha"></div>
                    <Button type="link" label="Forgotten username/password?" :fluid="true" @click="forgotPassWord()" />
                    <Button :fluid="true" @click="handleSubmit(v$)" label="Login" />
                </div>
                <div v-if="!isSignIn && isForgotPassword && !isSendLink">

                    <span>Forgot Your Password?</span>
                    <p>No worries! Enter your email address below, and we’ll send you a link to reset your password.</p>
                    <InputText :fluid="true" class="input" placeholder="Email address" v-model="email" id="email" />
                    <div class="form-captcha" id="recaptcha_element1"></div>
                    <Button label="Send Reset Link" :fluid="true" @click="sendLink()" />
                </div>
                <div v-if="!isSignIn && !isForgotPassword && isSendLink">
                    <h1>isSendLink</h1>
                </div>
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

:deep(.form-container .p-inputtext) {
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
    background-size: cover;
    background-image: url('../../assets/img/login/mask-group.png');
    background-position: center;
    display: none;
}

.form-captcha {
    margin: 0 auto 10px;
}

/* Responsidesign */
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

<script>
export default {
    data() {
        return {
            siteKey: '6LfGN2MqAAAAAIChGWGYeHE7UpbxJXEKv1jYw3eu',
            picture: '../../assets/img/login/mask-group.png'
        };
    },
    methods: {
        onReCaptchaLoad() {
            grecaptcha.render('recaptcha_element', {
                'sitekey': this.siteKey,
                'callback' : clickReCaptcha,
            });
        },
        clickReCaptcha(){
            document.getElementById("error_recaptcha").innerHTML = '';
        },

        handleSubmit: async (v$) => {
            const isValid = await v$.$validate();
            console.log(isValid);
            if (isValid) {
                if (typeof window.grecaptcha === 'undefined') {
                    alert('reCAPTCHA is not loaded');
                    return;
                }
                const captchaResponse = grecaptcha.getResponse();
                
                if (!captchaResponse) {
                    document.getElementById("error_recaptcha").innerHTML = '<p class = "show_error">Please complete the reCAPTCHA</p>';
                    return;

                }
                const username = v$.username.$model.value;
                const password = v$.password.$model.value;
                await signInWithEmailAndPassword(getAuth(), username, password).then(response => {
                    router.push({
                        name: 'home'
                    });
                });
            } else {
                console.log('Invalid form');
            }
        },

    },
    mounted() {
        console.log('Site Key:', this.siteKey); // Kiểm tra giá trị siteKey
        globalThis.onReCaptchaLoad = this.onReCaptchaLoad;
        globalThis.clickReCaptcha = this.clickReCaptcha;
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?onload=onReCaptchaLoad`;
        script.async = true;
        document.body.appendChild(script);
    },
}

</script>