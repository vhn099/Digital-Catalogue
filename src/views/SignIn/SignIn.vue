<script setup>
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';

import { watch, reactive, ref, onMounted, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, setPersistence, browserSessionPersistence } from 'firebase/auth';
import router from '@/router';
import { db, auth } from '@/main';
import { query, collection, getDocs, where } from "firebase/firestore";
import Checkbox from 'primevue/checkbox';

// Reset Link sent
import MessagePage from '@/components/MessagePage.vue';
import { useAppStore } from '@/stores';
const messagePageIcon = "pi pi-check-circle";
const messagePageIconCSS = {
    fontSize: "62px",
    color: "#58DA67",
    fontWeight: "bold"
};
const messagePageBody = 'login';

/* PAGE VARIABLES START */
const formFields = reactive({
    username: '',
    password: '',
    rememberMe: ['remember'],
});

const formForgotPW = reactive({
    emailInput: ''
});
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
        }
    };
});
const v$ = useVuelidate(rules, formFields);

const ruleEmailInput = computed(() => {
    return {
        emailInput: {
            required,
            email,
        },
    };
});

const vEmailInput = useVuelidate(ruleEmailInput, formForgotPW);
/* VALIDATION DEFINITION END */

/* FUNCTION START */
function forgotPassWord() {

    isForgotPassword.value = true;
    isSendLink.value = false;
    isSignIn.value = false;
    renderRecaptcha('recaptcha_element1');
    // setTimeout(() => {
    //     grecaptcha.render('recaptcha_element1', {
    //         'sitekey': siteKey,
    //         'callback': clickReCaptcha,
    //     });
    // }, "1");
}

async function sendLink() {
    const isValidEmail = await vEmailInput.value.$validate();
    if (isValidEmail) {
        if (typeof window.grecaptcha === 'undefined') {
            console.error('reCAPTCHA is not loaded');
            return;
        }
        const captchaResponse = grecaptcha.getResponse();
        if (!captchaResponse) {
            document.getElementById("error_recaptcha1").innerHTML = '<p class = "show_error">Please complete the reCAPTCHA</p>';
            return;
        }
        const emailExists = await CheckValitedEmail(formForgotPW.emailInput);

        if (emailExists) {
            try {
                const actionCodeSettings = {
                    url: 'http://localhost:3000/sign-in',
                    handleCodeInApp: true,
                };
                const x = await sendPasswordResetEmail(auth, formForgotPW.emailInput, actionCodeSettings);
            } catch (error) {
                console.log('Error: ' + error.message);
            }

            isSendLink.value = true;
            isSignIn.value = false;
            isForgotPassword.value = false;
            useAppStore().setmail(formForgotPW.emailInput);
        }
        else {
            document.getElementById("invalidEmail").innerHTML = 'Invalid Email';
            console.log('Invalid Email');

        }
    }

};

const CheckValitedEmail = async (userEmail) => {
    const usersTable = collection(db, 'users');
    const q = query(usersTable, where('email', '==', userEmail));
    try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return true;

        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking email:', error);
        return false;
    }
};
const onReCaptchaLoad = () => {
    grecaptcha.render('recaptcha_element', {
        'sitekey': siteKey,
        'callback': clickReCaptcha,
    });
};
const clickReCaptcha = () => {
    const divError = document.getElementById("error_recaptcha");
    if (divError) {
        document.getElementById("error_recaptcha").innerHTML = '';
    }
    else {
        document.getElementById("error_recaptcha1").innerHTML = '';
    }
};

const clearInvalidEmailMess = () => {
    document.getElementById("invalidEmail").innerHTML = '';
};

