<script setup>
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { watch, reactive, ref, onMounted, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import router from '@/router';
import { auth } from '@/main';
import Checkbox from 'primevue/checkbox';


/* PAGE VARIABLES START */
const formFields = reactive({
    username: '',
    password: '',
    rememberMe: '',
});
const emailInput = ref(null);
const isSignIn = ref(true);
const isForgotPassword = ref(false);
const isSendLink = ref(false);
const siteKey = '6LfGN2MqAAAAAIChGWGYeHE7UpbxJXEKv1jYw3eu';
/* PAGE VARIABLES END */

/* VALIDATION DEFINITION START */
const rules = computed(() => {
    return {
        username: {
            required,
            email
        },
    };
});
const v$ = useVuelidate(rules, formFields);
/* VALIDATION DEFINITION END */

/* FUNCTION START */
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

        const x = await sendPasswordResetEmail(auth, emailInput.value, actionCodeSettings);
        console.log('Email reset password be sent!');
    } catch (error) {
        console.log('Error: ' + error.message);
    }

    isSendLink.value = true;
    isSignIn.value = false;
    isForgotPassword.value = false;
};
const onReCaptchaLoad = () => {
    grecaptcha.render('recaptcha_element', {
        'sitekey': siteKey,
        'callback': clickReCaptcha,
    });
}
const clickReCaptcha = () => {
    document.getElementById("error_recaptcha").innerHTML = '';
};

const handleSubmit = async () => {
    const isValid = await v$.value.$validate();
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
        const username = formFields.username;
        const password = formFields.password;
        const rememberMe = formFields.rememberMe;
        let persistence = browserSessionPersistence;

        if (rememberMe) {
            persistence = browserSessionPersistence;
        }

        await setPersistence(getAuth(), persistence).then(async () => {
            await signInWithEmailAndPassword(getAuth(), username, password).then(response => {
                router.push({
                    name: 'home'
                });
            });
        });
    } else {
        console.log('Invalid form');
    }
};
/* FUNCTION END */


onMounted(async () => {
    // console.log('Site Key:', siteKey); // Checking sitekey value
    globalThis.onReCaptchaLoad = onReCaptchaLoad;
    globalThis.clickReCaptcha = clickReCaptcha;
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?onload=onReCaptchaLoad`; // import lib for grecaptcha function
    script.async = true;
    document.body.appendChild(script);
});
</script>

<template>
    <div class="center-container">
        <div class="login-container">
            <!-- Left side - Login Form -->
            <div class="form-container">
                <img style="object-fit: contain;" width="125" height="125px" src="../../assets/img/adm_logo.png" />
                <div v-if="isSignIn && !isForgotPassword && !isSendLink">
                    <span>Sign in to your account</span>
                    <div class="flex flex-col">
                        <InputText :fluid="true" placeholder="Username" id="username" v-model="formFields.username"
                            :invalid="v$.username.$errors.length > 0" />
                        <small class="error-messages" v-if="v$.username.$errors.length > 0">{{
                            v$.username.$errors[0].$message }}</small>
                    </div>

                    <div class="flex flex-col">
                        <Password :feedback="false" :fluid="true" class="input" placeholder="Password"
                            v-model="formFields.password" />
                    </div>

                    <div class="flex items-center" style="margin-top: 5px;">
                        <Checkbox v-model="formFields.rememberMe" inputId="rememberMe" name="rememberMe"
                            value="rememberMe" />
                        <label class="ml-2">Remember Me</label>
                    </div>

                    <div class="flex flex-col mt-3">
                        <div class="form-captcha" id="recaptcha_element"></div>
                        <div id="error_recaptcha"></div>
                    </div>

                    <div class="flex flex-col button-container">
                        <Button type="link" label="Forgotten username/password?" :fluid="true"
                            @click="forgotPassWord()" />
                        <Button :fluid="true" @click="handleSubmit(v$)" label="Login" />
                    </div>
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
/* MAIN FORM INPUT START */
.flex-col {
    flex-direction: column;
}

.items-center {
    align-items: center;
}

.error-messages {
    margin-bottom: 16px;
    color: red;
    font-size: 12px;
    margin-bottom: 4px;
}

:deep(.p-button) {
    margin-bottom: 10px;
}

/* MAIN FORM INPUT END */
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
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 10px;
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
    /* background-color: #218838; */
    background-color: white;
    color: black;
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