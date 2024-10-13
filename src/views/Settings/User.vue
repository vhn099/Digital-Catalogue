<script lang="ts" setup>
import { reactive, ref } from "vue";
import { ElMessageBox, ElMessage } from 'element-plus'
import type { DrawerProps, FormInstance, FormRules } from 'element-plus'

// Sections components
import DefaultNavbar from "../Layouts/NavbarDefault.vue";
import DefaultFooter from "../Layouts/FooterDefault.vue";
import { UserFirestore } from "@/lib/User";

interface User {
  email: string,
  full_name: any
  created: any,
  created_by: any,
  updated: any,
  updated_by: any,
};

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

</script>

<template>
  <DefaultNavbar light />
  <div class="container">
    <div class="mt-4">
      <el-button type="primary" @click="openDrawer">Add User</el-button>
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
            <el-button size="small" @click="openDrawerEdit(scope.row)">
              Edit
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-row>
  </div>
  <DefaultFooter />

  <el-drawer v-model="drawer" size="50%" :direction="direction">
    <!-- DRAWER HEADER -->
    <template #header>
      <h4>USER FORM</h4>
    </template>

    <!-- DRAWER BODY -->
    <template #default>
      <div>
        <el-form :rules="formRules" ref="formRef" :label-position="labelPosition" :model="dynamicValidateForm">
          <el-form-item class="input-label" label="ID" prop="id" v-if="edit">
            <el-input v-model="dynamicValidateForm.id" autocomplete="off" disabled />
          </el-form-item>

          <el-form-item class="input-label" label="Email" prop="email_form">
            <el-input v-model="dynamicValidateForm.email_form" autocomplete="off" :disabled="edit"/>
          </el-form-item>

          <el-form-item class="input-label" label="Full Name" prop="full_name">
            <el-input v-model="dynamicValidateForm.full_name" autocomplete="off" />
          </el-form-item>

          <el-form-item class="input-label" label="Password" prop="password" v-if="!edit">
            <el-input minlength="6" v-model="dynamicValidateForm.password" autocomplete="off" :show-password="true" />
          </el-form-item>

          <el-form-item class="input-label" label="Confirm Password" prop="password_confirm" v-if="!edit">
            <el-input minlength="6" v-model="dynamicValidateForm.password_confirm" autocomplete="off"
              :show-password="true" />
          </el-form-item>

          <el-form-item prop="isAdmin">
            <el-checkbox v-model="dynamicValidateForm.isAdmin" label="Is Admin ?" />
          </el-form-item>

          <div style="flex: auto; float: right">
            <el-form-item>
              <el-button @click="cancelClick">Cancel</el-button>
              <el-button type="primary" @click="confirmClick(formRef)">Confirm</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </template>
    <!-- DRAWER FOOTER -->
    <template #footer>

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
import { getAuth } from 'firebase/auth';
import { Timestamp } from "firebase/firestore";

interface FormFields {
  id: string,
  email_form: string,
  full_name: string,
  password: string,
  password_confirm: string,
  isAdmin: boolean,
};

const direction = ref<DrawerProps['direction']>('rtl');
/* REF DEFINITION START */
const tableData = ref([]);
const search = ref('');
const drawer = ref(false);
const edit = ref(false);
const formRef = ref<FormInstance>();
/* REF DEFINITION END */

const formRules = reactive<FormRules<FormFields>>({
  email_form: [
    { required: true, message: "Please input email", trigger: ['blur', 'change'] },
    { type: 'email', message: "Please input with email", trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: "Please input user's password", trigger: ['blur', 'change'] },
    { min: 6, message: "Password's length must be over 6", trigger: ['blur', 'change'] }
  ],
  password_confirm: [
    { required: true, message: "Please input confirm password", trigger: ['blur', 'change'] },
    {
      validator: (rule, value, callback) => {
        if (value !== dynamicValidateForm.password) {
          callback(new Error("Password and confirm password must be the same"));
        } else {
          callback();
        }
      },
      trigger: ['blur', 'change']
    }
  ]
});

