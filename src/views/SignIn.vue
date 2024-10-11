<script lang="ts" setup>
import { onMounted } from "vue";

// example components
// import Header from ".//Header/Header.vue";
import Header from "./Layouts/Header.vue";

//Vue Material Kit 2 components
// import MaterialInput from "@/components/MaterialInput.vue";
// import MaterialSwitch from "@/components/MaterialSwitch.vue";
// import MaterialButton from "@/components/MaterialButton.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";
onMounted(() => {
  setMaterialInput();
});

</script>
<template>
  <!-- <DefaultNavbar transparent /> -->
  <Header>
    <div class="page-header align-items-start min-vh-100" :style="{
      backgroundImage:
        'url(https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80)'
    }" loading="lazy">
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container my-auto">
        <div class="row">
          <div class="col-lg-4 col-md-8 col-12 mx-auto">
            <div class="card z-index-0 fadeIn3 fadeInBottom">
              <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div class="bg-gradient-success shadow-success border-radius-lg py-3 pe-1" style="background-color: aqua !important;">
                  <h4 class="text-white font-weight-bolder text-center mt-2 mb-0" >
                    Sign in
                  </h4>
                  <!-- <div class="row mt-3">
                    <div class="col-2 text-center ms-auto">
                      <a class="btn btn-link px-3" href="javascript:;">
                        <i class="fa fa-facebook text-white text-lg"></i>
                      </a>
                    </div>
                    <div class="col-2 text-center px-1">
                      <a class="btn btn-link px-3" href="javascript:;">
                        <i class="fa fa-github text-white text-lg"></i>
                      </a>
                    </div>
                    <div class="col-2 text-center me-auto">
                      <a class="btn btn-link px-3" href="javascript:;">
                        <i class="fa fa-google text-white text-lg"></i>
                      </a>
                    </div>
                  </div> -->
                </div>
              </div>
              <div class="card-body">
                <el-form ref="formRef" style="width: auto" :model="dynamicValidateForm" label-width="auto">
                  <el-form-item class="input-label" label="Email" prop="email" :rules="[
                      {
                        type: 'email',
                        message: 'Please input correct email address',
                        trigger: ['blur', 'change'],
                      },
                    ]">
                    <el-input v-model="dynamicValidateForm.email" autocomplete="off"  />
                  </el-form-item>
                  <el-form-item class="input-label" label="Password" prop="password">
                    <el-input minlength="6" v-model="dynamicValidateForm.password" autocomplete="off" type="password"/>
                  </el-form-item>

                  <el-form-item prop="remember">
                    <el-checkbox v-model="dynamicValidateForm.remember" label="Remember Me" />
                  </el-form-item>
                  <el-form-item>
                    <el-button class="my-2 mb-2 sign-in-button text-center" type="primary"
                      @click="submitForm(formRef)">Submit</el-button>
                  </el-form-item>
                </el-form>

                <!-- <form role="form" class="text-start">
                  <MaterialInput
                    id="email"
                    class="input-group-outline my-3"
                    :label="{ text: 'Email', class: 'form-label' }"
                    type="email"
                  />
                  <MaterialInput
                    id="password"
                    class="input-group-outline mb-3"
                    :label="{ text: 'Password', class: 'form-label' }"
                    type="password"
                  />
                  <MaterialSwitch
                    class="d-flex align-items-center mb-3"
                    id="rememberMe"
                    labelClass="mb-0 ms-3"
                    checked
                    >Remember me</MaterialSwitch
                  >

                  <div class="text-center">
                    <MaterialButton
                      class="my-4 mb-2"
                      variant="gradient"
                      color="success"
                      fullWidth
                      >Sign in</MaterialButton
                    >
                  </div>
                  <p class="mt-4 text-sm text-center">
                    Forgot your password?
                    <a
                      href="#"
                      class="text-success text-gradient font-weight-bold"
                      >Reset</a
                    >
                  </p>
                </form> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="footer position-absolute bottom-2 py-2 w-100">
        <div class="container">
          <div class="row align-items-center justify-content-lg-between">
            <div class="col-12 col-md-4 my-auto">
              <div class="copyright text-center text-sm text-white text-lg-start">
                Power By Adm GROUP
              </div>
            </div>
            <div class="col-12 col-md-8">
              <ul class="nav nav-footer justify-content-center justify-content-lg-end">
                <li class="nav-item">
                  <a href="https://www.admgroup.com/cookie-policy" class="nav-link text-white" target="_blank">Cookie
                    Policy</a>
                </li>
                <li class="nav-item">
                  <a href="https://www.admgroup.com/cookie-policy" class="nav-link text-white"
                    target="_blank">Accessibility Statement</a>
                </li>
                <li class="nav-item">
                  <a href="https://www.admgroup.com/website-terms-of-use" class="nav-link text-white"
                    target="_blank">Terms of Use</a>
                </li>
                <li class="nav-item">
                  <a href="https://www.admgroup.com/website-privacy-policy" class="nav-link pe-0 text-white"
                    target="_blank">Privacy Policy</a>
                </li>
                <li class="nav-item">
                  <a href="https://www.admgroup.com/data-security-policy" class="nav-link pe-0 text-white"
                    target="_blank">Data Security Policy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </Header>
</template>

<script lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import router from "@/router";

const formRef = ref<FormInstance>()

const dynamicValidateForm = reactive<{
  password: string
  email: string,
  remember: boolean
}>({
  email: '',
  password: '',
  remember: true
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      await signInWithEmailAndPassword(getAuth(), dynamicValidateForm.email, dynamicValidateForm.password).then(response =>{
        router.push("/home");
      });

    } else {
      console.log('error submit!');
    }
  })
}

</script>

<style scoped>
.sign-in-button {
  width: 100%;
}

.input-label {
  line-height: 100;
}
</style>