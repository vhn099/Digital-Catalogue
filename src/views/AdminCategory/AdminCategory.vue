<script setup>
import useVuelidate from "@vuelidate/core";
import { required, requiredIf } from "@vuelidate/validators";
import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Toast from "primevue/toast";
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from "primevue/usetoast";
import { computed, onMounted, reactive, ref, watch } from "vue";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { CategoryFirestore } from "@/lib/Category";
import { FirebaseStorage } from "@/lib/Storage";
import FileUpload from "primevue/fileupload";

const formFields = reactive({
    id: '',
    name: '',
});

/* COMPUTED VALUES */
const rules = computed(() => {
    return {
        name: {
            required,
        },
    };
});
/* COMPUTED VALUES */

const tableColumns = [
    {
        field: 'name',
        label: 'Name',
        styles: {

        }
    },
    {
        field: 'image',
        label: 'Image',
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
const toast = useToast();

/* REF DEFINITION START */
const categories = ref();
const edit = ref();
const datatable = ref();
const visible = ref(false);
const image = ref(null);
const deleteCategoryDialog = ref(false);
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const imageRule = ref(null);
const imagePreview = ref(null);
/* REF DEFINITION END*/

const v$ = useVuelidate(rules, formFields);

/* FUNCTIONS */
const resetFormData = () => {
    formFields.id = '';
    formFields.name = '';
    image.value = null;
    imagePreview.value = null;
};
const closeDrawer = () => {
    visible.value = false;
    edit.value = false;
};
const openDrawer = () => { // Used for insert case
    visible.value = true;
    edit.value = false;
};
const getCategoryFormData = () => {
    const categoryForm = {};
    Object.keys(formFields).forEach(key => {
        categoryForm[key] = formFields[key];
    });
    categoryForm.updated = Timestamp.now().toDate();
    categoryForm.updated_by = getAuth().currentUser.email;
    if (!edit.value) {
        categoryForm.created = Timestamp.now().toDate();
        categoryForm.created_by = getAuth().currentUser.email;
    }

    return categoryForm;
}

const getCategories = async () => {
    const categoryList = [];
    (await CategoryFirestore.getCategories()).forEach(category => {
        const data = category.data();
        // console.log('PN TEST', data);
        const object = {
            id: category.id,
            name: data.name,
            image: data.image,
            created: data.created ? data.created.toDate().toLocaleString() : '',
            created_by: data.created_by || '',
            updated: data.updated ? data.updated.toDate().toLocaleString() : '',
            updated_by: data.updated_by || ''
        };
        categoryList.push(object);
    });

    return categoryList;
};

const submitForm = async () => {
    const isValid = await v$.value.$validate();
    const imageFile = image.value.files;
    if (imageFile.length === 0) {
        imageRule.value = "Value is required";
        return false;
    } else {
        imageRule.value = null;
    }


    if (isValid || edit.value) {
        let imageData = imageFile[0];
        let imageName = `${Math.floor(Math.random() * 60)}_${imageFile[0].name}_${new Date().toDateString()}`;
        const categoryFormData = getCategoryFormData();
        let result = {};
        const downloadURL = await FirebaseStorage.uploadFile(imageName, imageData);
        categoryFormData.image = downloadURL;
        categoryFormData.image_name = imageName;
        if (edit.value) {
            result = await CategoryFirestore.updateCategory(categoryFormData);
        } else {
            result = await CategoryFirestore.createCategory(categoryFormData);
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
            categories.value = await getCategories();
        }
    } else {

    }
};
const deleteCategory = async () => {
    let result = await CategoryFirestore.deleteCategory(formFields.id);
    toast.add({
        summary: 'System Message',
        severity: result.status,
        detail: result.message,
        life: 3000 // 3s
    });
    if (result.status === 'success') {
        visible.value = false;
        categories.value = await getCategories();
    }

    formFields.id = '';
    deleteCategoryDialog.value = false;
};
const deleteRow = (data) => {
    formFields.id = data.id;

    deleteCategoryDialog.value = true;
};
const editRow = (data) => {
    formFields.id = data.id;
    formFields.name = data.name;
    imagePreview.value = data.image;

    visible.value = true;
    edit.value = true;
};
const onFileSelected = (event) => {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
        imagePreview.value = e.target.result;
    };

    reader.readAsDataURL(file);
};
/* FUNCTIONS */


onMounted(async () => {
    categories.value = await getCategories();
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
        <Dialog v-model:visible="visible" modal :header='formFields.id ? formFields.id : "New Category"'
            :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <div class="form-container">
                <form>
                    <div class="flex flex-col" v-if="edit">
                        <label class="form-label" for="id">ID</label>
                        <InputText :readonly="edit" :fluid="true" id="id" v-model="formFields.id" />
                    </div>

                    <div class="flex flex-col">
                        <label class="form-label" for="name">Name <span class="required-icon">*</span></label>
                        <InputText :fluid="true" placeholder="Name" id="name" v-model="formFields.name"
                            :invalid="v$.name.$errors.length > 0" />
                        <small class="error-messages" v-if="v$.name.$errors.length > 0">{{
                            v$.name.$errors[0].$message }}</small>
                    </div>

                    <div class="flex flex-col">
                        <label class="form-label" for="image">Image <span class="required-icon">*</span></label>
                        <img draggable="false" v-if="imagePreview" :src="imagePreview" alt="Image" width="64"/>
                        <FileUpload @select="onFileSelected" ref="image" mode="basic" name="image[]" :maxFileSize="1000000" accept="image/*" />
                        <small class="error-messages" v-if="imageRule" customUpload>{{
                            imageRule }}</small>
                    </div>
                </form>

                <div class="flex items-center mt-3 gap-2">
                    <Button type="button" label="Save" icon="pi pi-save" @click="submitForm" />
                    <Button type="button" label="Cancel" severity="warn" icon="pi pi-times" @click="closeDrawer" />
                </div>

            </div>
        </Dialog>
        <Dialog v-model:visible="deleteCategoryDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span>Are you sure you want to delete ?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteCategoryDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteCategory" />
            </template>
        </Dialog>

        <div class="flex flex-col table-section">
            <div class="card">
                <DataTable datakey="id" :value="categories" paginator :rows="20" :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="width: 100%"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" ref="datatable" :filters="filters"
                    :paginator="true">
                    <template #header>
                        <div class="header-table">
                            <span class="table-title">Manage Categories</span>
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
                            <img draggable="false" :src="slotProps.data[column.field]" v-if="column.field === 'image'" width="64" />
                            <p v-else>{{ slotProps.data[column.field] }}</p>
                        </template>
                    </Column>
                    <Column header="Actions">
                        <template #body="{ data }">
                            <div class="actions">
                                <Button icon="pi pi-trash" aria-label="Delete" @click="deleteRow(data)" rounded
                                    severity="warn" />
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

/* FILE UPLOAD CSS START */
:deep(.p-fileupload-basic) {
    margin-top: 10px;
    justify-content: unset;
}

/* FILE UPLOAD CSS END */

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
</style>