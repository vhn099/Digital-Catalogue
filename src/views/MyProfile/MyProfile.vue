<script setup>
// components
import DockItem from '../../components/Dock.vue';
import SectionItem from '../../components/Section.vue'
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import ProfileIcon from '@/assets/img/icon/profile.png';
import { onMounted, ref, watch } from 'vue';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { UserFirestore } from '@/lib/User';
import Dialog from "primevue/dialog";
import { useAppStore } from '@/stores';
import { auth } from '@/main';
// Reset Link sent
import MessagePage from '@/components/MessagePage.vue';
import { COMMON_FUNCTIONS } from '@/lib/Common';
const messagePageIcon = "pi pi-check-circle";
const messagePageBody = 'login';
const messagePageIconCSS = {
    fontSize: "62px",
    color: "#58DA67",
    fontWeight: "bold"
};

const sectionIcon = ProfileIcon;
const sectionText = "My Profile";

/* REF DEFINITION START */
const firstname = ref('');
const lastName = ref('');
const email = ref('');
const isResetPassWord = ref(false);
const isSendLink = ref(false);
const siteKey = '6LfGN2MqAAAAAIChGWGYeHE7UpbxJXEKv1jYw3eu';
/* REF DEFINITION END */

onMounted(async () => {

    email.value = getAuth().currentUser.email;
    useAppStore().setmail(email.value);
    const cookie = UserFirestore.getCookie("user-auth");
    let user = '';
    if (COMMON_FUNCTIONS.isJSONString(cookie)) {
        user = JSON.parse(cookie);
    }
    firstname.value = user.userData.firstname;
    lastName.value = user.userData.lastname;
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js`; // import lib for grecaptcha function
    script.async = true;
    document.body.appendChild(script);
});


const resetPassWord = () => {
    isResetPassWord.value = true;
    renderRecaptcha('recaptcha_element');
};
const closeDrawer = () => {
    isResetPassWord.value = false;
    isSendLink.value = false;
};
const renderRecaptcha = (id) => {
    setTimeout(() => {
        grecaptcha.render(id, {
            'sitekey': siteKey,
            'callback': clickReCaptcha,
        });
    }, "1");
};
const clickReCaptcha = () => {
    document.getElementById("error_recaptcha").innerHTML = '';
};

async function sendLink() {

    if (typeof window.grecaptcha === 'undefined') {
        console.error('reCAPTCHA is not loaded');
        return;
    }
    const captchaResponse = grecaptcha.getResponse();
    if (!captchaResponse) {
        document.getElementById("error_recaptcha").innerHTML = '<p class = "show_error">Please complete the reCAPTCHA</p>';
        return;
    }
    try {
        const currentDomain = window.location.origin;
        const actionCodeSettings = {
            url: `${currentDomain}/sign-in`,
            handleCodeInApp: true,
        };
        const x = await sendPasswordResetEmail(auth, email.value, actionCodeSettings);
        // UserFirestore.setCookie("user-auth", "", 0);
    } catch (error) {
        console.log('Error: ' + error.message);
    }
    isSendLink.value = true;
    useAppStore().setmail(email.value);
};

watch(isResetPassWord, () => {
    if (!isResetPassWord.value) {
        closeDrawer();
    }
});

</script>

<template>
    <DockItem></DockItem>
    <Dialog v-model:visible="isResetPassWord" modal :header='isSendLink ? " " : "Forgot You Password?"'
        :style="{ width: '30vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="form-container">

            <div class="form-container" v-if="!isSendLink">
                <FloatLabel variant="in">
                    <InputText id="in_label" disabled :fluid="true" v-model="email" autocomplete="off" />
                    <label for="in_label">Email</label>
                </FloatLabel>
                <div class="flex flex-col mt-3">
                    <div class="form-captcha" id="recaptcha_element"></div>
                </div>
                <small id="error_recaptcha" class="error-messages"></small>
            </div>
            <div class="button-reset-pass" v-if="!isSendLink">
                <div class="flex mt-3 gap-4">
                    <Button type="button" label="Send Reset Link" @click="sendLink()" />
                    <Button type="button" label="Cancel" severity="warn" icon="pi pi-times" @click="closeDrawer()" />
                </div>
            </div>
            <div class="close-router" v-if="isSendLink">
                <MessagePage :iconName="messagePageIcon" :iconStyle="messagePageIconCSS" :pageBody="messagePageBody" />
                <RouterLink :to="{ name: 'profile' }" class="close" @click="closeDrawer()">Close
                </RouterLink>
            </div>
        </div>
    </Dialog>
    <div class="flex min-height-750">
        <div class="col-1">

        </div>
        <div class="col-11">

            <!-- <SectionItem></SectionItem> -->
            <!-- <SectionItem :icon="sectionIcon" :icon_text="sectionText"></SectionItem> -->
            <!-- Keep your profile up to date to ensure we have the latest information. -->

            <div class="flex">
                <div class="col-12">
                    <SectionItem :icon="sectionIcon" :icon_text="sectionText"></SectionItem>
                    <div class="flex flex-column">
                        <!-- <span>Please fill in a form and we get back to you</span> -->
                        <span class="profile-description">Keep your profile up to date to ensure we have the latest
                            information.</span>

                        <div class="flex">
                            <div class="flex-1 p-2">
                                <FloatLabel variant="in">
                                    <InputText id="in_label" :fluid="true" v-model="firstname" autocomplete="off" />
                                    <label for="in_label">First Name</label>
                                </FloatLabel>
                            </div>
                            <div class="flex-1 p-2">
                                <FloatLabel variant="in">
                                    <InputText id="in_label" :fluid="true" v-model="lastName" autocomplete="off" />
                                    <label for="in_label">Last Name</label>
                                </FloatLabel>
                            </div>
                        </div>
                        <div class="flex">
                            <div class="flex-1 p-2">
                                <FloatLabel variant="in">
                                    <InputText id="in_label" disabled :fluid="true" v-model="email"
                                        autocomplete="off" />
                                    <label for="in_label">Email</label>
                                </FloatLabel>
                            </div>
                            <div class="flex-1 p-2">
                            </div>
                        </div>

                        <div class="space-box">

                        </div>

                        <div class="flex">
                            <div class="flex-1 p-2">
                                <Button label="Save" :fluid="true" @click="submitForm()" raised />
                            </div>
                            <div class="flex-1 p-2">
                                <Button label="Reset Password" severity="warn" :fluid="true" @click="resetPassWord()"
                                    raised />
                            </div>
                        </div>
                    </div>


                </div>

            </div>

        </div>


    </div>

</template>

<style scoped>
.profile-description {
    padding-bottom: 30px;
}

.space-box {
    height: 400px;
}

.form-captcha {
    margin: 0 auto 10px;
}

.error-messages {
    margin-bottom: 16px;
    color: red;
    font-size: 12px;
    margin-bottom: 4px;
}

.close {
    color: gray;
    font-size: 14px;
    font-weight: 700;
    font-style: italic;
    text-decoration: underline;
    padding-top: 25px;
}

.close-router {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.button-reset-pass {
    display: flex;
    /* justify-content: space-between; */
    justify-content: space-around;
}
</style>