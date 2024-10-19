<script setup>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import Button from "primevue/button";
import Drawer from "primevue/drawer";
import InputText from "primevue/inputtext";
import { reactive, ref } from "vue";

const visible = ref(false);
const formFields = reactive({
    username: { label: 'Username', type: 'text', value: '' },
    password: { label: 'Password', type: 'password', value: '' },
});

const rules = {
    username: { required },
    password: { required }
};

const v$ = useVuelidate(rules, formFields);

</script>
<template>
    <div class="card flex justify-center">
        <Drawer v-model:visible="visible" header="USER FORM" class="!w-full md:!w-30 lg:!w-[100rem]" position="right">
            <InputText :fluid="true" class="input" placeholder="Username" id="username"
                v-model="v$.username.$model.value" :class="{ 'p-invalid': v$.username.$error }" />
        </Drawer>
        <Button icon="pi pi-arrow-right" @click="visible = true" />
    </div>
</template>

<style scoped></style>

<script>
export default {

}
</script>