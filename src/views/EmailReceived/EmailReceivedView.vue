<script setup>

import { Timestamp, collection, getDocs } from "firebase/firestore";
import { db } from "@/main";
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Toast from "primevue/toast";
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from "primevue/usetoast";
import { onMounted, reactive, ref } from "vue";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";

const visible = ref(false);
const formFields = reactive({
    email: '',
    firstname: '',
    lastname: '',
    message: ''
});

const tableColumns = [
    {
        field: 'email',
        label: 'Email',
        styles: {
            maxWidth: "300px",
            wordWrap: "break-word",
        }
    },
    {
        field: 'first_name',
        label: 'First Name',
        styles: {
            width: "8%"
        }
    },
    {
        field: 'last_name',
        label: 'Last Name',
        styles: {
            width: "8%"
        }
    },
    {
        field: 'message',
        label: 'Message',
        styles: {
            maxWidth: "500px",
        }
    },
    {
        field: 'receiver',
        label: 'Receiver',
        styles: {
            // width: "10%",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            wordWrap: "break-word",
            // overFlow: "hidden",
            overflow: "hidden"
        }
    },
    {
        field: 'state',
        label: 'State',
        styles: {
            width: "10%"
        }
    },
    {
        field: 'created',
        label: 'Created On',
        styles: {
            width: "10%"
        }
    },

]
//const v$ = useVuelidate(rules, formFields);
const toast = useToast();
const users = ref();
const view = ref();
const datatable = ref();
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(async () => {
    users.value = await getEmails();
});

/* FUNCTIONS */
const resetFormData = () => {
    formFields.email = '';
    formFields.lastname = '';
    formFields.firstname = '';
    formFields.message = '';
};
const closeDrawer = () => {
    visible.value = false;
    view.value = false;
    resetFormData();
};

const getEmails = async () => {
    const emailList = [];
    const querySnapshot = await getDocs(collection(db, 'mail'));
    querySnapshot.forEach(mail => {
        const data = mail.data();
        const object = {
            email: data.message.email || '',
            first_name: data.message.firstName || '',
            last_name: data.message.lastName || '',
            subject: data.message.subject || '',
            message: data.message.html || '',
            receiver: data.to || '',
            state: data.delivery.state || '',
            created: data.delivery.startTime ? data.delivery.startTime.toDate().toLocaleString() : '',
        };
        emailList.push(object);
    });
    return emailList;
};

const viewRow = (data) => {
    formFields.email = data.email;
    formFields.firstname = data.first_name;
    formFields.lastname = data.last_name;
    formFields.message = data.message;
    visible.value = true;
    view.value = true;
};
/* FUNCTIONS */

</script>
<template>
    <Toast />
    <div class="">
        <!-- <Button label="Show" @click="visible = true" /> -->

        <Dialog v-model:visible="visible" modal :header='formFields.id ? formFields.id : "New User"'
            :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <div class="form-container">
                <form>
                    <div class="flex flex-col">
                        <label class="form-label">Email</label>
                        <InputText :readonly="view" :fluid="true" id="email" v-model="formFields.email" />
                    </div>

                    <div class="flex flex-col">
                        <label class="form-label">First Name</label>
                        <InputText :fluid="true" placeholder="First Name" id="firstname"
                            v-model="formFields.firstname" />
                    </div>

                    <div class="flex flex-col">
                        <label class="form-label">Last Name</label>
                        <InputText :fluid="true" placeholder="Last Name" id="lastname" v-model="formFields.lastname" />
                    </div>

                    <div class="flex flex-col">
                        <label class="form-label">Message</label>
                        <Textarea id="over_label" :fluid="true" rows="8" v-model="formFields.message" />
                    </div>
                </form>

                <div class="flex items-center mt-3 gap-2">
                    <Button type="button" label="Cancel" severity="warn" icon="pi pi-times" @click="closeDrawer" />
                </div>

            </div>
        </Dialog>
        <!-- 
        <Drawer v-model:visible="visible" header="USER FORM" class="w-30rem" position="right">
            
        </Drawer> -->
        <div class="flex flex-col table-section">
            <!-- <Button class="add-user" @click="openDrawer">Add User</Button> -->
            <div class="card">
                <DataTable datakey="id" :value="users" paginator :rows="20" :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="width: 100%"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" ref="datatable" :filters="filters"
                    :paginator="true">
                    <template #header>
                        <div class="header-table">
                            <span class="table-title">List Emails</span>
                            <div class="table-actions gap-2">

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
                    </Column>
                    <Column header="Actions">
                        <template #body="{ data }">
                            <div class="actions">
                                <Button icon="pi pi-eye" aria-label="Update" @click="viewRow(data)" rounded />
                            </div>

                            <!-- <Button class="table-button" severity="secondary" icon="pi pi-trash"
                                @click="deleteRow(data)" rounded></Button>
                            <Button class="table-button" icon="pi pi-pencil" @click="editRow(data)" severity="secondary"
                                rounded></Button> -->
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

/* 
.add-user {
    width: 100px;
    height: 40px;
    margin-bottom: 20px;
} */

.table-section {
    padding: 20px;
}

/* 
.table-button {
    margin-right: 10px;
} */

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

:deep(.p-datatable-tbody tr) {
    height: 90px !important;
}

:deep(.p-datatable-tbody tr td:nth-child(4)) {
    height: 90px !important;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 100%;
}
</style>