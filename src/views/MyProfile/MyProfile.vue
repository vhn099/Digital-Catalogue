<script setup>
// components
import DockItem from '../../components/Dock.vue';
import SectionItem from '../../components/Section.vue'
import DeckItem from '../../components/DeckCard.vue'
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';

import { ref } from 'vue';
const sectionIcon = "src/assets/img/icon/profile.png";
const sectionText = "My Profile";
</script>

<template>
    <DockItem></DockItem>

    <div class="flex">
        <div class="col-1">

        </div>
        <div class="col-11">

            <!-- <SectionItem></SectionItem> -->
            <!-- <SectionItem :icon="sectionIcon" :icon_text="sectionText"></SectionItem> -->
            <!-- Keep your profile up to date to ensure we have the latest information. -->

            <div class="flex">
                <div class="col-12">
                    <SectionItem :icon="sectionIcon" :icon_text="sectionText" line3="true"></SectionItem>
                    <div class="flex flex-column">
                        <!-- <span>Please fill in a form and we get back to you</span> -->
                        <span class="profile-description">Keep your profile up to date to ensure we have the latest information.</span>

                        <div class="flex">
                            <div class="flex-1 p-2">
                                <FloatLabel variant="in">
                                    <InputText id="in_label" :fluid="true" v-model="firstName" autocomplete="off" />
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
                                    <InputText id="in_label" disabled :fluid="true" v-model="userEmail"
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
                                <Button label="Reset Password" severity="warn" :fluid="true" @click="submitForm()"
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
    height: 300px;
}
</style>