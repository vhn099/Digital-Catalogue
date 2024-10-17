<script setup>
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
</script>

<template>
    <p class="logo">
        <img style="object-fit: contain;" width="125" height="125px" src="../../../assets/img/adm_logo.png" />
    </p>
    <form @submit.prevent="handleSubmit(v$)">
        <div class="p-field">
            <label for="username">Username</label>
            <InputText id="username" v-model="v$.username.$model.value" :class="{ 'p-invalid': v$.username.$error }" />
            <small v-if="v$.username.$error" class="p-error">{{
                v$.username.$errors[0].$message }}</small>
        </div>
        <div class="p-field">
            <label for="password">Password</label>
            <Password id="password" v-model="v$.password.$model.value" />
            <small v-if="v$.password.$error" class="p-error">{{
                v$.password.$errors[0].$message }}</small>
        </div>
        <Button type="submit" label="Login" />
    </form>
</template>

<style scoped></style>

<script>
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

/* IMAGE DEFINITION */

export default {
    setup() {
        const formFields = reactive({
            username: { label: 'Username', type: 'text', value: '' },
            password: { label: 'Password', type: 'password', value: '' },
        });

        const rules = {
            username: { required },
            password: { required: false }
        };

        const v$ = useVuelidate(rules, formFields);
        return {
            formFields,
            v$,
        }
    },
    data() {
        return {
            AdmLogo: () => import('@/assets/img/adm_logo.png')
        };
    },
    methods: {
        handleSubmit: async (v$) => {
            const isValid = await v$.$validate();
            console.log(isValid);
            if (isValid) {
                // Login logic here
                console.log('Login successful!');
            } else {
                console.log('Invalid form');
            }
        },
    }
};
</script>

<style>
</style>