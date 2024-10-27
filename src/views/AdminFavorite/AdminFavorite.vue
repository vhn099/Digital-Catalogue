<!-- <script setup>
import { FilterMatchMode } from '@primevue/core';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';

const tableColumns = [
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
];

const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

</script>

<template>
    <div class="">
        <div class="flex flex-col table-section min-height-750">
            <div class="card">
                <DataTable datakey="id" paginator :rows="20" :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="width: 100%"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" ref="datatable" :filters="filters"
                    :paginator="true">
                    <template #header>
                        <div class="header-table">
                            <span class="table-title">Manage User Favorite</span>
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
                        <template #body="slotProps">
                            <p >{{ slotProps.data[column.field] }}</p>
                        </template>
                    </Column>
                    <Column header="Actions">
                        <template #body="{ data }">
                            <div class="actions">
                                <Button icon="pi pi-trash" aria-label="Delete" rounded
                                    severity="warn" />
                                <Button icon="pi pi-pencil" aria-label="Update" rounded />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* TABLE CSS START */
.table-section {
    padding: 20px;
}

.flex-col {
    flex-direction: column;
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
</style> -->

<template>
    <div class="flex flex-col table-section min-height-1000">
        <div class="card">
            <DataTable v-model:expandedRowGroups="expandedRowGroups" :value="customers" tableStyle="min-width: 50rem"
                expandableRowGroups rowGroupMode="subheader" groupRowsBy="representative.name"
                @rowgroup-expand="onRowGroupExpand" @rowgroup-collapse="onRowGroupCollapse" sortMode="single"
                sortField="representative.name" :sortOrder="1" paginator :rows="50"
                :rowsPerPageOptions="[5, 20, 50, 100]">
                <template #header>
                    <div class="header-table">
                        <span class="table-title">Manage User Favorite</span>
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
                <template #groupheader="slotProps">
                    <img :alt="slotProps.data.representative.name"
                        :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.data.representative.image}`"
                        width="32" style="vertical-align: middle" class="ml-2" />
                    <span class="align-middle ml-2 font-bold leading-normal">{{ slotProps.data.representative.name
                        }}</span>
                </template>
                <Column field="representative.name" header="Representative"></Column>
                <Column field="deck_highlight" header="Deck Highlight" style="width: 20%">
                    <template #body="slotProps">
                        <div class="flex items-center gap-2">
                            <img alt="flag" src="https://firebasestorage.googleapis.com/v0/b/digital-catalogue-15dcb.appspot.com/o/deck%2Fimages%2F43_CAP.png_Fri%20Oct%2025%202024?alt=media&token=f74a735b-b7f5-4d5e-82fd-48996ee4b18a"
                                class="flag flag" style="width: 200px" />
                            <!-- <span>{{ slotProps.data.country.name }}</span> -->
                        </div>
                    </template>
                </Column>
                <Column field="title" header="Title" style="width: 20%"></Column>
                
                <Column field="category" header="Category" style="width: 20%"></Column>
                <Column field="detail_description" header="Detail Description" style="width: 20%"></Column>
                <!-- <Column field="status" header="Status" style="width: 20%">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" />
                    </template>
                </Column> -->
                <Column field="date" header="Date" style="width: 20%"></Column>
                <template #groupfooter="slotProps">
                    <div class="flex justify-end font-bold w-full">Total Customers: {{
                        calculateCustomerTotal(slotProps.data.representative.name) }}</div>
                </template>
            </DataTable>
            <!-- <Toast /> -->
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
//import Toast from 'primevue/toast';
import Tag from 'primevue/tag';
import Column from 'primevue/column';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import { FilterMatchMode } from '@primevue/core';
import { DeckFirestore } from '@/lib/Deck';
import { CategoryFirestore } from '@/lib/Category';
import { UserFirestore } from "@/lib/User";

onMounted(() => {
    for (var i = 0; i < 20; i++) {
        // customers.value.push({
        //     id: 1000,
        //     firstname: 'James Butt',
        //     lastname: 'Benton, John B Jr',
        //     email: '2015-09-13',
        //     status: true,
        //     date: '2015-09-13',
        //     representative: {
        //         name: 'Ioni Bowcher ',
        //         image: 'ionibowcher.png'
        //     },
        // });
        customers.value.push({
            id: "xxx",
            title: 'Quang',
            detail_description: 'You can use Firebase Auth to send and process account management emails and SMS messages. These messages allow your users to complete the following account management tasks:',
            date: '2015-09-13',
            deck_highlight: 'unqualified',
            category: true,
            representative: {
                name: 'Tran Quang',
                image: 'ionibowcher.png'
            },

        });
    }
});
// fist name , last name , email, status, date
// Deck Highlight, Title, Detail Description , Category, Date
const customers = ref([]);
const expandedRowGroups = ref();
// const toast = useToast();
// const onRowGroupExpand = (event) => {
//     //toast.add({ severity: 'info', summary: 'Row Group Expanded', detail: 'Value: ' + event.data, life: 3000 });
// };
// const onRowGroupCollapse = (event) => {
//     //toast.add({ severity: 'success', summary: 'Row Group Collapsed', detail: 'Value: ' + event.data, life: 3000 });
// };
const calculateCustomerTotal = (name) => {
    let total = 0;

    if (customers.value) {
        for (let customer of customers.value) {
            if (customer.representative.name === name) {
                total++;
            }
        }
    }

    return total;
};
const getSeverity = (status) => {
    switch (status) {
        case 'unqualified':
            return 'danger';

        case 'qualified':
            return 'success';

        case 'new':
            return 'info';

        case 'negotiation':
            return 'warn';

        case 'renewal':
            return null;
    }
};

const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const getAllFavorites = async () => {
    const favoriteTable = collection(db, 'favorite');
    //const q = query(favoriteTable, where('userID', '==', email.value));
    try {
        const querySnapshot = await getDocs(favoriteTable);
        querySnapshot.forEach(obj => {
            const data = obj.data();
            const object = {
                favID: obj.id,
                //userID: data.userID || '',
                deckID: data.deckID || '',
            };
            favorites.value.push(object);
        });
        //return favoriteList;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }

};
</script>
<style scoped>
.table-section {
    padding: 20px;
}

.flex-col {
    flex-direction: column;
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
</style>