<script setup>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
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
import { computed, onMounted, reactive, ref, useTemplateRef, watch } from "vue";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { CategoryFirestore } from "@/lib/Category";
import { DeckFirestore } from "@/lib/Deck";
import FileUpload from "primevue/fileupload";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import 'primeicons/primeicons.css';
import InputChips from "primevue/inputchips";
import _ from 'lodash';
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import DatePicker from "primevue/datepicker";
import moment from "moment";
import { ExportData } from "@/lib/Export";

const formFields = reactive({
    id: '',
    title: '',
    detail_description: '',
    category_id: null,
    deck_highlight: '',
    deck_highlight_name: '',
    deck_highlight_name_id: '',
    deck_images: [],
    pdf: '',
    pdf_name: '',
    pdf_name_id: '',
    tag: [],
    catalogue_edition: '',
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
        catalogue_edition: {
            required,
        },
    };
});
const imageHighlightRule = computed(() => {
    return {
        deckHighlightPreview: {
            required
        }
    };
});
const subImagesRule = computed(() => {
    return {
        deck_images: {
            required
        }
    };
});
const pdfFileRule = computed(() => {
    return {
        pdfFile: {
            required
        }
    }
});
/* COMPUTED VALUES */

const tableColumns = [
    {
        field: 'title',
        label: 'Title',
        styles: {},
        rowStyle: {
            width: "300px",
            maxHeight: "90px",
            overflow: "hidden",
            display: "-webkit-box",
            webkitLineClamp: 3,
            webkitBoxOrient: "vertical",
        }
    },
    {
        field: 'detail_description',
        label: 'Detail Description',
        styles: {
            
        },
        rowStyle: {
            width: "300px",
            maxHeight: "90px",
            overflow: "hidden",
            display: "-webkit-box",
            webkitLineClamp: 3,
            webkitBoxOrient: "vertical",
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
        styles: {},
        rowStyle: {}
    },
    {
        field: 'deck_highlight',
        label: 'Deck Highlight',
        styles: {

        },
        rowStyle: {}
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

        },
        rowStyle: {}
    },
    {
        field: 'tag',
        label: 'Tags',
        styles: {

        },
        rowStyle: {}
    },
    {
        field: 'catalogue_edition',
        label: 'Catalogue Edition',
        styles: {
            width: "10%"
        },
        rowStyle: {}
    },
    {
        field: 'created',
        label: 'Created On',
        styles: {
            width: "10%"
        },
        rowStyle: {}
    },
    {
        field: 'created_by',
        label: 'Created By',
        styles: {
            width: "10%"
        },
        rowStyle: {}
    },
    {
        field: 'updated',
        label: 'Updated On',
        styles: {
            width: "10%"
        },
        rowStyle: {}
    },
    {
        field: 'updated_by',
        label: 'Updated By',
        styles: {
            width: "10%"
        },
        rowStyle: {}
    }
]
const toast = useToast();
const confirm = useConfirm();

