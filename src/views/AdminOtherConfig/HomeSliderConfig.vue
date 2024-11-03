<script setup>
import { DeckFirestore } from '@/lib/Deck';
import { OtherConfigFirestore } from '@/lib/OtherConfig';
import { FilterMatchMode } from '@primevue/core';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import Button from 'primevue/button';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Toast from 'primevue/toast';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import _ from 'lodash';
import { ExportData } from '@/lib/Export';

const tableColumns = [
    {
        field: 'image',
        label: 'Image',
        styles: {

        }
    },
    {
        field: 'banner_title',
        label: 'Line 1',
        styles: {

        }
    },
    {
        field: 'banner_description',
        label: 'Line 2',
        styles: {

        }
    },
    {
        field: 'background_color',
        label: 'Background Color',
        styles: {

        }
    },
    {
        field: 'order',
        label: 'Order',
        styles: {
            textAlign: 'center'
        }
    }
];

const rules = computed(() => {
    return {
        banner_title: {
            required,
        },
        banner_description: {
            required,
        },
    };
});

const imageRule = computed(() => {
    return {
        imagePreviewer: {
            required
        }
    };
});

/* REF DEFINITION START */
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const datatable = ref();
const homeSliders = ref([]);
const decks = ref([]);
const visible = ref();
const edit = ref();
const formFields = reactive({
    id: '',
    banner_title: '',
    banner_description: '',
    background_color: '',
    view_deck_url: '',
    image_link: '',
    image_name: '',
    image_name_id: '',
    order: 0
});
const imagePreviewer = ref(null);
const image = ref(null);
/* REF DEFINITION END */

const v$ = useVuelidate(rules, formFields);
const imageV$ = useVuelidate(imageRule, { imagePreviewer });
const toast = useToast();
const confirm = useConfirm();

/* FUNCTIONS START */
const openModal = () => {
    visible.value = true;
    edit.value = false;
};
const closeModal = () => {
    visible.value = false;
    edit.value = false;
};
const getSliderFormData = () => {
    const sliderForm = {};
    Object.keys(formFields).forEach(key => {
        sliderForm[key] = formFields[key];
    });
    sliderForm.updated = Timestamp.now().toDate();
    sliderForm.updated_by = getAuth().currentUser.email;
    if (!edit.value) {
        sliderForm.created = Timestamp.now().toDate();
        sliderForm.created_by = getAuth().currentUser.email;
    }
    const imageFile = image.value.files;
    sliderForm.image = {};
    if (imageFile.length != 0) {
        sliderForm.image.image_data = imageFile[0];
        sliderForm.image.image_name = imageFile[0].name;
        sliderForm.image.image_name_id = `RandomID-${Math.floor(Math.random() * 100)}_${new Date().toTimeString()}_${imageFile[0].name}`;
    }
    return sliderForm;
};
const deleteRow = (data) => {
    confirm.require({
        message: 'Do you want to delete this slider ?',
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
            emits('setLoading', true);
            const result = await OtherConfigFirestore.deleteSlider(data.id, data.image_name_id);
            emits('setLoading', false);
            toast.add({
                summary: 'System Message',
                severity: result.status,
                detail: result.message,
                life: 3000 // 3s
            });
            homeSliders.value = await getHomeSliders();
        },
        reject: () => {

        }
    });
};
const resetFormData = () => {
    formFields.id = '';
    formFields.background_color = "";
    formFields.banner_description = "";
    formFields.banner_title = "";
    formFields.view_deck_url = "";
    formFields.image_link = "";
    formFields.image_name = "";
    formFields.image_name_id = "";
    formFields.order = 0;
    imagePreviewer.value = null;
};
const editRow = (data) => {
    formFields.id = data.id;
    formFields.banner_title = data.banner_title;
    formFields.banner_description = data.banner_description;
    formFields.background_color = data.background_color;
    formFields.view_deck_url = data.view_deck_url;
    formFields.image_link = data.image;
    formFields.image_name = data.image_name;
    formFields.image_name_id = data.image_name_id;

    formFields.order = data.order;
    imagePreviewer.value = data.image;

    visible.value = true;
    edit.value = true;
};
const submitForm = async () => {
    const isValid = await v$.value.$validate();
    const imageValid = await imageV$.value.$validate();
    if (isValid && imageValid) {
        emits('setLoading', true);
        let result = {};
        const formData = getSliderFormData();
        console.log(formData, "FORM DATA");
        if (edit.value) {
            result = await OtherConfigFirestore.updateSlider(formData);
        } else {
            result = await OtherConfigFirestore.addSliders(formData);
        }
        toast.add({
            summary: 'System Message',
            severity: result.status,
            detail: result.message,
            life: 3000 // 3s
        });
        if (result.status === 'success') {
            resetFormData();
            visible.value = false;
            // categories.value = await getCategories();
        }
        homeSliders.value = await getHomeSliders();
        emits('setLoading', false);
    }
};
const getHomeSliders = async () => {
    const sliderList = [];
    (await OtherConfigFirestore.getHomeSliders()).forEach(slider => {
        const data = slider.data();
        const object = {
            id: slider.id,
            image: data.image,
            image_name: data.image_name,
            image_name_id: data.image_name_id,
            banner_title: data.banner_title,
            banner_description: data.banner_description,
            view_deck_url: data.view_deck_url || "",
            order: data.order,
            background_color: data.background_color,
            created: data.created ? data.created.toDate().toLocaleString() : '',
            created_by: data.created_by || '',
            updated: data.updated ? data.updated.toDate().toLocaleString() : '',
            updated_by: data.updated_by || ''
        };
        sliderList.push(object);
    });
    return sliderList;
};
const getDecks = async () => {
    const deckList = [];
    (await DeckFirestore.getDecks()).forEach(deck => {
        const data = deck.data();
        deckList.push({
            name: data.title,
            id: deck.id
        });
    });
    return deckList;
}
const onFileSelected = (event) => {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
        imagePreviewer.value = e.target.result;
    };

    reader.readAsDataURL(file);
};
const exportMyList = (event) => {
    ExportData.exportMyListAsExcel(homeSliders.value, "home_slider");
};
/* FUNCTIONS END */

