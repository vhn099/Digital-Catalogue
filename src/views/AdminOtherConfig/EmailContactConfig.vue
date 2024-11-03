<script setup>
import { FilterMatchMode } from '@primevue/core';
import useVuelidate from '@vuelidate/core';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { required, email } from "@vuelidate/validators";
import { Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { OtherConfigFirestore } from '@/lib/OtherConfig';
import { ExportData } from '@/lib/Export';

const tableColumns = [
    {
        field: 'email',
        label: 'Email',
        styles: {

        }
    },
    {
        field: 'name',
        label: 'Name',
        styles: {

        }
    },
    {
        field: 'created',
        label: 'Created On',
        styles: {

        }
    },
    {
        field: 'created_by',
        label: 'Created By',
        styles: {

        }
    },
    {
        field: 'updated',
        label: 'Updated',
        styles: {

        }
    },
    {
        field: 'updated_by',
        label: 'Updated By',
        styles: {

        }
    }
];
const toast = useToast();

/* REF DEFINITION START */
const formFields = reactive({
    id: '',
    email: '',
    name: '',
});
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const datatable = ref();
const emailContacts = ref();
const visible = ref(false);
const edit = ref(false);

/* COMPUTED VALUES */
const rules = computed(() => {
    return {
        email: {
            required,
            email
        },
    };
});

/* FORM VALIDATE */
const v$ = useVuelidate(rules, formFields);

/* FUNCTIONS START */
const getEmailContacts = async () => {
    const emailContactList = [];
    (await OtherConfigFirestore.getEmailContacts()).forEach(emailContact => {
        const data = emailContact.data();
        const object = {
            id: emailContact.id,
            email: data.email,
            name: data.name || "",
            created: data.created ? data.created.toDate().toLocaleString() : '',
            created_by: data.created_by || '',
            updated: data.updated ? data.updated.toDate().toLocaleString() : '',
            updated_by: data.updated_by || ''
        };
        emailContactList.push(object);
    });
    return emailContactList;
};

/* FUNCTIONS DEFINITION START */
const resetFormData = () => {
    formFields.id = "";
    formFields.email = "";
    formFields.name = "";
};
const getUserFormData = () => {
    const emailContactForm = {};
    Object.keys(formFields).forEach(key => {
        emailContactForm[key] = formFields[key];
    });
    emailContactForm.updated = Timestamp.now().toDate();
    emailContactForm.updated_by = getAuth().currentUser.email;
    if (!edit.value) {
        emailContactForm.created = Timestamp.now().toDate();
        emailContactForm.created_by = getAuth().currentUser.email;
    }

    return emailContactForm;
};
const openDialog = () => {
    visible.value = true;
    edit.value = false;
}
const closeDialog = () => {
    visible.value = false;
    edit.value = false;
};
const editRow = (data) => {
    formFields.id = data.id;
    formFields.email = data.email;
    formFields.name = data.name;

    edit.value = true;
    visible.value = true;
};
const submitForm = async () => {
    const isValid = v$.value.$validate();
    if (isValid) {
        emits('setLoading', true);
        const formData = getUserFormData();
        let result = {};

        if (edit.value) {
            result = await OtherConfigFirestore.updateEmailContacts(formData.id, {
                name: formData.name,
                updated: formData.updated,
                updated_by: formData.updated_by
            });
        } else {
            result = await OtherConfigFirestore.addEmailContacts(formData);
        }
        toast.add({
            summary: 'System Message',
            severity: result.status,
            detail: result.message,
            life: 3000 // 3s
        });
        if (result.status === 'success') {
            visible.value = false;
            emailContacts.value = await getEmailContacts();
        }
        emits('setLoading', false);
    } else {

    }
};
const exportMyList = (event) => {
    ExportData.exportMyListAsExcel(emailContacts.value, "contact_emails");
};

/* VUE EVENTS */
onMounted(async () => {
    emailContacts.value = await getEmailContacts();
});

watch(visible, () => {
    if (!visible.value) {
        resetFormData();
    }
});
const emits = defineEmits(['setLoading']);
</script>

<template>
    <Toast />
    <Dialog v-model:visible="visible" modal :header='formFields.id ? formFields.id : "New User"'
        :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="form-container">
            <form>

                <div class="flex flex-col">
                    <label class="form-label" for="email">Email <span class="required-icon">*</span></label>
                    <InputText :readonly="edit" :fluid="true" placeholder="Email" id="email"
                        v-model="formFields.email" :invalid="v$.email.$errors.length > 0" maxlength="150" />
                    <small class="error-messages" v-if="v$.email.$errors.length > 0">{{
                        v$.email.$errors[0].$message }}</small>
                </div>

                <div class="flex flex-col">
                    <label class="form-label" for="name">Name</label>
                    <InputText :fluid="true" placeholder="Contact email name" id="name" v-model="formFields.name"
                        maxlength="150" />
                </div>
            </form>

            <div class="flex items-center mt-3 gap-2">
                <Button type="button" label="Save" icon="pi pi-save" @click="submitForm" />
                <Button type="button" label="Cancel" severity="warn" icon="pi pi-times" @click="closeDialog" />
            </div>

        </div>
    </Dialog>

    <DataTable :value="emailContacts" datakey="id" paginator :rows="20" :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="width: 100%"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="{first} to {last} of {totalRecords}" ref="datatable" :filters="filters"
        :paginator="true">
        <template #header>
            <div class="header-table">
                <span class="table-title">Manage Email Contacts</span>
                <div class="table-actions gap-2">
                    <div>
                        <Button severity="secondary" type="button" label="Export" icon="pi pi-external-link" @click="exportMyList($event)" />
                    </div>
                    <div>
                        <Button type="button" label="Add" icon="pi pi-plus" @click="openDialog"/>
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
                    <Button icon="pi pi-pencil" aria-label="Update" rounded @click="editRow(data)"/>
                </div>
            </template>
        </Column>
    </DataTable>
</template>

<style scoped>
/* TABLE CSS START */
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

/* TABLE CSS END */

/* FORM CSS START */
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
/* FORM CSS END */
</style>