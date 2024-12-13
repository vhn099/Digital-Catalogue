<script setup>
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import { reactive, ref, onMounted, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import router from '@/router';
import { db, auth } from '@/main';
import { query, collection, getDocs, where } from "firebase/firestore";
import Checkbox from 'primevue/checkbox';
import RecaptCha from '../recaptcha-config.json';

// Reset Link sent
import MessagePage from '@/components/MessagePage.vue';
import { useAppStore } from '@/stores';
import { UserFirestore } from '@/lib/User';
import { COMMON_FUNCTIONS } from '@/lib/Common';

/* REF DEFINITION START */
const formFields = reactive({
    username: '',
    password: '',
    rememberMe: ['remember'],
});

const formForgotPW = reactive({
    emailInput: ''
});
const spinner = ref(false);
const isSignIn = ref(true);
const isForgotPassword = ref(false);
const isSendLink = ref(false);
const isDisabled = ref(false);

/* STATIC VARIABLE */
const siteKey = RecaptCha.SITE_KEY;
const messagePageIcon = "pi pi-check-circle";
const messagePageIconCSS = {
    fontSize: "62px",
    color: "#58DA67",
    fontWeight: "bold"
};
const messagePageBody = 'login';
const disabledPageTitle = "Account Locked";
const disabledPageIcon = "pi pi-times-circle";
const disabledPageIconCSS = {
    fontSize: "62px",
    color: "#EE404C",
    fontWeight: "bold"
};
const disabledPageBody = 'blocked';


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

/* FUNCTION START */
function forgotPassWord() {

    isForgotPassword.value = true;
    isSendLink.value = false;
    isSignIn.value = false;
    renderRecaptcha('recaptcha_element1');
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
        const email = formForgotPW.emailInput.toLowerCase();
        const emailExists = await CheckValitedEmail(email);
        const currentDomain = window.location.origin;

        if (emailExists) {
            try {
                const actionCodeSettings = {
                    url: `${currentDomain}/sign-in`, // Make sure this domain flexible on local and firebase hosting.
                    handleCodeInApp: true,
                };
                const x = await sendPasswordResetEmail(auth, email, actionCodeSettings);
            } catch (error) {
                console.log('Error: ' + error.message);
            }

            isSendLink.value = true;
            isSignIn.value = false;
            isForgotPassword.value = false;
            useAppStore().setmail(formForgotPW.emailInput.toLowerCase());
        }
        else {
            document.getElementById("invalidEmail").innerHTML = 'Email is not existed';
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

const clearInvalidEmailMess = (id) => {
    document.getElementById(id).innerHTML = '';
};

const backLogin = () => {
    isForgotPassword.value = false;
    isSendLink.value = false;
    isSignIn.value = true;
    isDisabled.value = false;
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
        const username = formFields.username.toLowerCase();
        const password = formFields.password;
        const rememberMe = formFields.rememberMe;
        let expire = 3; // expires in 3 days

        if (rememberMe.length === 0) {
            expire = 14;
        }
        await signInWithEmailAndPassword(getAuth(), username, password).then(async response => {
            spinner.value = true;
            const userData = await UserFirestore.getCurrentUser();

            const oneday = 24 * 60 * 60 * 1000; // 1 day
            const expireDate = new Date();
            userData.expires = expireDate.setTime(expireDate.getTime() + (expire * oneday));

            UserFirestore.setCookie('user-auth', JSON.stringify(userData), userData.expires);
            spinner.value = false;

            if (userData.userData.disabled) {
                isDisabled.value = true;
                UserFirestore.setCookie('user-auth', "", 0);
            } else {
                router.push({
                    name: 'home',
                });
            }
        }).catch(error => {
            if (error.code === 'auth/invalid-credential') {
                document.getElementById("incorrectLogin").innerHTML = 'Username or Password entered is incorrect.';
            }
            console.log(error);
        });
    } else {
        console.log('Invalid form');
    }
};
const focusPassword = () => {
    document.getElementById('password').firstChild.focus()
}

/* VUE EVENTS */
onMounted(async () => {
    globalThis.onReCaptchaLoad = onReCaptchaLoad;
    globalThis.clickReCaptcha = clickReCaptcha;
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?onload=onReCaptchaLoad`; // import lib for grecaptcha function
    script.async = true;
    document.body.appendChild(script);

    /* HANDLE DISABLED USERS */
    const cookie = UserFirestore.getCookie("user-auth");
    let currentUser = "";
    if (COMMON_FUNCTIONS.isJSONString(cookie)) {
        currentUser = JSON.parse(cookie); // Check custom authen of users.
        if (currentUser.userData) {
            isDisabled.value = currentUser.userData.disabled;
            if (isDisabled.value === true) {
                UserFirestore.setCookie('user-auth', "", 0);
            }
        }
    }
});
</script>

<template>
    <!-- <LoadingSpinner v-if="spinner"/> -->
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

                <div v-if="isSignIn && !isForgotPassword && !isSendLink && spinner">
                    <div class="is-loggining">
                        <ProgressSpinner />
                    </div>
                    <Button style="margin-top: 30px;" :fluid="true" severity="secondary" disabled label="Loading" />
                </div>

                <!-- MAIN LOGIN FORM -->
                <div v-if="isSignIn && !isForgotPassword && !isSendLink && !spinner && !isDisabled">
                    <span>Sign in to your account</span>
                    <div class="flex flex-col">

                        <InputText :fluid="true" placeholder="Email" id="username" v-model="formFields.username"
                            :invalid="v$.username.$errors.length > 0" v-on:keyup.enter="focusPassword" capture=""
                            v-on:change="clearInvalidEmailMess('incorrectLogin')" maxLength="150" />
                        <small class="error-messages" v-if="v$.username.$errors.length > 0">{{
                            v$.username.$errors[0].$message }}</small>
                    </div>

                    <div class="flex flex-col">
                        <Password id="password" :feedback="false" :fluid="true" class="input" placeholder="Password"
                            v-model="formFields.password" v-on:keyup.enter="handleSubmit"
                            v-on:change="clearInvalidEmailMess('incorrectLogin')" maxLength="150" />
                        <small id="incorrectLogin" class="error-messages"></small>
                    </div>

                    <div class="flex items-center" style="margin-top: 5px;justify-content: space-between;">
                        <div class="flex items-center">
                            <Checkbox v-model="formFields.rememberMe" value="remember" inputId="rememberMe"
                                name="rememberMe" />
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
                        <Button :fluid="true" @click="handleSubmit" label="Login" />
                    </div>
                </div>

                <!-- DISABLED FORM -->
                <div v-if="isDisabled">
                    <MessagePage :title="disabledPageTitle" :iconName="disabledPageIcon"
                        :iconStyle="disabledPageIconCSS" :pageBody="disabledPageBody" />
                    <p class="back-home" @click="backLogin()"
                        style="padding-top: 20px; width: 100%; text-align: center;">Back to Login Page</p>
                </div>

                <!-- SEND LINK FORM -->
                <div v-if="!isSignIn && isForgotPassword && !isSendLink && !spinner">

                    <span style="font-size: 15px; font-weight: 500;">Forgot Your Password?</span>
                    <p style="font-size: 13px;padding: 5px 0;">No worries! Enter your email address below, and we’ll
                        send you a link to
                        reset your password.</p>
                    <InputText :fluid="true" class="input" placeholder="Email address" v-model="formForgotPW.emailInput"
                        id="emailInput" :invalid="vEmailInput.emailInput.$errors.length > 0"
                        v-on:change="clearInvalidEmailMess('emailInput')" maxLength="150" />
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
                            <p class="back-home" @click="backLogin()">Back to Login Page
                            </p>
                        </div>
                    </div>


                </div>
                <div v-if="!isSignIn && !isForgotPassword && isSendLink && !spinner">
                    <MessagePage :iconName="messagePageIcon" :iconStyle="messagePageIconCSS"
                        :pageBody="messagePageBody" />
                    <div class="back-home-router">
                        <p class="back-home" @click="backLogin()">Back to Login Page
                        </p>
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

@media (max-width: 500px) {
    .login-container {
        flex-direction: column;
        height: auto;
        width: 100%;
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
    cursor: pointer;
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

.is-loggining {
    display: flex;
    padding: 25px 0;
}
</style>