<script setup>
import { UserFirestore } from "@/lib/User";
import useVuelidate from "@vuelidate/core";
import { minLength, required, sameAs, email, helpers } from "@vuelidate/validators";
import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Drawer from "primevue/drawer";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Toast from "primevue/toast";
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from "primevue/usetoast";
import { computed, onMounted, reactive, ref } from "vue";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";

const visible = ref(false);
const formFields = reactive({
    id: '',
    username: '',
    firstname: '',
    lastname: '',
    password: '',
    confirmPassword: '',
    isAdmin: false
});

/* COMPUTED VALUES */
const rules = computed(() => {
    return {
        username: {
            required,
            email
        },
        password: {
            required,
            minLength: minLength(6)
        },
        confirmPassword: {
            required,
            sameAs: sameAs(formFields.password)
        }
    };
});
/* COMPUTED VALUES */

const tableColumns = [
    {
        field: 'email',
        label: 'Email',
        styles: {

        }
    },
    {
        field: 'firstname',
        label: 'First Name',
        styles: {
            width: "25%"
        }
    },
    {
        field: 'lastname',
        label: 'Last Name',
        styles: {
            width: "25%"
        }
    },
    {
        field: 'created',
        label: 'Created On',
        styles: {
            width: "10%"
        }
    },
    {
        field: 'created_by',
        label: 'Created By',
        styles: {
            width: "10%"
        }
    },
    {
        field: 'updated',
        label: 'Updated On',
        styles: {
            width: "10%"
        }
    },
    {
        field: 'updated_by',
        label: 'Updated By',
        styles: {
            width: "10%"
        }
    }
]
const v$ = useVuelidate(rules, formFields);
const toast = useToast();
const users = ref();
const edit = ref();
const datatable = ref();
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(async () => {
    users.value = await getUsers();
});

/* FUNCTIONS */
const resetFormData = () => {
    formFields.lastname = '';
    formFields.firstname = '';
    formFields.username = '';
    formFields.password = '';
    formFields.confirmPassword = '';
    formFields.isAdmin = '';
};
const closeDrawer = () => {
    visible.value = false;
    edit.value = false;
    resetFormData();
};
const openDrawer = () => { // Used for insert case
    visible.value = true;
    edit.value = false;
};
const getUserFormData = () => {
    const userForm = {};
    Object.keys(formFields).forEach(key => {
        userForm[key] = formFields[key];
    });
    userForm.updated = Timestamp.now().toDate();
    userForm.updated_by = getAuth().currentUser.email;
    if (!edit.value) {
        userForm.created = Timestamp.now().toDate();
        userForm.created_by = getAuth().currentUser.email;
    }
    return userForm;
}

const getUsers = async () => {
    const userList = [];
    (await UserFirestore.getUsers()).forEach(user => {
        const data = user.data();
        const object = {
            id: user.id,
            email: data.email,
            full_name: data.full_name || '',
            isAdmin: data.isAdmin,
            created: data.created ? data.created.toDate().toLocaleString() : '',
            created_by: data.created_by || '',
            updated: data.updated ? data.updated.toDate().toLocaleString() : '',
            updated_by: data.updated_by || ''
        };
        userList.push(object);
    });
    return userList;
};

const submitForm = async () => {
    const isValid = await v$.value.$validate();
    if (isValid || edit.value) {
        const userFormData = getUserFormData();
        let result = {};
        if (edit.value) {
            result = await UserFirestore.updateUser(userFormData);
        } else {
            result = await UserFirestore.createUsers(userFormData);
        }
        toast.add({
            summary: 'System Message',
            severity: result.status,
            detail: result.message,
            life: 3000 // 3s
        });
        if (result.status === 'success') {
            visible.value = false;
        }
    } else {

    }
};
const deleteRow = (data) => {

};
const editRow = (data) => {
    formFields.id = data.id;
    formFields.username = data.email;
    formFields.firstname = data.firstname;
    formFields.lastname = data.lastname;
    formFields.isAdmin = data.isAdmin;

    visible.value = true;
    edit.value = true;
};
/* FUNCTIONS */

