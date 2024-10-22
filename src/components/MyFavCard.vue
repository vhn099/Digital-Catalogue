<script setup>
// components
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Button from 'primevue/button';

defineProps({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    isnew: {
        type: Boolean
    }
});
</script>

<template>
    <div class="fav-canva">
        <Card style="width: 25rem; overflow: hidden" v-if="!isnew">
            <template #header>
                <img alt="user header" src="../assets/img/demo/peroni.png" />
            </template>
            <template #title>{{ title }}</template>
            <template #subtitle>
                <div class="fav-tag">
                    <Tag severity="secondary" value="#news"></Tag>
                    <Tag severity="secondary" value="#news"></Tag>
                    <Tag severity="secondary" value="#news"></Tag>
                </div>

            </template>
            <template #content>
                <p class="m-0">
                    {{ description }}
                </p>
            </template>
            <template #footer>
                <Button icon="pi pi-trash" severity="warn" class="w-full" />
            </template>
        </Card>

        <Card style="width: 25rem; overflow: hidden" v-if="isnew">
            <template #content>
                <div class="add-new-fav">
                    <div class="new-icon">
                        <i class="pi pi-plus-circle" style="color: #c1c1c1; font-size: 250px;"></i>
                    </div>
                    <di class="add-more-text">
                        <span style="font-size: 28px; font-weight: 500; color: #c1c1c1;">Add More Desk</span>
                    </di>
                </div>
            </template>
        </Card>
    </div>

</template>

<style scoped>
.fav-tag .p-tag {
    background: #999999C7;
    color: white;
    font-size: 14px;
    font-weight: 600;
    margin-right: 5px;
    border-radius: 25px;
}

:deep(.p-card-body) {
    height: 100%;
}


:deep(.p-card-body .p-card-footer) {
    margin-top: auto;
}

:deep(.p-card-content) {
    height: inherit;
}

.add-new-fav {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: inherit;
    cursor: pointer;
}

.new-icon {
    padding: 15px;
}

.add-more-text {
    padding: 15px;
}
</style>