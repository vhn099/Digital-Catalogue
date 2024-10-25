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
import { DeckFirestore } from "@/lib/Deck";
import { FirebaseStorage } from "@/lib/Storage";
import FileUpload from "primevue/fileupload";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import 'primeicons/primeicons.css';
import InputChips from "primevue/inputchips";

const formFields = reactive({
    id: '',
    title: '',
    detail_description: '',
    category_id: null,
    deck_highlight: '',
    deck_images: [],
    pdf: '',
    tag: [],
});

/* COMPUTED VALUES */
const rules = computed(() => {
    return {
        title: {
            required,
        },
        detail_description: {
            required,
        },
        category_id: {
            required,
        },
        tag: {
            required,
        },
    };
});
/* COMPUTED VALUES */

const tableColumns = [
    {
        field: 'title',
        label: 'Title',
        styles: {

        }
    },
    {
        field: 'detail_description',
        label: 'Detail Description',
        styles: {

        }
    },
    // {
    //     field: 'category_id',
    //     label: 'Category ID',
    //     styles: {
    //         visibility: 'hidden'
    //     }
    // },
    {
        field: 'category_name',
        label: 'Category',
        styles: {

        }
    },
    {
        field: 'deck_highlight',
        label: 'Deck Highlight',
        styles: {

        }
    },
    // {
    //     field: 'deck_images',
    //     label: 'Deck Images',
    //     styles: {
    //         visibility: 'hidden'
    //     }
    // },
    {
        field: 'pdf',
        label: 'PDF',
        styles: {

        }
    },
    {
        field: 'tag',
        label: 'Tags',
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
const decks = ref();
const categoriesSelection = ref();
const edit = ref();
const datatable = ref();
const visible = ref(false);
const deck_highlight = ref(null);
const deck_images = ref(null);
const pdf = ref(null);
const deleteDeckDialog = ref(false);
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const deckHighlightRule = ref(null);
const deckHighlightPreview = ref(null);
const deckImagesRule = ref(null);
const pdfRule = ref(null);
/* REF DEFINITION END*/

const v$ = useVuelidate(rules, formFields);

/* FUNCTIONS */
const resetFormData = () => {
    formFields.id = '';
    formFields.title = '';
    formFields.detail_description = '';
    formFields.category_id = null;
    formFields.tag = '';
    deck_highlight.value = null;
    deckHighlightPreview.value = null;
    deck_images.value = null;
    pdf.value = null;
};
const closeDrawer = () => {
    visible.value = false;
    edit.value = false;
};
const openDrawer = () => { // Used for insert case
    visible.value = true;
    edit.value = false;
};
const getDeckFormData = () => {
    const deckForm = {};
    Object.keys(formFields).forEach(key => {
        deckForm[key] = formFields[key];
    });
    deckForm.updated = Timestamp.now().toDate();
    deckForm.updated_by = getAuth().currentUser.email;
    if (!edit.value) {
        deckForm.created = Timestamp.now().toDate();
        deckForm.created_by = getAuth().currentUser.email;
    }

    return deckForm;
}

const getDecks = async () => {
    const deckList = [];
    const decksSnapshot = await DeckFirestore.getDecks();
    for (const deck of decksSnapshot) {
        const data = deck.data();
        const categoryName = await CategoryFirestore.getCategoryName(data.category_id);
        const object = {
            id: deck.id,
            title: data.title,
            detail_description: data.detail_description,
            category_id: data.category_id,
            category_name: categoryName,
            deck_highlight: data.deck_highlight,
            deck_images: data.deck_images,
            pdf: data.pdf,
            tag: data.tag,
            created: data.created ? data.created.toDate().toLocaleString() : '',
            created_by: data.created_by || '',
            updated: data.updated ? data.updated.toDate().toLocaleString() : '',
            updated_by: data.updated_by || ''
        };
        deckList.push(object);
    }

    return deckList;
};

const getCategories = async () => {
    const categoryList = [];
    (await CategoryFirestore.getCategories()).forEach(category => {
        const data = category.data();
        const object = {
            id: category.id,
            name: data.name,
        };
        categoryList.push(object);
    });

    return categoryList;
};

const submitForm = async () => {
    const isValid = await v$.value.$validate();

    // validate Deck Highlight
    const deckHighlightFile = deck_highlight.value.files;
    if (deckHighlightFile.length === 0) {
        deckHighlightRule.value = "Value is required";
        return false;
    } else {
        deckHighlightRule.value = null;
    }

    // validate Deck Images
    const deckImagesFile = deck_images.value.files;
    if (deckImagesFile.length === 0) {
        deckImagesRule.value = "Value is required";
        return false;
    } else {
        deckImagesRule.value = null;
    }

    // validate Deck Highlight
    const pdfFile = pdf.value.files;
    if (pdfFile.length === 0) {
        pdfRule.value = "Value is required";
        return false;
    } else {
        pdfRule.value = null;
    }

    if (isValid || edit.value) {
        let deckHighlightImage = deckHighlightFile[0];
        let deckHighlightName = `${Math.floor(Math.random() * 60)}_${deckHighlightFile[0].name}_${new Date().toDateString()}`;
        const deckHighlightURL = await FirebaseStorage.uploadFile(deckHighlightName, deckHighlightImage, 'deck/images');

        let deckImagesURLs = [];
        for (let i = 0; i < deckImagesFile.length; i++) {
            let deckImagesImage = deckImagesFile[i];
            let deckImagesName = `${Math.floor(Math.random() * 60)}_${deckImagesFile[i].name}_${new Date().toDateString()}`;
            const deckImagesURL = await FirebaseStorage.uploadFile(deckImagesName, deckImagesImage, 'deck/images');
            deckImagesURLs.push({
                url: deckImagesURL,
                name: deckImagesName,
            })
        }

        let pdfFileUpload = pdfFile[0];
        let pdfFileUploadName = `${Math.floor(Math.random() * 60)}_${pdfFile[0].name}_${new Date().toDateString()}`;
        const pdfFileUploadURL = await FirebaseStorage.uploadFile(pdfFileUploadName, pdfFileUpload, 'deck/pdf');

        const deckFormData = getDeckFormData();
        let categoryID = deckFormData.category_id.id;
        let result = {};
        deckFormData.category_id = categoryID;
        deckFormData.deck_highlight = deckHighlightURL;
        deckFormData.deck_highlight_name = deckHighlightName;
        deckFormData.deck_images = deckImagesURLs;
        deckFormData.pdf = pdfFileUploadURL;
        if (edit.value) {
            result = await DeckFirestore.updateDeck(deckFormData);
        } else {
            result = await DeckFirestore.createDeck(deckFormData);
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
            decks.value = await getDecks();
        }
    } else {

    }
};
const deleteDeck = async () => {
    let result = await DeckFirestore.deleteDeck(formFields.id);
    toast.add({
        summary: 'System Message',
        severity: result.status,
        detail: result.message,
        life: 3000 // 3s
    });
    if (result.status === 'success') {
        visible.value = false;
        decks.value = await getDecks();
    }

    formFields.id = '';
    deleteDeckDialog.value = false;
};
const deleteRow = (data) => {
    formFields.id = data.id;

    deleteDeckDialog.value = true;
};
const editRow = (data) => {
    formFields.id = data.id;
    formFields.title = data.title;
    formFields.detail_description = data.detail_description;
    formFields.category_id = {
        id: data.category_id,
        name: data.category_name,
    };
    deckHighlightPreview.value = data.deck_highlight;
    formFields.deck_images = data.deck_images;
    formFields.pdf = data.pdf;
    formFields.tag = data.tag;

    visible.value = true;
    edit.value = true;
};
const onImageSelected = (event) => {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
        deckHighlightPreview.value = e.target.result;
    };

    reader.readAsDataURL(file);
};
const onAdvancedUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};
const onFileSelected = (event) => { };
/* FUNCTIONS */