</script>
<template>
    <Toast />
    <div class="">
        <Drawer v-model:visible="visible" header="USER FORM" class="w-30rem" position="right">
            <div class="form-container">
                <form>
                    <div class="flex flex-col" v-if="edit">
                        <label class="form-label" for="id">ID</label>
                        <InputText :readonly="edit" :fluid="true" id="id"
                            v-model="formFields.id" />
                    </div>

                    <div class="flex flex-col">
                        <label class="form-label" for="username">Username <span class="required-icon">*</span></label>
                        <InputText :readonly="edit" :fluid="true" placeholder="Username" id="username"
                            v-model="formFields.username" :invalid="v$.username.$errors.length > 0" />
                        <small class="error-messages" v-if="v$.username.$errors.length > 0">{{
                            v$.username.$errors[0].$message }}</small>
                    </div>

                    <div class="flex flex-col">
                        <label class="form-label" for="firstname">First Name</label>
                        <InputText :fluid="true" placeholder="First Name" id="firstname"
                            v-model="formFields.firstname" />
                    </div>

                    <div class="flex flex-col">
                        <label class="form-label" for="lastname">Last Name</label>
                        <InputText :fluid="true" placeholder="Last Name" id="lastname" v-model="formFields.lastname" />
                    </div>

                    <div class="flex flex-col" v-if="!edit">
                        <label class="form-label" for="username">Password <span class="required-icon">*</span></label>
                        <Password :feedback="false" :fluid="true" placeholder="Password" id="password"
                            v-model="formFields.password" :invalid="v$.password.$errors.length > 0" />
                        <small class="error-messages" v-if="v$.password.$errors.length > 0">{{
                            v$.password.$errors[0].$message }}</small>
                    </div>

                    <div class="flex flex-col" v-if="!edit">
                        <label class="form-label" for="username">Confirm Password <span
                                class="required-icon">*</span></label>
                        <Password :feedback="false" :fluid="true" placeholder="Confirm Password" id="confirmPassword"
                            v-model="formFields.confirmPassword" :invalid="v$.confirmPassword.$errors.length > 0" />
                        <small class="error-messages" v-if="v$.confirmPassword.$errors.length > 0">{{
                            v$.confirmPassword.$errors[0].$message }}</small>
                    </div>

                    <div class="flex items-center mt-3">
                        <Checkbox v-model="formFields.isAdmin" inputId="isAdmin" name="isAdmin" value="Admin" />
                        <label for="isAdmin" class="ml-2"> Admin </label>
                    </div>
                </form>

                <div>
                    <Button @click="submitForm">Submit</Button>
                    <Button severity="secondary" @click="closeDrawer">Cancel</Button>
                </div>

            </div>
        </Drawer>
        <div class="flex flex-col table-section">
            <Button class="add-user" @click="openDrawer">Add User</Button>
            <div class="card">
                <DataTable datakey="id" :value="users" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="width: 100%"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    ref="datatable"
                    :filters="filters"
                    :paginator="true"
                >
                    <template #header>
                        <div class="flex flex-wrap gap-2 items-center justify-between">
                            <h4 class="m-1">Manage Users</h4>
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </IconField>
                        </div>
                    </template>
                    <Column v-for="column in tableColumns" :field="column.field" :header="column.label"
                        :style="{ ...column.styles }"></Column>
                    <Column class="actions">
                        <template #body="{ data }">
                            <Button class="table-button" severity="secondary" icon="pi pi-trash"
                                @click="deleteRow(data)" rounded></Button>
                            <Button class="table-button" icon="pi pi-pencil" @click="editRow(data)" severity="secondary"
                                rounded></Button>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped>
.form-label {
    margin-top: 10px;
}

.required-icon {
    color: red;
    font-size: 16px;
    margin-left: 4px;
}

.flex-col {
    flex-direction: column;
}

.error-messages {
    margin-bottom: 16px;
}

.error-messages {
    color: red;
    font-size: 12px;
    margin-bottom: 4px;
}

:deep(.p-inputtext) {
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.add-user {
    width: 100px;
    height: 40px;
    margin-bottom: 20px;
}

.table-section {
    padding: 20px;
}

.table-button {
    margin-right: 10px;
}

:deep(.actions) {
    display: flex;
}
</style>