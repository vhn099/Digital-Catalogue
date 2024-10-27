<template>
    <div class="flex flex-col table-section min-height-1000">
        <div class="card">
            <DataTable v-model:expandedRowGroups="expandedRowGroups" :value='isUser ? fav_user : fav_deck'
                tableStyle="min-width: 50rem" expandableRowGroups rowGroupMode="subheader"
                groupRowsBy="representative.name" @rowgroup-expand="onRowGroupExpand"
                @rowgroup-collapse="onRowGroupCollapse" sortMode="single" sortField="representative.name" :sortOrder="1"
                paginator :rows="50" :rowsPerPageOptions="[5, 20, 50, 100]">
                <template #header>
                    <div class="header-table">
                        <span class="table-title">Manage User Favorite</span>
                        <div class="table-actions gap-2">
                            <div>
                                <Button type="button" label="Switch view" icon="pi pi-plus" @click="switchView"/>
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
                <template #groupheader="slotProps">
                    <img :alt="slotProps.data.representative.name" :src="`${slotProps.data.representative.image}`"
                        width="32" style="vertical-align: middle" class="ml-2" />
                    <span class="align-middle ml-2 font-bold leading-normal">{{ slotProps.data.representative.name
                        }}</span>
                </template>
                <Column field="representative.name" header="Representative"></Column>
                <Column field="deck_highlight" header="Deck Highlight" style="width: 20%" v-if="isUser">
                    <template #body="slotProps">
                        <div class="flex items-center gap-2">
                            <img alt="flag" :src="`${slotProps.data.deck_highlight}`" class="flag flag"
                                style="width: 200px" />
                            <!-- <span>{{ slotProps.data.country.name }}</span> -->
                        </div>
                    </template>
                </Column>
                <Column field="firstname" header="First Name" style="width: 20%" v-if="!isUser"></Column>
                <Column :field='isUser ? "title" : "lastname"' :header='isUser ? "Title" : "Last Name"'
                    style="width: 20%"></Column>

                <Column :field='isUser ? "category" : "email"' :header='isUser ? "Category" : "Email"'
                    style="width: 20%"></Column>
                <Column field="detail_description" header="Detail Description" style="width: 20%" v-if="isUser">
                </Column>
                <Column field="status" header="User Status" style="width: 20%" v-if="!isUser">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" />
                    </template>
                </Column>
                <Column field="date" header="Date" style="width: 20%"></Column>
                <template #groupfooter="slotProps">
                    <div class="flex justify-end font-bold w-full">Total: {{ isUser ?
                        calculateUserTotal(slotProps.data.representative.name) :
                        calculateDeckTotal(slotProps.data.representative.name)}}</div>
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
import { FavoriteFirestore } from "@/lib/Favorite";
import ProfileIcon from '@/assets/img/icon/profile.png';
import Button from 'primevue/button';

onMounted(() => {
    getAllFavorites_Deck();
    getAllFavorites_User();
});
// fist name , last name , email, status, date
// Deck Highlight, Title, Detail Description , Category, Date
const fav_user = ref([]);
const fav_deck = ref([]);
const expandedRowGroups = ref();
const isUser = ref(true);
// const toast = useToast();
const onRowGroupExpand = (event) => {
    //toast.add({ severity: 'info', summary: 'Row Group Expanded', detail: 'Value: ' + event.data, life: 3000 });
};
const onRowGroupCollapse = (event) => {
    //toast.add({ severity: 'success', summary: 'Row Group Collapsed', detail: 'Value: ' + event.data, life: 3000 });
};
const calculateUserTotal = (name) => {
    let total = 0;

    if (fav_user.value) {
        for (let fav of fav_user.value) {
            if (fav.representative.name === name) {
                total++;
            }
        }
    }

    return total;
};
const calculateDeckTotal = (name) => {
    let total = 0;

    if (fav_deck.value) {
        for (let fav of fav_deck.value) {
            if (fav.representative.name === name) {
                total++;
            }
        }
    }

    return total;
};
const getSeverity = (status) => {
    switch (status) {
        case 'Deactive':
            return 'danger';

        case 'Active':
            return 'success';

        case 'new':
            return 'info';

        case 'negotiation':
            return 'warn';

        case 'renewal':
            return null;
    }
};

const switchView = () => {
    isUser.value = !isUser.value;
};


const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const getAllFavorites_User = async () => {
    const favSnapshot = await FavoriteFirestore.getFavorites();
    const promises = favSnapshot.map(async (fav) => {
        const data = fav.data();
        const userName = await UserFirestore.getUserName(data.userID);
        const deck = await DeckFirestore.getDeck(data.deckID);
        if (deck) {
            const category_name = await CategoryFirestore.getCategoryName(deck.category_id);
            const obj = {
                id: fav.id,
                deck_highlight: deck.deck_highlight || '',
                title: deck.title || '',
                detail_description: deck.detail_description || '',
                category: category_name || '',
                date: data.created ? data.created.toDate().toLocaleString() : '',
                representative: {
                    name: userName || '',
                    image: ProfileIcon
                },
            }
            fav_user.value.push(obj);
        }
    });
};
const getAllFavorites_Deck = async () => {
    const favSnapshot = await FavoriteFirestore.getFavorites();
    const promises = favSnapshot.map(async (fav) => {
        const data = fav.data();
        const user = await UserFirestore.getUser(data.userID);
        const deck = await DeckFirestore.getDeck(data.deckID);
        //const category_name = await CategoryFirestore.getCategoryName(deck.category_id);
        console.log(user.disabled);
        const obj = {
            // fist name , last name , email, status, date
            id: fav.id,
            status: user.disabled === false ? 'Active' : 'Deactive',
            firstname: user.firstname || '',
            lastname: user.lastname || '',
            email: data.userID || '',
            date: data.created ? data.created.toDate().toLocaleString() : '',
            representative: {
                name: deck.title,
                image: deck.deck_highlight || ''
            },
        }
        return obj;
    });
    const results = await Promise.all(promises);
    fav_deck.value = results;
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