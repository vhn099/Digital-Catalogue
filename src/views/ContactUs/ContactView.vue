<script setup>
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';


// components
import DockItem from '../../components/Dock.vue';
import SectionItem from '../../components/Section.vue'
import { reactive, ref, computed } from 'vue';
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/main";
import MessagePage from '@/components/MessagePage.vue';
import { required, email } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import SupportIcon from '@/assets/img/homepage/support.png';
const firstName = ref(null);
const lastName = ref(null);
//const userEmail = ref(null);
const message = ref(null);
const emails = ref([]);
const bodyReq = ref({
  to: [],
  message: {
    subject: '',
    html: '',
    firstName: '',
    lastName: '',
    email: '',
  },
});
const isSuccess = ref(false);
const sectionIcon = SupportIcon;
const sectionText = "Contact us";
const line4 = {
  title: 'Selected',
  deck: 'Glassware Design'
};

const formFields = reactive({
  userEmail: '',
});
/* VALIDATION DEFINITION START */
const rules = computed(() => {
  return {
    userEmail: {
      required,
      email
    }
  };
});
const v$ = useVuelidate(rules, formFields);
/* VALIDATION DEFINITION END */

const messagePageIcon = "pi pi-check-circle";
const messagePageIconCSS = {
  fontSize: "62px",
  color: "#58DA67",
  fontWeight: "bold"
};
const messagePageHeader = "Get in touch with us to get the ball rolling";
const messagePageBody = 'contact';

function toggleDarkMode() {
  document.documentElement.classList.toggle('my-app-dark');
}
function setMessage() {
 const strMessage = 'Email - ' + formFields.userEmail + '\n' + 'Message - ' + message.value;
 const htmlMessage = strMessage.replaceAll('\n','<br/>');
 return htmlMessage;
}
async function submitForm() {
  const isValid = await v$.value.$validate();
  if (isValid) {
    const fetchEmails = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'contact_emails'));
        querySnapshot.forEach((doc) => {
          emails.value.push(doc.data().email);
        });
      } catch (error) {
        console.error('Error fetching emails: ', error);
      }
    };
    await fetchEmails();
    bodyReq.value.to = emails.value;
    bodyReq.value.message.subject = 'Innovation Portal Message from ' + firstName.value + ' ' + lastName.value;
    bodyReq.value.message.html = setMessage();
    bodyReq.value.message.firstName = firstName;
    bodyReq.value.message.lastName = lastName;
    bodyReq.value.message.email = formFields.userEmail;

    try {
      await addDoc(collection(db, 'mail'), bodyReq.value);
      //alert('Feedback sent successfully!');
      // Reset form if needed
      bodyReq.value.to = [];
      bodyReq.value.message.subject = '';
      bodyReq.value.message.html = '';
      bodyReq.value.message.firstName = '';
      bodyReq.value.message.lastName = '';
      bodyReq.value.message.email = '';
      //show SuccessPage
      isSuccess.value = true;
    } catch (error) {
      console.error('Error adding feedback: ', error);
      alert('Error sending feedback: ' + error.message);
    }
  }
}
</script>

<template>
  <DockItem></DockItem>
  <div class="flex">
    <div class="sm:col-2 md:col-2 lg:col-1 xl:col-1">

    </div>
    <div class="sm:col-10 md:col-10 lg:col-11 xl:col-11 no-padding">
      <div class="flex">
        <div class="sm:col-12 md:col-12 lg:col-12 xl:col-8">
          <SectionItem :icon="sectionIcon" :icon_text="sectionText" :title="messagePageHeader"/>
          <div class="flex flex-column" v-if="!isSuccess">
            <span>Please fill in a form and we get back to you</span>
            <div class="flex pt-5">
              <div class="flex-1 p-2">
                <FloatLabel variant="in">
                  <InputText id="in_label" :fluid="true" v-model="firstName" autocomplete="off" maxlength="20" />
                  <label for="in_label">First Name</label>
                </FloatLabel>
              </div>
              <div class="flex-1 p-2">
                <FloatLabel variant="in">
                  <InputText id="in_label" :fluid="true" v-model="lastName" autocomplete="off" maxlength="20" />
                  <label for="in_label">Last Name</label>
                </FloatLabel>
              </div>
            </div>
            <div class="flex">
              <div class="flex-1 p-2">
                <FloatLabel variant="in">
                  <InputText :fluid="true" id="in_label" v-model="formFields.userEmail" autocomplete="off" maxlength="40"
                    :invalid="v$.userEmail.$errors.length > 0" />
                    <label for="in_label">Email</label> 
                </FloatLabel>
                <small class="error-messages" v-if="v$.userEmail.$errors.length > 0">{{
                    v$.userEmail.$errors[0].$message }}</small>
              </div>
              <div class="flex-1 p-2">

              </div>
            </div>
            <div class="p-2">
              <FloatLabel variant="in">
                <Textarea id="over_label" :fluid="true" v-model="message" rows="8" maxlength="4000" />
                <label for="in_label">Message here</label>
              </FloatLabel>
            </div>
            <span class="p-2 pt-4 pb-4 span-text">admgroup.com is committed to protecting and respecting your privacy, and we’ll
              only use your personal
              information to administer your account and to provide the products and services you requested from us.
              From time to time, we would like to contact you about our products and services, as well as other content
              that may be of interest to you. By clicking submit below, you consent to allow admgroup.com to store and
              process the personal information submitted above to provide you the content requested</span>

            <div class="flex">
              <div class="flex-1 p-2 pb-5">
                <Button label="Submit" :fluid="true" @click="submitForm()" raised />
              </div>
              <div class="flex-1 p-2">

              </div>
            </div>
          </div>
          <div v-if="isSuccess">
            <div class="add-heigh"></div>
            <MessagePage :iconName="messagePageIcon" :iconStyle="messagePageIconCSS" :pageBody="messagePageBody" />
          </div>

        </div>

        <div class="sm:flex-none md:flex-none lg:flex-none xl:col-4 contract-image">

        </div>
      </div>

    </div>
  </div>
</template>
<style scoped>
.disable-margin {
  margin: 0;
  padding: 0;
}

.span-text {
  font-size: 12px;
  font-weight: 500;
}

.contract-image {
  background-image: url("../../assets/img/contactus/adm-brand-look-book_final-36_1.png");
  /* background-image: url('https://via.placeholder.com/450'); */
  background-size: cover;
  background-position: top;
}

/* @media (max-width: 768px) {
  .contract-image {
    display: none;
  }
}

@media (max-width: 992px) {
  .contract-image {
    display: none;
  }
} */

.error-messages {
    margin-bottom: 16px;
    color: red;
    font-size: 12px;
    margin-bottom: 4px;
}

.add-heigh {
  height: 150px;
}
</style>
