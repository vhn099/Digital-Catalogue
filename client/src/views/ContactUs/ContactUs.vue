<script setup lang="ts">
import { onMounted } from "vue";

//example components
import DefaultNavbar from "../Layouts/NavbarDefault.vue";
import DefaultFooter from "../Layouts/FooterDefault.vue";

//image
import image from "@/assets/img/illustrations/illustration-signin.jpg";

//material components
// import MaterialInput from "@/components/MaterialInput.vue";
// import MaterialTextArea from "@/components/MaterialTextArea.vue";
// import MaterialButton from "@/components/MaterialButton.vue";

// material-input
// import setMaterialInput from "@/assets/js/material-input";
// onMounted(() => {
//   setMaterialInput();
// });
</script>
<template>
  <DefaultNavbar light />
  <section>
    <div class="position-relative border-radius-xl overflow-hidden shadow-lg">
   
      <div class="tab-content tab-space">
        <div class="">
          <div
            class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column">
            <div class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center"
              :style="{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
              }" loading="lazy"></div>
          </div>
          <div class="mt-3 col-xl-5 col-lg-6 col-md-7 d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-5">
            <div class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5">
              <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
                <div class="bg-gradient-success shadow-success border-radius-lg p-3">
                  <h3 class="text-white text-success mb-0">Contact us</h3>
                </div>
              </div>
              <div class="card-body">
                <p class="pb-3">
                  For further questions, including partnership opportunities,
                  please email admin@gmail.com or contact using our
                  contact form.
                </p>
                <el-form id="contact-form" ref="formRef" style="width: auto" :model="dynamicValidateForm"
                  label-width="auto">
                  <div class="card-body p-0 my-3">
                    <div class="row">
                      <div class="col-md-6">
                        <el-form-item class="input-label" prop="full_name">
                          <el-input class="input-group-static mb-4" v-model="dynamicValidateForm.full_name"
                            autocomplete="off" placeholder="Full Name" />
                        </el-form-item>
                      </div>
                      <div class="col-md-6 ps-md-2">
                        <el-form-item class="input-label" prop="email" :rule="[
                          {
                            type: 'email',
                            message: 'Please input correct email address',
                            trigger: ['blur', 'change'],
                          }
                        ]">
                          <el-input class="input-group-static mb-4" placeholder="admin@gmail.com"
                            v-model="dynamicValidateForm.email" autocomplete="off" />
                        </el-form-item>
                      </div>
                    </div>
                    <div class="form-group mb-0 mt-md-0 mt-4">
                      <el-form-item class="input-label" prop="detailed_description">
                        <el-input :rows="6" type="textarea" minLength="250" class="input-group-static mb-4"
                          placeholder="How can we help you ? Describe your problem in at least 250 characters"
                          v-model="dynamicValidateForm.detail_description" autocomplete="off" />
                      </el-form-item>
                    </div>
                    <div class="row">
                      <div class="col-md-12 text-center">
                        <el-form-item>
                          <el-button class="my-2 mb-2 send-message-button text-center" type="primary"
                            @click="submitForm(formRef)">SEND MESSAGE
                          </el-button>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </el-form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <DefaultFooter />
</template>

<script lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import router from "@/router";

const formRef = ref<FormInstance>()

const dynamicValidateForm = reactive<{
  full_name: string
  email: string,
  detail_description: string
}>({
  email: '',
  full_name: '',
  detail_description: ''
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      console.log(dynamicValidateForm);
    } else {
      alert('error');
    }
  })
}

</script>

<style scoped>
.send-message-button {
  display: block;
  margin: auto;
}
</style>