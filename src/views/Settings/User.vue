<script setup>
import { onMounted } from "vue";

// Sections components
// import BaseLayout from "../../../../components/BaseLayout.vue";
import BaseLayout from "../../../src/layouts/sections/components/BaseLayout.vue";
import View from "../../../src/layouts/sections/components/View.vue";
import DefaultNavbar from "@/layouts/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";
// import View from "../../../components/View.vue";

// Headers page components
import HeaderOne from "./components/HeaderOne.vue";

// Headers page components codes
import { header1Code } from "./components/codes";

// nav-pills
import setNavPills from "@/assets/js/nav-pills.js";

// hook
onMounted(() => {
  setNavPills();
});
</script>
<template>
  <DefaultNavbar light />
  <!-- <BaseLayout
    title="Page Headers"
    :breadcrumb="[
      { label: 'Page Sections', route: '/sections/page-sections/page-headers' },
      { label: 'Page Headers' },
    ]"
  >
    <View title="Header 1" :code="header1Code" id="header-1">
      <HeaderOne />
    </View>
  </BaseLayout> -->
  <div class="container">
        <div class="row">
          <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">Users</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Search by name..." v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="No users found"
        :md-description="`No user found for this '${search}' query. Try a different search term or create a new user.`">
        <md-button class="md-primary md-raised" @click="newUser">Create New User</md-button>
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
        <md-table-cell md-label="Gender" md-sort-by="gender">{{ item.gender }}</md-table-cell>
        <md-table-cell md-label="Job Title" md-sort-by="title">{{ item.title }}</md-table-cell>
      </md-table-row>
    </md-table>
        </div>
      </div>
  <DefaultFooter />
</template>
