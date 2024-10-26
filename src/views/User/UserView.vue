<script setup>
import { UserFirestore } from "@/lib/User";
import useVuelidate from "@vuelidate/core";
import { minLength, required, sameAs, email, helpers } from "@vuelidate/validators";
import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import ToggleSwitch from "primevue/toggleSwitch";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Toast from "primevue/toast";
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { computed, onMounted, reactive, ref, watch } from "vue";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import ConfirmDialog from "primevue/confirmdialog";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const formFields = reactive({
    id: '',
    username: '',
    firstname: '',
    lastname: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
    deactive: ['deactive'],
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
        field: 'isAdmin',
        label: 'Admin',
        styles: {

        }
    },
    {
        field: 'disabled',
        label: "Deactivated",
        styles: {

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
const confirm = useConfirm();
const v$ = useVuelidate(rules, formFields);
const toast = useToast();
const users = ref();
const edit = ref();
const datatable = ref();
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const visible = ref(false);
const spinner = ref(false);

/* FUNCTIONS */
const resetFormData = () => {
    formFields.id = '';
    formFields.lastname = '';
    formFields.firstname = '';
    formFields.username = '';
    formFields.password = '';
    formFields.confirmPassword = '';
    formFields.isAdmin = false;
    formFields.deactive = [];
};
const closeDrawer = () => {
    visible.value = false;
    edit.value = false;
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
            firstname: data.firstname || '',
            lastname: data.lastname || '',
            isAdmin: data.isAdmin ? "YES" : "NO",
            disabled: data.disabled ? "YES" : "NO",
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
    spinner.value = true;
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
            users.value = await getUsers();
        }
    } else {

    }
    spinner.value = false;
};
const deleteRow = (data) => {
    confirm.require({
        message: 'Do you want to delete this user ?',
        header: 'ATTENTION',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: async () => {
            const result = await UserFirestore.deleteUser(data.id, data.username, Timestamp.now().toDate(), getAuth().currentUser.email);
            toast.add({
                summary: 'System Message',
                severity: result.status,
                detail: result.message,
                life: 3000 // 3s
            });
            users.value = await getUsers();
        },
        reject: () => {

        }
    })
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

watch(visible, () => {
    if (!visible.value) {
        resetFormData();
    }
});

onMounted(async () => {
    users.value = await getUsers();
});
</script>
<template>
    <LoadingSpinner v-if="spinner" />
    <Toast />
    <ConfirmDialog />
    <Dialog v-model:visible="visible" modal :header='formFields.id ? formFields.id : "New User"'
        :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="form-container">
            <form>
                <div class="flex flex-col" v-if="edit">
                    <label class="form-label" for="id">ID</label>
                    <InputText readonly :fluid="true" id="id" v-model="formFields.id" />
                </div>

                <div class="flex flex-col">
                    <label class="form-label" for="email">Email <span class="required-icon">*</span></label>
                    <InputText :readonly="edit" :fluid="true" placeholder="Email" id="email"
                        v-model="formFields.username" :invalid="v$.username.$errors.length > 0" />
                    <small class="error-messages" v-if="v$.username.$errors.length > 0">{{
                        v$.username.$errors[0].$message }}</small>
                </div>

                <div class="flex flex-col">
                    <label class="form-label" for="firstname">First Name</label>
                    <InputText :fluid="true" placeholder="First Name" id="firstname" v-model="formFields.firstname" />
                </div>

                <div class="flex flex-col">
                    <label class="form-label" for="lastname">Last Name</label>
                    <InputText :fluid="true" placeholder="Last Name" id="lastname" v-model="formFields.lastname" />
                </div>

                <div class="flex flex-col" v-if="!edit">
                    <label class="form-label" for="password">Password <span class="required-icon">*</span></label>
                    <Password :feedback="false" :fluid="true" placeholder="Password" id="password"
                        v-model="formFields.password" :invalid="v$.password.$errors.length > 0" />
                    <small class="error-messages" v-if="v$.password.$errors.length > 0">{{
                        v$.password.$errors[0].$message }}</small>
                </div>

                <div class="flex flex-col" v-if="!edit">
                    <label class="form-label" for="confirmPassword">Confirm Password <span
                            class="required-icon">*</span></label>
                    <Password :feedback="false" :fluid="true" placeholder="Confirm Password" id="confirmPassword"
                        v-model="formFields.confirmPassword" :invalid="v$.confirmPassword.$errors.length > 0" />
                    <small class="error-messages" v-if="v$.confirmPassword.$errors.length > 0">{{
                        v$.confirmPassword.$errors[0].$message }}</small>
                </div>

                <div class="flex justify-center mt-3" v-if="edit">
                    <div class="flex items-center">
                        <Checkbox v-model="formFields.deactive" inputId="deactive" name="deactive" value="deactive" />

                        <label for="deactive" class="ml-2"> Deactive ? </label>
                    </div>
                    
                </div>
                

                <div class="flex items-center mt-3">
                    <ToggleSwitch v-model="formFields.isAdmin">
                        <template #handle="{ checked }">
                            <i :class="['!text-xs pi', { 'pi-check': checked, 'pi-times': !checked }]" />
                        </template>
                    </ToggleSwitch>

                    <label for="isAdmin" class="ml-2"> Admin? </label>
                </div>
            </form>

            <div class="flex items-center mt-3 gap-2">
                <Button type="button" label="Save" icon="pi pi-save" @click="submitForm" />
                <Button type="button" label="Cancel" severity="warn" icon="pi pi-times" @click="closeDrawer" />
            </div>

        </div>
    </Dialog>
    <div class="">
        <div class="flex flex-col table-section min-height-750">
            <div class="card">
                <DataTable datakey="id" :value="users" paginator :rows="20" :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="width: 100%"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" ref="datatable" :filters="filters"
                    :paginator="true">
                    <template #header>
                        <div class="header-table">
                            <span class="table-title">Manage Users</span>
                            <div class="table-actions gap-2">
                                <div>
                                    <Button type="button" label="Add" icon="pi pi-plus" @click="openDrawer" />
                                </div>
                                <div>
                                    <IconField>
                                        <InputIcon>
                                            <i class="pi pi-search" />
                                        </InputIcon>
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </IconField>
                                </div>

                            </div>
                        </div>
                    </template>
                    <Column v-for="column in tableColumns" :field="column.field" :header="column.label"
                        :style="{ ...column.styles }">
                        <template #body="slotProps">
                            <p>{{ slotProps.data[column.field] }}</p>
                        </template>
                    </Column>
                    <Column header="Actions">
                        <template #body="{ data }">
                            <div class="actions">
                                <!-- <Button icon="pi pi-trash" aria-label="Delete" @click="deleteRow(data)" rounded
                                    severity="warn" /> -->
                                <Button icon="pi pi-pencil" aria-label="Update" @click="editRow(data)" rounded />
                            </div>
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
    color: red;
    font-size: 12px;
    margin-bottom: 4px;
}

:deep(.p-inputtext) {
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

/* DATATABLE CSS START */
.table-section {
    padding: 20px;
}

:deep(.actions) {
    display: flex;
}

:deep(.actions button) {
    display: flex;
    text-align: center;
    margin: 5px;
}

.header-table {
    display: flex;
    justify-content: space-between;
}

.table-title {
    font-weight: 700;
    font-size: 20px;
}

.table-actions {
    display: flex;
    justify-content: center;
}
/* DATATABLE CSS END */

.items-center {
    align-items: center;
}
</style>