<script setup>

import { collection, getDocs, orderBy, query } from "firebase/firestore";
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
import { onMounted, reactive, ref, watch } from "vue";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Tag from 'primevue/tag';
import { ExportData } from "@/lib/Export";

const visible = ref(false);
const formFields = reactive({
    email: '',
    receiver: '',
    firstname: '',
    lastname: '',
    subject: '',
    created: '',
    status: '',
    message: ''
});

const tableColumns = [
    {
        field: 'created',
        label: 'Created On',
        styles: {
            width: "15%"
        },
        rowStyle: {}
    },
    {
        field: 'email',
        label: 'Email',
        styles: {
            width: "20%",
            wordWrap: "break-word",
        },
        rowStyle: {}
    },
    {
        field: 'first_name',
        label: 'First Name',
        styles: {
            width: "10%"
        },
        rowStyle: {}
    },
    {
        field: 'last_name',
        label: 'Last Name',
        styles: {
            width: "10%"
        },
        rowStyle: {}
    },
    {
        field: 'message',
        label: 'Message',
        styles: {
            // width: "25%"
        },
        rowStyle: {
            width: "500px",
            maxHeight: "90px",
            overflow: "hidden",
            display: "-webkit-box",
            webkitLineClamp: 3,
            webkitBoxOrient: "vertical",
        }
    },
    {
        field: 'status',
        label: 'Status',
        styles: {
            width: "10%"
        },
        rowStyle: {}
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
};

const getEmails = async () => {
    const emailList = [];
    const docQuery = query(collection(db, 'mail'), orderBy("delivery.startTime", "desc"));
    const querySnapshot = await getDocs(docQuery);
    querySnapshot.forEach(mail => {
        const data = mail.data();
        const object = {
            email: data.message.email || '',
            first_name: data.message.firstName || '',
            last_name: data.message.lastName || '',
            subject: data.message.subject || '',
            message: data.message.html.replaceAll('<br/>', '\n') || '',
            receiver: data.to || '',
            status: data.delivery.state || '',
            created: data.delivery.startTime ? data.delivery.startTime.toDate().toLocaleString() : '',
        };
        emailList.push(object);
    });
    return emailList;
};
const exportMyList = (event) => {
    ExportData.exportMyListAsExcel(users.value, "email_received");
}

const viewRow = (data) => {
    formFields.email = data.email;
    formFields.receiver = data.receiver;
    formFields.firstname = data.first_name;
    formFields.lastname = data.last_name;
    formFields.subject = data.subject;
    formFields.created = data.created;
    formFields.status = data.status;
    formFields.message = data.message.replaceAll('<br/>', '\n');
    visible.value = true;
    view.value = true;
};
/* FUNCTIONS */

/* VUE EVENTS */
onMounted(async () => {
    users.value = await getEmails();
});
watch(visible, () => {
    if (!visible.value) {
        resetFormData();
    }
});
</script>
<template>
    <Toast />
    <div class="">
        <!-- <Button label="Show" @click="visible = true" /> -->

        <Dialog v-model:visible="visible" modal :header='"Preview email"' :style="{ width: '50vw' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <div class="form-container">
                <div class="form-container">
                    <div class="flex">
                        <div class="flex-1 p-2">
                            <label class="form-label">From</label>
                            <InputText :readonly="view" :fluid="true" id="email" v-model="formFields.email" />
                        </div>

                        <div class="flex-1 p-2">
                            <label class="form-label">To</label>
                            <InputText :readonly="view" :fluid="true" v-model="formFields.receiver" />
                        </div>
                    </div>
                    <div class="flex">
                        <div class="flex-1 p-2">
                            <label class="form-label">First Name</label>
                            <InputText :readonly="view" :fluid="true" v-model="formFields.firstname" />
                        </div>

                        <div class="flex-1 p-2">
                            <label class="form-label">Last Name</label>
                            <InputText :readonly="view" :fluid="true" v-model="formFields.lastname" />
                        </div>
                    </div>
                    <div class="flex">
                        <div class="flex-1 p-2">
                            <label class="form-label">Created on</label>
                            <InputText :readonly="view" :fluid="true" v-model="formFields.created" />
                        </div>

                        <div class="flex-1 p-2">
                            <div class="flex-col">
                                <label class="form-label">Status</label>
                            </div>
                            <div class="flex-col mt-1">
                                <div v-if="formFields.status == 'SUCCESS'">
                                    <Tag severity="success" :value="formFields.status" :fluid="true"></Tag>
                                </div>
                                <div v-else>
                                    <Tag severity="danger" :value="formFields.status" :fluid="true"></Tag>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col p-2">
                        <label class="form-label">Subject</label>
                        <InputText :readonly="view" v-model="formFields.subject" />
                    </div>
                    <div class="flex-1 p-2">
                        <label class="form-label">Message</label>
                        <Textarea :readonly="view" id="over_label" :fluid="true" rows="8"
                            v-model="formFields.message" />
                    </div>
                </div>

                <div class="flex items-center mt-3 gap-2">
                    <Button type="button" label="Cancel" severity="warn" icon="pi pi-times" @click="closeDrawer" />
                </div>

            </div>
        </Dialog>
        <!-- 
        <Drawer v-model:visible="visible" header="USER FORM" class="w-30rem" position="right">
            
        </Drawer> -->
        <div class="flex flex-col table-section min-height-750">
            <!-- <Button class="add-user" @click="openDrawer">Add User</Button> -->
            <div class="card">
                <DataTable datakey="id" :value="users" paginator :rows="20" :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="width: 100%"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" ref="datatable" :filters="filters"
                    :paginator="true" export-filename="email_received">
                    <template #header>
                        <div class="header-table">
                            <span class="table-title">Received Messages</span>
                            <div class="table-actions gap-2">
                                <div>
                                    <Button severity="secondary" type="button" label="Export" icon="pi pi-external-link"
                                        @click="exportMyList($event)" />
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
                            <p :style="{ ...column.rowStyle }">{{ slotProps.data[column.field] }}</p>
                        </template>
                    </Column>
                    <Column header="Actions" style="width: 5%;">
                        <template #body="{ data }">
                            <div class="actions">
                                <Button icon="pi pi-eye" aria-label="Update" @click="viewRow(data)" rounded />
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

/* :deep(.p-datatable-tbody tr) {
    height: 90px !important;
}

:deep(.p-datatable-tbody tr td:nth-child(5)) {
    height: 90px !important;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
} */
</style>