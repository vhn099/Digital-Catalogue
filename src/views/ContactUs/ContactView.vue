<script setup>
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';


// components
import DockItem from '../../components/Dock.vue';
import HeaderItem from '../../components/Header.vue';
import CarouselItem from '../../components/Carousel.vue'
import CateHorizonItem from '../../components/CateHorizon.vue'
import SectionItem from '../../components/Section.vue'
import { ref } from 'vue';
// import MessagePage from '@/components/MessagePage.vue';
const value1 = ref(null);
const value2 = ref(null);
const value3 = ref(null);
const value4 = ref(null);


function toggleDarkMode() {
  document.documentElement.classList.toggle('my-app-dark');
}

function dimeho() {
  console.log(value1);
}

const sectionIcon = "src/assets/img/homepage/support.png";
const sectionText = "Contact us";
const line4 = {
  title: 'Selected',
  deck: 'Glassware Design'
}

const messagePageIconCSS = {
  fontSize: "62px",
  color: "#58DA67",
  fontWeight: "bold"
};

const messagePageBody = 'contact';
</script>

<template>
  <DockItem></DockItem>
  <div class="flex">
    <div class="col-1">

    </div>
    <div class="col-11">
      <div class="flex">
        <div class="col-8">
          <SectionItem :icon="sectionIcon" :icon_text="sectionText" line3="true"></SectionItem>
          <div class="flex flex-column">
            <span>Please fill in a form and we get back to you</span>
            <div class="flex">
              <div class="flex-1 p-2">
                <FloatLabel variant="in">
                  <InputText id="in_label" :fluid="true" v-model="value1" autocomplete="off" />
                  <label for="in_label">First Name</label>
                </FloatLabel>
              </div>
              <div class="flex-1 p-2">
                <FloatLabel variant="in">
                  <InputText id="in_label" :fluid="true" v-model="value2" autocomplete="off" />
                  <label for="in_label">Last Name</label>
                </FloatLabel>
              </div>
            </div>
            <div class="flex">
              <div class="flex-1 p-2">
                <FloatLabel variant="in">
                  <InputText id="in_label" :fluid="true" v-model="value3" autocomplete="off" />
                  <label for="in_label">Email</label>
                </FloatLabel>
              </div>
              <div class="flex-1 p-2">

              </div>
            </div>
            <div class="p-2">
              <FloatLabel variant="in">
                <Textarea id="over_label" autoResize="false" fluid="true" v-model="value4" rows="10" />
                <label for="in_label">Message here</label>
              </FloatLabel>
            </div>
            <span class="p-2 span-text">admgroup.com is committed to protecting and respecting your privacy, and we’ll
              only use your personal
              information to administer your account and to provide the products and services you requested from us.
              From time to time, we would like to contact you about our products and services, as well as other content
              that may be of interest to you. By clicking submit below, you consent to allow admgroup.com to store and
              process the personal information submitted above to provide you the content requested</span>

            <div class="flex">
              <div class="flex-1 p-2">
                <Button label="Submit" :fluid="true" @click="dimeho()" raised />
              </div>
              <div class="flex-1 p-2">

              </div>
            </div>
          </div>
          <!-- <MessagePage :iconStyle="messagePageIconCSS" :pageBody="messagePageBody"/> -->
        </div>

        <div class="col-4 contract-image">

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

@media (max-width: 768px) {
  .contract-image {
    display: none;
  }
}
</style>