onMounted(async () => {
    decks.value = await getDecks();
    categoriesSelection.value = await getCategories();
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
        <Dialog v-model:visible="visible" modal :header='formFields.id ? formFields.id : "New Deck"'
            :style="{ width: '80vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <div class="form-container">
                <form>
                    <div class="flex flex-col" v-if="edit">
                        <label class="form-label" for="id">ID</label>
                        <InputText :readonly="edit" :fluid="true" id="id" v-model="formFields.id" />
                    </div>

                    <!-- Title -->
                    <div class="flex flex-col">
                        <label class="form-label" for="title">Title <span class="required-icon">*</span></label>
                        <InputText :fluid="true" placeholder="Title" id="title" v-model="formFields.title"
                            :invalid="v$.title.$errors.length > 0" />
                        <small class="error-messages" v-if="v$.title.$errors.length > 0">{{
                            v$.title.$errors[0].$message }}</small>
                    </div>

                    <!-- Detail Description -->
                    <div class="flex flex-col">
                        <label class="form-label" for="detail_description">Detail Description <span
                                class="required-icon">*</span></label>
                        <Textarea :fluid="true" placeholder="Detail Description" id="detail_description"
                            v-model="formFields.detail_description"
                            :invalid="v$.detail_description.$errors.length > 0" />
                        <small class="error-messages" v-if="v$.detail_description.$errors.length > 0">{{
                            v$.detail_description.$errors[0].$message }}</small>
                    </div>

                    <!-- Deck Highlight -->
                    <div class="flex flex-col">
                        <label class="form-label" for="deck_highlight">Deck Highlight <span
                                class="required-icon">*</span></label>
                        <img draggable="false" v-if="deckHighlightPreview" :src="deckHighlightPreview" alt="Image"
                            width="64" />
                        <FileUpload @select="onImageSelected" ref="deck_highlight" mode="basic" name="deck_highlight[]"
                            :maxFileSize="1000000" accept="image/*" />
                        <small class="error-messages" v-if="deckHighlightRule" customUpload>{{
                            deckHighlightRule }}</small>
                    </div>

                    <!-- Category -->
                    <div class="flex flex-col">
                        <label class="form-label" for="category_id">Category <span
                                class="required-icon">*</span></label>
                        <Select v-model="formFields.category_id" :options="categoriesSelection" filter showClear
                            optionLabel="name" placeholder="Select a Category" class="w-full md:w-56" id="category_id">
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="flex items-center">
                                    <div>{{ slotProps.value.name }}</div>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                            <template #option="slotProps">
                                <div class="flex items-center">
                                    <div>{{ slotProps.option.name }}</div>
                                </div>
                            </template>
                        </Select>
                        <small class="error-messages" v-if="v$.category_id.$errors.length > 0">{{
                            v$.category_id.$errors[0].$message }}</small>
                    </div>

                    <!-- Deck Images -->
                    <div class="flex flex-col">
                        <label class="form-label" for="deck_images">Deck Images <span
                                class="required-icon">*</span></label>
                        <Toast />
                        <FileUpload name="deck_images[]" url="/api/upload" @upload="onAdvancedUpload($event)"
                            ref="deck_images" :multiple="true" accept="image/*" :maxFileSize="1000000">
                            <template #empty>
                                <span>Drag and drop files to here to upload.</span>
                            </template>
                        </FileUpload>
                        <small class="error-messages" v-if="deckImagesRule" customUpload>{{
                            deckImagesRule }}</small>
                    </div>

                    <!-- PDF -->
                    <div class="flex flex-col">
                        <label class="form-label" for="pdf">PDF <span class="required-icon">*</span></label>
                        <FileUpload @select="onFileSelected" ref="pdf" mode="basic" name="pdf[]" :maxFileSize="1000000"
                            accept="application/pdf" />
                        <small class="error-messages" v-if="pdfRule" customUpload>{{
                            pdfRule }}</small>
                    </div>

                    <!-- Tag -->
                    <div class="flex flex-col">
                        <label class="form-label" for="tag">Tags <span class="required-icon">*</span></label>
                        <InputChips v-model="formFields.tag" :invalid="v$.tag.$errors.length > 0" removable>
                        </InputChips>
                        <small class="error-messages" v-if="v$.tag.$errors.length > 0">{{
                            v$.tag.$errors[0].$message }}</small>
                    </div>
                </form>

                <div class="flex items-center mt-3 gap-2">
                    <Button type="button" label="Save" icon="pi pi-save" @click="submitForm" />
                    <Button type="button" label="Cancel" severity="warn" icon="pi pi-times" @click="closeDrawer" />
                </div>

            </div>
        </Dialog>
        <Dialog v-model:visible="deleteDeckDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span>Are you sure you want to delete ?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteDeckDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteDeck" />
            </template>
        </Dialog>

        <div class="flex flex-col table-section">
            <div class="card">
                <DataTable datakey="id" :value="decks" paginator :rows="20" :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="width: 100%"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" ref="datatable" :filters="filters"
                    :paginator="true">
                    <template #header>
                        <div class="header-table">
                            <span class="table-title">Manage Decks</span>
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
                            <img draggable="false" :src="slotProps.data[column.field]"
                                v-if="column.field === 'deck_highlight'" width="64" />
                            <p v-else-if="column.field === 'pdf'">
                                <span v-if="slotProps.data[column.field]" class="pi pi-file-pdf"></span>
                            </p>
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
.fav-tag {
    background: #999999C7;
    color: white;
    font-size: 17px;
    font-weight: 600;
    margin-right: 5px;
    border-radius: 5px;
}

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