onMounted(async () => {
    homeSliders.value = await getHomeSliders();
    decks.value = await getDecks();
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
    <ConfirmDialog />
    <Dialog v-model:visible="visible" modal :header='formFields.id ? formFields.id : "New Slider"'
        :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="form-container">
            <form>
                <div class="flex flex-col" v-if="edit">
                    <label class="form-label" for="id">ID</label>
                    <InputText readonly :fluid="true" id="id" v-model="formFields.id" maxLength="150" />
                </div>

                <div class="flex flex-col">
                    <label class="form-label" for="banner_title">Image<span class="required-icon">*</span></label>
                    <img draggable="false" v-if="imagePreviewer" :src="imagePreviewer" alt="Image" width="64"
                        height="64" style="object-fit: contain;" />
                    <FileUpload @select="onFileSelected" ref="image" mode="basic" name="image[]" :maxFileSize="1000000"
                        accept="image/*" />
                    <small class="error-messages" v-if="imageV$.imagePreviewer.$errors.length > 0">{{
                        imageV$.imagePreviewer.$errors[0].$message }}</small>
                </div>

                <div class="flex flex-col">
                    <label class="form-label" for="banner_title">Line 1<span class="required-icon">*</span></label>
                    <InputText :fluid="true" placeholder="Line 1" id="banner_title" v-model="formFields.banner_title"
                        :invalid="v$.banner_title.$errors.length > 0" maxLength="150" />
                    <small class="error-messages" v-if="v$.banner_title.$errors.length > 0">{{
                        v$.banner_title.$errors[0].$message }}</small>
                </div>

                <div class="flex flex-col">
                    <label class="form-label" for="banner_description">Line 2<span
                            class="required-icon">*</span></label>
                    <InputText :fluid="true" placeholder="Line 2" id="banner_description"
                        v-model="formFields.banner_description" :invalid="v$.banner_description.$errors.length > 0"
                        maxLength="150" />
                    <small class="error-messages" v-if="v$.banner_description.$errors.length > 0">{{
                        v$.banner_description.$errors[0].$message }}</small>
                </div>

                <div class="flex flex-col">
                    <label class="form-label" for="view_deck_url">View Deck URL</label>
                    <!-- <Select id="deck_id" v-model="selectedDeck" :options="decks" showClear optionLabel="name" optionValue="id"/> -->
                    <InputText :fluid="true" v-model="formFields.view_deck_url" maxLength="150" />
                </div>

                <div class="flex flex-col">
                    <label class="form-label" for="background_color">Background Color</label>
                    <div class="flex items-center">
                        <!-- <ColorPicker id="background_color" v-model="formFields.background_color"/> -->
                        <InputText :fluid="true" v-model="formFields.background_color" maxLength="150" />
                    </div>
                </div>

                <div class="flex flex-col">
                    <label class="form-label" for="order">Order</label>
                    <InputNumber id="order" inputId="order" :min="0" :max="1000" v-model="formFields.order"
                        mode="decimal" :fluid="false" />
                </div>
            </form>

            <div class="flex items-center mt-3 gap-2">
                <Button type="button" label="Save" icon="pi pi-save" @click="submitForm" />
                <Button type="button" label="Cancel" severity="warn" icon="pi pi-times" @click="closeModal" />
            </div>

        </div>
    </Dialog>
    <DataTable datakey="id" :value="homeSliders" paginator :rows="20" :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="width: 100%"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="{first} to {last} of {totalRecords}" ref="datatable" :filters="filters"
        :paginator="true">
        <template #header>
            <div class="header-table">
                <span class="table-title">Manage Home Slider</span>
                <div class="table-actions gap-2">
                    <div>
                        <Button severity="secondary" type="button" label="Export" icon="pi pi-external-link" @click="exportMyList($event)" />
                    </div>
                    <div>
                        <Button type="button" label="Add" icon="pi pi-plus" @click="openModal" />
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
                <img draggable="false" :src="slotProps.data[column.field]" v-if="column.field === 'image'" width="64" />
                <p v-else>{{ slotProps.data[column.field] }}</p>
            </template>
        </Column>
        <Column header="Actions">
            <template #body="{ data }">
                <div class="actions">
                    <Button icon="pi pi-trash" aria-label="Delete" @click="deleteRow(data)" rounded severity="warn" />
                    <Button icon="pi pi-pencil" aria-label="Update" rounded @click="editRow(data)" />
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

/* FILE UPLOAD CSS START */
:deep(.p-fileupload-basic) {
    margin-top: 10px;
    justify-content: unset;
}

/* FILE UPLOAD CSS END */

.items-center {
    align-items: center;
}
</style>