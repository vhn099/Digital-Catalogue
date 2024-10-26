<script setup>
import { OtherConfigFirestore } from '@/lib/OtherConfig';
import { FilterMatchMode } from '@primevue/core';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import Button from 'primevue/button';
import ColorPicker from 'primevue/colorpicker';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import { computed, onMounted, reactive, ref } from 'vue';

const tableColumns = [
    {
        field: 'img',
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
const homeSliders = ref();
const visible = ref();
const edit = ref();
const formFields = reactive({
    id: '',
    banner_title: '',
    banner_description: '',
    background_color: "#ff0000",
    deck_id: '',
    order: 0
});
const imagePreviewer = ref(null);
/* REF DEFINITION END */

const v$ = useVuelidate(rules, formFields);
const imageV$ = useVuelidate(imageRule, { imagePreviewer });

/* FUNCTIONS START */
const openModal = () => {
    visible.value = true;
    edit.value = false;
};
const closeModal = () => {
    visible.value = false;
    edit.value = false;
};
const submitForm = async () => {
    const isValid = await v$.value.$validate();
    const imageValid = await imageV$.value.$validate();
    if (isValid) {
        console.log("WORKED");
    }
};
const getHomeSliders = async () => {
    const sliderList = [];
    (await OtherConfigFirestore.getHomeSliders()).forEach(slider => {
        const data = slider.data();
        const object = {
            id: slider.id,
            image: data.image,
            banner_title: data.banner_title,
            banner_description: data.banner_description,
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
const onFileSelected = (event) => {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
        imagePreviewer.value = e.target.result;
    };

    reader.readAsDataURL(file);
};
/* FUNCTIONS END */

onMounted(async () => {
    homeSliders.value = await getHomeSliders();
});
</script>

<template>
    <Dialog v-model:visible="visible" modal :header='formFields.id ? formFields.id : "New Slider"'
        :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="form-container">
            <form>
                <div class="flex flex-col" v-if="edit">
                    <label class="form-label" for="id">ID</label>
                    <InputText readonly :fluid="true" id="id" v-model="formFields.id" />
                </div>

                <div class="flex flex-col">
                    <label class="form-label" for="banner_title">Image<span class="required-icon">*</span></label>
                    <img draggable="false" v-if="imagePreviewer" :src="imagePreviewer" alt="Image" width="64" />
                    <FileUpload @select="onFileSelected" ref="image" mode="basic" name="image[]" :maxFileSize="1000000"
                        accept="image/*" />
                    <small class="error-messages" v-if="imageV$.imagePreviewer.$errors.length > 0">{{
                        imageV$.imagePreviewer.$errors[0].$message }}</small>
                </div>

                <div class="flex flex-col">
                    <label class="form-label" for="banner_title">Line 1<span class="required-icon">*</span></label>
                    <InputText :readonly="edit" :fluid="true" placeholder="Line 1" id="banner_title"
                        v-model="formFields.banner_title" :invalid="v$.banner_title.$errors.length > 0" />
                    <small class="error-messages" v-if="v$.banner_title.$errors.length > 0">{{
                        v$.banner_title.$errors[0].$message }}</small>
                </div>

                <div class="flex flex-col">
                    <label class="form-label" for="banner_description">Line 2<span
                            class="required-icon">*</span></label>
                    <InputText :fluid="true" placeholder="Line 2" id="banner_description"
                        v-model="formFields.banner_description" :invalid="v$.banner_description.$errors.length > 0"/>
                    <small class="error-messages" v-if="v$.banner_title.$errors.length > 0">{{
                        v$.banner_description.$errors[0].$message }}</small>
                </div>

                <div class="flex flex-col">
                    <label class="form-label" for="background_color">Background Color</label>
                    <ColorPicker id="background_color" v-model="formFields.background_color" />
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
                <p>{{ slotProps.data[column.field] }}</p>
            </template>
        </Column>
        <Column header="Actions">
            <template #body="{ data }">
                <div class="actions">
                    <!-- <Button icon="pi pi-trash" aria-label="Delete" @click="deleteRow(data)" rounded
                                    severity="warn" /> -->
                    <Button icon="pi pi-pencil" aria-label="Update" rounded />
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