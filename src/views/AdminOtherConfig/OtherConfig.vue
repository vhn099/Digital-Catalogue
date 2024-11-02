<script setup>
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';
import { defineAsyncComponent, markRaw, ref } from 'vue';
import HomeSliderConfig from './HomeSliderConfig.vue';
import EmailContactConfig from './EmailContactConfig.vue';
import Divider from 'primevue/divider';


/* REF DEFINITION START */
// const tabs = ref([
// {
//         title: "Slider Config",
//         value: '0',
//         content: {
//             tabId: 'slider_config',
//             component: markRaw(defineAsyncComponent(() => import ('./HomeSliderConfig.vue')))
//         }
//     },
//     // {
//     //     title: "Contact Email Config",
//     //     value: '1',
//     //     content: {
//     //         tabId: 'email_config',
//     //         // markRaw: Vue marks a component used in this function as not reactive 
//     //         component: markRaw(defineAsyncComponent(() => import ('./EmailContactConfig.vue')))
//     //     }
//     // },
    
// ]);
const spinner = ref(false);

/* FUNCTIONS START */
const setLoading = (value) => {
    spinner.value = value;
}

</script>

<template>
    <LoadingSpinner v-if="spinner"/>
    <div class="config-container">
        <!-- <Tabs value="0">
            <TabList>
                <Tab v-for="tab in tabs" :key="tab.title" :value="tab.value">{{ tab.title }}</Tab>
            </TabList>
            <TabPanels>
                <TabPanel v-for="tab in tabs" :key="tab.content.tabId" :value="tab.value">
                    
                </TabPanel>
            </TabPanels>
        </Tabs> -->
        <div class="slider-config">
            <HomeSliderConfig @setLoading="setLoading"/>
        </div>
        <Divider class="divider"/>
        <div class="email-config">
            <EmailContactConfig />
        </div>
    </div>
</template>

<style scoped>
.config-container {
    padding: 50px;
}

/* DIVIDER CSS */
.divider {
    padding-top: 10px;
    padding-bottom: 10px;
}

.p-divider-horizontal:before {
    border-top: 2px solid #a3a3a3;
}
</style>