/* REF DEFINITION START */
const decks = ref();
const categoriesSelection = ref();
const edit = ref();
const datatable = ref();
const visible = ref(false);
const deck_highlight = ref(null);
const multiple_file_upload = useTemplateRef('multiple_file_upload');
const deck_images = ref([]);
const pdf = ref(null);
const pdfFile = ref();
const filters = ref({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const deckHighlightPreview = ref(null);
const deletedDeckSubImages = ref([]);
const spinner = ref();
/* REF DEFINITION END*/

/* VALIDATION START */
const v$ = useVuelidate(rules, formFields);
const imageHighlight$ = useVuelidate(imageHighlightRule, { deckHighlightPreview });
const subImages$ = useVuelidate(subImagesRule, { deck_images });
const pdfFile$ = useVuelidate(pdfFileRule, { pdfFile });
/* VALIDATION END */

/* FUNCTIONS */
const onRemoveTemplatingFile = (subImage, removeFileCallback, index) => {
    // removeFileCallback(index);
    deck_images.value.forEach(image => {
        if (image.name === subImage.name) {
            if (!image.isNew) {
                deletedDeckSubImages.value.push(image);
            }
        }
    });
    deck_images.value = deck_images.value.filter(image => image.name !== subImage.name);
    multiple_file_upload.value.files = multiple_file_upload.value.files.filter(image => image.name !== subImage.name); // Remove the image html element files element
};
const onClearFiles = (event) => {
    deck_images.value = [];
    event.files = [];
};

const onSelectedFiles = (event) => {
    event.files.forEach(file => {
        const exists = deck_images.value.some(deck_image => deck_image.name === file.name);
        if (!exists) {
            file.isNew = true;
            deck_images.value.push(file);
        }
    });
};
const resetFormData = () => {
    formFields.id = '';
    formFields.title = '';
    formFields.detail_description = '';
    formFields.category_id = null;
    formFields.tag = '';
    formFields.deck_highlight_name = "";
    formFields.deck_highlight_name_id = "";
    formFields.catalogue_edition = "";
    formFields.pdf_name = "";
    formFields.pdf_name_id = "";

    deck_images.value = [];
    deckHighlightPreview.value = null;
    deletedDeckSubImages.value = [];
    pdfFile.value = null;
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

    /* GET ALL FILES FROM FORM */
    const uploadedPDFFile = pdf.value.files;
    deckForm.images = [];
    if (uploadedPDFFile.length != 0) {
        deckForm.images.push({
            file_data: uploadedPDFFile[0],
            file_name: uploadedPDFFile[0].name,
            file_name_id: `RandomID-${Math.floor(Math.random() * 100)}_${new Date().toTimeString()}_${uploadedPDFFile[0].name}`,
            type: 'pdfFile',
            isNew: true, // Check if table is added or replaced the old image
        });
    }

    const imageHighlight = deck_highlight.value.files;
    if (imageHighlight.length != 0) {
        deckForm.images.push({
            file_data: imageHighlight[0],
            file_name: imageHighlight[0].name,
            file_name_id: `RandomID-${Math.floor(Math.random() * 100)}_${new Date().toTimeString()}_${imageHighlight[0].name}`,
            type: 'highlight',
            isNew: true,
        });
    }

    deck_images.value.forEach(image => {
        deckForm.images.push({
            file_data: image,
            file_name: image.name,
            file_name_id: image.name_id ? image.name_id : `RandomID-${Math.floor(Math.random() * 100)}_${new Date().toTimeString()}_${image.name}`,
            type: 'subImages',
            isNew: image.isNew
        });
    });

    if (!_.isEmpty(deletedDeckSubImages.value)) {
        deckForm.deleted_sub_images = deletedDeckSubImages.value;
    }
    /* GET ALL FILES FROM FORM */

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
            deck_highlight_name: data.deck_highlight_name,
            deck_highlight_name_id: data.deck_highlight_name_id,
            deck_images: data.deck_images,
            pdf: data.pdf,
            pdf_name: data.pdf_name,
            pdf_name_id: data.pdf_name_id,
            tag: data.tag,
            catalogue_edition: data.catalogue_edition ? data.catalogue_edition.toDate().toLocaleString() : '',
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

const deleteRow = (data) => {
    confirm.require({
        message: 'Do you want to delete this deck ?',
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
            spinner.value = true;
            let result = await DeckFirestore.deleteDeck(data);
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
            spinner.value = false;
        },
        reject: () => {

        }
    });
};

const editRow = (data) => {
    formFields.id = data.id;
    formFields.title = data.title;
    formFields.detail_description = data.detail_description;
    formFields.category_id = {
        id: data.category_id,
        name: data.category_name,
    };
    formFields.deck_highlight = data.deck_highlight;
    formFields.deck_highlight_name = data.deck_highlight_name;
    formFields.deck_highlight_name_id = data.deck_highlight_name_id;
    formFields.pdf = data.pdf;
    formFields.pdf_name = data.pdf_name;
    formFields.pdf_name_id = data.pdf_name_id;
    formFields.tag = data.tag;
    formFields.deck_images = data.deck_images;
    formFields.catalogue_edition = new Date(data.catalogue_edition);

    deckHighlightPreview.value = data.deck_highlight;
    deck_images.value = []; // Reset data of deck sub images when users click edit
    if (!_.isEmpty(data.deck_images)) {
        data.deck_images.forEach(async image => {
            const object = {
                name: image.name,
                name_id: image.name_id,
                objectURL: image.url,
                isNew: false,
            };
            deck_images.value.push(object);
        });
    }
    pdfFile.value = data.pdf;

    visible.value = true;
    edit.value = true;
};

const submitForm = async () => {
    spinner.value = true;
    const isValid = await v$.value.$validate();
    const imageHighlightValid = await imageHighlight$.value.$validate();
    const subImagesValid = await subImages$.value.$validate();
    const pdfFileValid = await pdfFile$.value.$validate();

    if (isValid && imageHighlightValid && subImagesValid && pdfFileValid) {

        const deckFormData = getDeckFormData();
        let categoryID = deckFormData.category_id.id;
        let result = {};
        deckFormData.category_id = categoryID;
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
    spinner.value = false;
};

const onImageSelected = (event) => {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
        deckHighlightPreview.value = e.target.result;
    };

    reader.readAsDataURL(file);
};

const onFileSelected = (event) => {
    pdfFile.value = event.files[0].name;
};

const formatDate = (value) => {
    return value ? moment(value).format('MMM/YYYY') : '';
};

const exportMyList = (event) => {
    ExportData.exportMyListAsExcel(decks.value, "decks");
};
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
    <LoadingSpinner v-if="spinner" />
    <Toast />
    <ConfirmDialog />
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
                            maxlength="100" :invalid="v$.title.$errors.length > 0" />
                        <small class="error-messages" v-if="v$.title.$errors.length > 0">{{
                            v$.title.$errors[0].$message }}</small>
                    </div>

                    <!-- Detail Description -->
                    <div class="flex flex-col">
                        <label class="form-label" for="detail_description">Detail Description <span
                                class="required-icon">*</span></label>
                        <Textarea :fluid="true" placeholder="Detail Description" id="detail_description"
                            v-model="formFields.detail_description" maxlength="1500"
                            :invalid="v$.detail_description.$errors.length > 0" />
                        <small class="error-messages" v-if="v$.detail_description.$errors.length > 0">{{
                            v$.detail_description.$errors[0].$message }}</small>
                    </div>

                    <!-- Deck Highlight -->
                    <div class="flex flex-col">
                        <label class="form-label" for="deck_highlight">Deck Highlight (1200x800px) <span
                                class="required-icon">*</span></label>
                        <img draggable="false" v-if="deckHighlightPreview" :src="deckHighlightPreview" alt="Image"
                            width="150" height="150" />
                        <FileUpload @select="onImageSelected" ref="deck_highlight" mode="basic" name="deck_highlight[]"
                            :maxFileSize="1000000" accept="image/*" />
                        <small class="error-messages" v-if="imageHighlight$.$errors.length > 0">{{
                            imageHighlight$.$errors[0].$message }}</small>
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
                        <label class="form-label" for="deck_images">Deck Images (1200x800px) <span
                                class="required-icon">*</span></label>
                        <Toast />
                        <FileUpload ref="multiple_file_upload" :multiple="true" accept="image/*" :maxFileSize="1000000"
                            @select="onSelectedFiles" @clear="onClearFiles">
                            <template #header="{ chooseCallback, clearCallback, files }">
                                <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                                    <div class="flex gap-2">
                                        <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined
                                            severity="secondary"></Button>
                                        <Button @click="clearCallback()" icon="pi pi-times" rounded outlined
                                            severity="danger"
                                            :disabled="!deck_images || deck_images.length === 0"></Button>
                                    </div>
                                </div>
                            </template>
                            <template #content="{ files, removeFileCallback }">
                                <div class="flex flex-col gap-8 pt-4">
                                    <div v-if="deck_images.length > 0">
                                        <div class="flex flex-wrap gap-4">
                                            <div v-for="(file, index) of deck_images" :key="file.name"
                                                class="p-4 rounded-border flex flex-col items-center image-box gap-4">
                                                <div>
                                                    <img :alt="file.name" :src="file.objectURL" width="150"
                                                        height="150" />
                                                </div>
                                                <span
                                                    class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">
                                                    {{ file.name }}
                                                </span>
                                                <Button icon="pi pi-times"
                                                    @click="onRemoveTemplatingFile(file, removeFileCallback, index, event)"
                                                    outlined rounded severity="danger" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template #empty v-if="deck_images.length === 0">
                                <div class="flex items-center justify-center flex-col">
                                    <i class="pi pi-cloud-upload border-2 p-6 rounded-full text-4xl text-muted-color" />
                                    <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
                                </div>
                            </template>
                        </FileUpload>
                        <small class="error-messages" v-if="subImages$.$errors.length > 0">{{
                            subImages$.$errors[0].$message }}</small>
                    </div>

                    <!-- PDF -->
                    <div class="flex flex-col">
                        <label class="form-label" for="pdf">PDF Link <span class="required-icon">*</span></label>
                        <InputText readonly v-model="pdfFile" />
                        <FileUpload @select="onFileSelected" ref="pdf" mode="basic" name="pdf[]" :maxFileSize="1000000"
                            accept="application/pdf" />
                        <small class="error-messages" v-if="pdfFile$.$errors.length > 0">{{
                            pdfFile$.$errors[0].$message }}</small>
                    </div>

                    <!-- Tag -->
                    <div class="flex flex-col">
                        <label class="form-label" for="tag">Tags <span class="required-icon">*</span></label>
                        <InputChips v-model="formFields.tag" placeholder="Input Tag and ENTER to seperate"
                            :invalid="v$.tag.$errors.length > 0" removable>
                        </InputChips>
                        <small class="error-messages" v-if="v$.tag.$errors.length > 0">{{
                            v$.tag.$errors[0].$message }}</small>
                    </div>

                    <!-- Catalogue Edition -->
                    <div class="flex flex-col">
                        <label class="form-label" for="catalogue_edition">Catalogue Edition <span
                                class="required-icon">*</span></label>
                        <DatePicker v-model="formFields.catalogue_edition" id="catalogue_edition" view="month"
                            dateFormat="M/yy" />
                        <small class="error-messages" v-if="v$.catalogue_edition.$errors.length > 0">{{
                            v$.catalogue_edition.$errors[0].$message }}</small>
                    </div>
                </form>

                <div class="flex items-center mt-3 gap-2">
                    <Button type="button" label="Save" icon="pi pi-save" @click="submitForm" />
                    <Button type="button" label="Cancel" severity="warn" icon="pi pi-times" @click="closeDrawer" />
                </div>

            </div>
        </Dialog>

        <div class="flex flex-col table-section min-height-750">
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
                                    <Button severity="secondary" type="button" label="Export" icon="pi pi-external-link"
                                        @click="exportMyList($event)" />
                                </div>
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
                        :style="{ ...column.styles }" :bodyStyle="{ ...column.bodyStyle }">
                        <template #body="slotProps">
                            <img draggable="false" :src="slotProps.data[column.field]"
                                v-if="column.field === 'deck_highlight'" width="64" />
                            <p v-else-if="column.field === 'pdf'">
                                <span v-if="slotProps.data[column.field]" class="pi pi-file-pdf"></span>
                            </p>
                            <p v-else-if="column.field === 'catalogue_edition'">
                                {{ formatDate(slotProps.data[column.field]) }}
                            </p>
                            <p v-else :style="{ ...column.rowStyle }">{{ slotProps.data[column.field] }}</p>
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

/* COMMON CSS START */
.items-center {
    align-items: center;
}

.justify-between {
    justify-content: space-between;
}

.flex-wrap {
    flex-wrap: wrap;
}

.rounded-border {
    border-radius: 6px;
}

.image-box {
    border: 1px solid #e2e8f0;
    width: 30%;
}

.image-box:hover {
    background-color: rgb(239, 237, 237)
}

.rounded-full {
    border-radius: 9999px;
}
</style>