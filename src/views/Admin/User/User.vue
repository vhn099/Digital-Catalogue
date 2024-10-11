<script lang="ts" setup>
import { onMounted } from "vue";

// example components
import Header from "@/layouts/Header/Header.vue";
import Table from "@/layouts/table/Table.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";
onMounted(() => {
  setMaterialInput();
});

</script>
<template>
    <Table />
</template>