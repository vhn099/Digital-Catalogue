<script lang="ts" setup>
import { computed, onActivated, onMounted, reactive, ref } from "vue";
import { ElMessageBox } from 'element-plus'
import type { DrawerProps, FormInstance } from 'element-plus'

// Sections components
import DefaultNavbar from "../Layouts/NavbarDefault.vue";
import DefaultFooter from "../Layouts/FooterDefault.vue";
import { UserFirestore } from "@/firestore/User";

interface User {
  email: string,
  full_name: any
  created: any,
  created_by: any,
  updated: any,
  updated_by: any,
};

const handleEdit = (index: number, row: User) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: User) => {
  console.log(index, row)
}

const tableColumns = [
  {
    label: 'Email',
    prop: 'email',
  },
  {
    label: 'Full Name',
    prop: 'full_name'
  },
  {
    label: 'Created On',
    prop: 'created'
  },
  {
    label: 'Created By',
    prop: 'created_by'
  },
  {
    label: 'Updated On',
    prop: 'updated',
  },
  {
    label: 'Updated By',
    prop: 'updated_by'
  }
];

const drawer2 = ref(false);
const direction = ref<DrawerProps['direction']>('rtl')
const radio1 = ref('Option 1')
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure you want to close this?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
function cancelClick() {
  drawer2.value = false
}
function confirmClick() {
  ElMessageBox.confirm(`Are you confirm to chose ${radio1.value} ?`)
    .then(() => {
      drawer2.value = false
    })
    .catch(() => {
      // catch error
    })
}

function openDrawer() {
  drawer2.value = true;
}

</script>

<template>
  <DefaultNavbar light />
  <div class="container">
    <div class="mt-4">
      <el-button type="primary" @click="openDrawer()">Add User</el-button>
    </div>
    <el-row>
      <el-table :data="filterTableData" style="width: 100%">
        <el-table-column v-for="column in tableColumns" :prop="column.prop" :label="column.label">
        </el-table-column>
        <el-table-column align="right">
          <template #header>
            <el-input v-model="search" size="small" placeholder="Type to search" />
          </template>
          <template #default="scope">
            <el-button size="small" @click="drawer2 = true">
              Edit
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-row>
  </div>
  <DefaultFooter />

  <el-drawer v-model="drawer2" size="30%" :direction="direction">
    <template #header>
      <h4>USER FORM</h4>
    </template>
    <template #default>
      <div>
        <el-form ref="formRef" :label-position="labelPosition" :model="dynamicValidateForm">
          <el-form-item>
            <el-form-item class="input-label" label="Email" prop="email" :rules="[
              {
                type: 'email',
                message: 'Please input correct email address',
                trigger: ['blur', 'change'],
              },
            ]">
              <el-input v-model="dynamicValidateForm.email" autocomplete="off" />
            </el-form-item>

            <el-form-item class="input-label" label="Full Name" prop="full_name">
              <el-input v-model="dynamicValidateForm.full_name" autocomplete="off" />
            </el-form-item>

            <el-form-item class="input-label" label="Password" prop="password">
              <el-input v-model="dynamicValidateForm.password" autocomplete="off" />
            </el-form-item>

            <el-form-item class="input-label" label="Confirm Password" prop="password_confirm">
              <el-input v-model="dynamicValidateForm.password_confirm" autocomplete="off" />
            </el-form-item>

            <el-form-item>
              <el-button class="my-2 mb-2 sign-in-button text-center" type="primary"
                @click="submitForm(formRef)">Submit</el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
        <el-button type="primary" @click="confirmClick">confirm</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<style lang="scss">
.el-row {
  margin-bottom: 20px;
  margin-top: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>

<script lang="ts">
import type { FormProps } from "element-plus";

const getUsers = async () => {
  const userList = [];
  (await UserFirestore.getUsers()).forEach(user => {
    const data = user.data();
    const object = {
      email: data.email,
      full_name: data.full_name || '',
      created: data.created || '',
      created_by: data.created_by || '',
      updated: data.updated || '',
      updated_by: data.updated_by || ''
    };
    userList.push(object);
  });
  return userList;
};

interface UserForm {

}

const search = ref('');
const formRef = ref<FormInstance>();

const dynamicValidateForm = reactive<{
  email: string,
  full_name: string,
  password: string,
  password_confirm: string,
}>({
  email: '',
  full_name: '',
  password: '',
  password_confirm: ''
});

export default {
  data() {
    return {
      tableData: [],
      labelPosition: ref<FormProps['labelPosition']>('top'),
    }
  },
  methods: {

  },

  async created() {
    this.tableData = await getUsers();
  },

  computed: {
    filterTableData() {
      return this.tableData.filter(
        (data: any) =>
          !search.value ||
          data.email.toLowerCase().includes(search.value.toLowerCase())
      );
    }
  },
}
</script>