const dynamicValidateForm = reactive<{
  id: string,
  email_form: string,
  full_name: string,
  password: string,
  password_confirm: string,
  isAdmin: boolean,
}>({
  id: '',
  email_form: '',
  full_name: '',
  password: '',
  password_confirm: '',
  isAdmin: false,
});

const getUsers = async () => {
  const userList = [];
  (await UserFirestore.getUsers()).forEach(user => {
    const data = user.data();
    const object = {
      id: user.id,
      email: data.email,
      full_name: data.full_name || '',
      isAdmin: data.isAdmin,
      created: data.created || '',
      created_by: data.created_by || '',
      updated: data.updated || '',
      updated_by: data.updated_by || ''
    };
    userList.push(object);
  });
  return userList;
};

const getUserFormData = () => {
  const userForm = {} as any;
  for (const key in dynamicValidateForm) {
    userForm[key] = dynamicValidateForm[key];
  }
  userForm.updated = Timestamp.now().toDate();
  userForm.updated_by = getAuth().currentUser.email;
  if (!edit.value) {
    userForm.created = Timestamp.now().toDate();
    userForm.created_by = getAuth().currentUser.email;
  }

  return userForm;
};

const createUsers = async () => {
  const userForm = getUserFormData();
  const result = await UserFirestore.createUsers(userForm) as any;
  ElMessage({
    message: result.message,
    type: result.status,
    showClose: true
  });
  if (result.status === 'success') {
    drawer.value = false;
  }
}

const updateUser = async () => {
  const userForm = getUserFormData();
  const result = await UserFirestore.updateUser(userForm) as any;
  ElMessage({
    message: result.message,
    type: result.status,
    showClose: true
  });
  if (result.status === 'success') {
    drawer.value = false;
  }
};

const deleteUser = async (userID, email, updated, updated_by) => {
  const result = await UserFirestore.deleteUser(userID, email, updated, updated_by) as any;
  if (result.status === 'success') {
    tableData.value = await getUsers();
  }
  ElMessage({
    message: result.message,
    type: result.status,
    showClose: true
  });
}

export default {
  data() {
    return {
      labelPosition: ref<FormProps['labelPosition']>('top'),
    };
  },
  methods: {
    handleDelete: (scope) => {
      ElMessageBox.confirm(`Are you confirm to delete this user ?`)
        .then(async () => {
          await deleteUser(scope.id, scope.email, scope.updated, scope.updated_by);
          tableData.value = await getUsers();
        })
        .catch(() => {

        });
    },
    openDrawerEdit: (scope) => {
      dynamicValidateForm.id = scope.id;
      dynamicValidateForm.email_form = scope.email;
      dynamicValidateForm.full_name = scope.full_name;
      dynamicValidateForm.isAdmin = scope.isAdmin;
      drawer.value = true;
      edit.value = true;
    },
    openDrawer: () => {
      drawer.value = true;
    },
    cancelClick: () => {
      /* Reset form values when cancel is clicked */
      dynamicValidateForm.id = '';
      dynamicValidateForm.email_form = '';
      dynamicValidateForm.full_name = '';
      dynamicValidateForm.password = '';
      dynamicValidateForm.password_confirm = '';
      dynamicValidateForm.isAdmin = false;
      drawer.value = false;
      edit.value = false;
    },
    confirmClick: (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate(async (valid) => {
        if (valid) {
          ElMessageBox.confirm(`Are you confirm to save with these changes ?`)
            .then(async () => {
              if (!edit.value) {
                await createUsers();
              } else {
                await updateUser();
              }
              tableData.value = await getUsers();
            })
            .catch(() => {

            });
        } else {
          console.log('error submit!');
        }
      });
    },
  },

  async created() {
    tableData.value = await getUsers();
  },

  computed: {
    filterTableData() {
      return tableData.value.filter(
        (data: any) =>
          !search.value ||
          data.email.toLowerCase().includes(search.value.toLowerCase())
      );
    }
  },
}
</script>