const backLogin = () => {
    isForgotPassword.value = false;
    isSendLink.value = false;
    isSignIn.value = true;
    renderRecaptcha('recaptcha_element');
};
const renderRecaptcha = (id) => {
    setTimeout(() => {
        grecaptcha.render(id, {
            'sitekey': siteKey,
            'callback': clickReCaptcha,
        });
    }, "1");
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

        if (rememberMe.length === 0) {
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
const focusPassword = () => {
    document.getElementById('password').firstChild.focus()
}
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
                <div class="sign-logo">
                    <img draggable="false" style="object-fit: contain;margin-bottom: -20px;" width="125px"
                        height="125px" src="../../assets/img/adm_logo.png" />
                    <span></span> <!--dont delete this one. it do something -->
                    <p>Innovation Portal</p>
                </div>
                <!-- <div class="text-decord">
                    <p class="the-line"></p>
                    
                </div> -->
                <div v-if="isSignIn && !isForgotPassword && !isSendLink">
                    <span>Sign in to your account</span>
                    <div class="flex flex-col">
                        <!-- <FloatLabel variant="in">
                            <InputText id="username" autocomplete="off" v-model="formFields.username" :fluid="true"
                                :invalid="v$.username.$errors.length > 0" />
                            <label for="username">Username</label>
                        </FloatLabel> -->

                        <InputText :fluid="true" placeholder="Email" id="username" v-model="formFields.username"
                            :invalid="v$.username.$errors.length > 0" v-on:keyup.enter="focusPassword" capture=""/>
                        <small class="error-messages" v-if="v$.username.$errors.length > 0">{{
                            v$.username.$errors[0].$message }}</small>
                    </div>

                    <div class="flex flex-col">
                        <Password id="password" :feedback="false" :fluid="true" class="input" placeholder="Password"
                            v-model="formFields.password" v-on:keyup.enter="handleSubmit"/>
                    </div>

                    <div class="flex items-center" style="margin-top: 5px;justify-content: space-between;">
                        <div class="flex items-center">
                            <Checkbox v-model="formFields.rememberMe" value="remember" inputId="rememberMe" name="rememberMe"/>
                            <label class="ml-2">Remember Me</label>
                        </div>
                        <div>
                            <a style="cursor: pointer; font-size: 11px;color: #B72828;"
                                @click="forgotPassWord()">Forgotten username/password?</a>

                        </div>
                    </div>

                    <div class="flex flex-col mt-3">
                        <div class="form-captcha" id="recaptcha_element"></div>
                        <small id="error_recaptcha" class="error-messages"></small>
                    </div>

                    <div class="flex flex-col button-container">
                        <!-- <Button type="link" label="Forgotten username/password?" :fluid="true"
                            @click="forgotPassWord()" /> -->
                        <Button :fluid="true" @click="handleSubmit" label="Login" />
                    </div>
                </div>
                <div v-if="!isSignIn && isForgotPassword && !isSendLink">

                    <span style="font-size: 15px; font-weight: 500;">Forgot Your Password?</span>
                    <p style="font-size: 13px;padding: 5px 0;">No worries! Enter your email address below, and we’ll
                        send you a link to
                        reset your password.</p>
                    <InputText :fluid="true" class="input" placeholder="Email address" v-model="formForgotPW.emailInput"
                        id="emailInput" :invalid="vEmailInput.emailInput.$errors.length > 0"
                        v-on:change="clearInvalidEmailMess()" />
                    <small class="error-messages" v-if="vEmailInput.emailInput.$errors.length > 0">{{
                        vEmailInput.emailInput.$errors[0].$message }}</small>
                    <small id="invalidEmail" class="error-messages"></small>

                    <div class="flex flex-col mt-3">
                        <div class="form-captcha" id="recaptcha_element1"></div>
                        <small id="error_recaptcha1" class="error-messages"></small>
                    </div>

                    <!-- <div class="form-captcha" id="recaptcha_element1"></div>
                    <small id="error_recaptcha1" class="error-messages"></small> -->
                    <Button label="Send Reset Link" :fluid="true" @click="sendLink(vEmailInput)" />
                    <div class="flex flex-col mt-3">
                        <div class="back-router">
                            <RouterLink :to="{ name: 'home' }" class="back-home" @click="backLogin()">Back to Login Page
                            </RouterLink>
                        </div>
                    </div>


                </div>
                <div v-if="!isSignIn && !isForgotPassword && isSendLink">
                    <MessagePage :iconName="messagePageIcon" :iconStyle="messagePageIconCSS"
                        :pageBody="messagePageBody" />
                    <div class="back-home-router">
                        <RouterLink :to="{ name: 'home' }" class="back-home" @click="backLogin()">Back to Login Page
                        </RouterLink>
                    </div>
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

.back-router {
    padding-top: 20px;
    text-align: center;
}

.back-home {
    color: gray;
    font-size: 14px;
    font-weight: 700;
    font-style: italic;
    text-decoration: underline;
}

.sign-logo {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}


.sign-logo span {
    border: 1px solid #000000;
    width: 150px;
}

.sign-logo p {
    padding: 5px 0 20px 0;
    font-size: 15px;
    font-weight: 400;
}
.back-home-router {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

</style>