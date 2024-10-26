<script setup>
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ColorPicker from 'primevue/colorpicker';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';
import { defineAsyncComponent, markRaw, ref } from 'vue';


/* REF DEFINITION START */
const tabs = ref([
    {
        title: "Contact Email Config",
        value: '0',
        content: {
            tabId: 'email_config',
            // markRaw: Vue marks a component used in this function as not reactive 
            component: markRaw(defineAsyncComponent(() => import ('./EmailContactConfig.vue')))
        }
    },
    {
        title: "Slider Config",
        value: '1',
        content: {
            tabId: 'slider_config',
            component: markRaw(defineAsyncComponent(() => import ('./HomeSliderConfig.vue')))
        }
    }
]);
const spinner = ref(false);

/* REF DEFINITION END */

/* FUNCTIONS START */
const setLoading = (value) => {
    spinner.value = value;
}
/* FUNCTIONS END */

</script>

<template>
    <LoadingSpinner v-if="spinner"/>
    <div class="card">
        <Tabs value="0">
            <TabList>
                <Tab v-for="tab in tabs" :key="tab.title" :value="tab.value">{{ tab.title }}</Tab>
            </TabList>
            <TabPanels>
                <TabPanel v-for="tab in tabs" :key="tab.content.tabId" :value="tab.value">
                    <component @setLoading="setLoading" v-bind:is="tab.content.component" :key="tab.content.tabId"/>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>

<style scoped></style>