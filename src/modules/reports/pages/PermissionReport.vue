<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import ReportFilters from "../components/ReportFilters.vue";
import { useI18n } from "vue-i18n";
import { useLookups } from "@/composables/useLookups";
import { useReports } from "../composables/useReports";
import { FileService } from "@/app/services/file.service";
import { PermissionService } from "../services/reports.service";

const { t } = useI18n();
let hasSearched = ref(false);
const expandedUserRows = ref([]);
const expandedModuleRows = ref([]);

const { screensLookups, modulesLookups, rolesLookups, groupsLookups, getGroupLookups, getRolesLookups, getScreenLookups,
  getModuleLookups } = useLookups();
const { data, loading, fetchPermission } = useReports();

const filtersOperation = computed(() => {
  return [
    {
      placeholder: "usersManagement.allGroups",
      value: filterState.value.userGroup,
      field: "userGroup",
      options: [
        ...groupsLookups.value
      ],
    },
    {
      placeholder: "roles.roles",
      value: filterState.value.roles,
      field: "roles",
      options: [
        ...rolesLookups.value
      ],
    },
    {
      placeholder: "auditLog.module",
      value: filterState.value.moduleCodes,
      field: "moduleCodes", options: [...modulesLookups.value]
    },
    { placeholder: "screen", value: filterState.value.screenCodes, field: "screenCodes", options: [...screensLookups.value] },
    {
      placeholder: "reports.permission",
      value: filterState.value.permissionTypes,
      field: "permissionTypes",
      options: [
        { label: t("button.create"), value: "create" },
        { label: t("button.delete"), value: "delete" },
        { label: t("button.view"), value: "view" },
        { label: t("button.edit"), value: "edit" },
      ],
    },
  ];
});

const filterState = ref({
  userGroup: null,
  permissionTypes: null,
  roles: null,
  moduleCodes: null,
  screenCodes: null
});

const getFilterBody = (filters: any[]) => {
  const body: any = {
    pageIndex: 1,
    pageSize: 20,
    permissionTypes: null,
    groupIds: null,
    roleIds: null,
  };
  filters.forEach((f) => {
    switch (f.field) {
      case "userGroup":
        body.groupIds = f.value ?? null;
        break;
      case "permissionTypes":
        body.permissionTypes = f.value ?? null;
        break;
      case "roles":
        body.roleIds = f.value ?? null;
        break;
      case "module":
        body.moduleCodes = f.value ?? null;
        break;
      case "screen":
        body.screenCodes = f.value ?? null;
        break;
    }
  });
  return body;
};

const onExport = async () => {
  try {
    const body = getFilterBody(filtersOperation.value);
    const response = await PermissionService.getPermissionExport(body);
    FileService.downloadBlob(response, "user-permission-matrix.xlsx");
  } catch (e) {
    console.error(e);
  }
};

const onSearch = (filters: any[]) => {
  const body = getFilterBody(filters);
  fetchPermission(body);
  hasSearched.value = true;
};

const onClearFilters = () => {
  filterState.value = {
    userGroup: null,
    permissionTypes: null,
    roles: null,
    moduleCodes: null,
    screenCodes: null
  };
};

const onFilterChange = ({ filter, value }: any) => {
  filterState.value[filter.field as keyof typeof filterState.value] = value;
};

onMounted(() => {
  Promise.all([getGroupLookups(false), getRolesLookups(false), getScreenLookups(),
  getModuleLookups()]);
  const body = getFilterBody([]);
  fetchPermission(body);
  hasSearched.value = true;
});

</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="reports.title" subtitle="reports.userGroupReport" />

    <card class="bg-white rounded-[10px] w-full overflow-x-auto min-h-[600px]">
      <template #title>
        <PageHeader title="reports.permissionReportInfo" :showExport="true" :showSearch="false" :onExport="onExport" />
        <ReportFilters :showExport="true" :showFilter="true" :filters="filtersOperation" @search="onSearch"
          @clear="onClearFilters" @filter-change="onFilterChange" />
      </template>

      <template #content>
        <!-- LEVEL 1: USERS -->
        <DataTable :value="data" :loading="loading" dataKey="userName" v-model:expandedRows="expandedUserRows" tableStyle="min-width: 60rem">
          <Column expander style="width: 3rem" />  
          <Column field="userName" :header="$t('usersManagement.userId')" style="width: 15%">
             <template #body="slotProps">
               <span class="text-gray-900 font-medium">{{ slotProps.data.userName }}</span>
             </template>
          </Column>
          <Column field="name" :header="$t('reports.nameModuleScreen')" style="width: 25%">
             <template #body="slotProps">
               <div class="flex items-center gap-2">
                 {{ slotProps.data.name }}
               </div>
             </template>
          </Column>

          <Column field="userGroup" :header="$t('userGroup.userGroup')" style="width: 20%">
             <template #body="slotProps">
               <span class="text-gray-600">{{ slotProps.data.userGroup }}</span>
             </template>
          </Column>

          <Column field="role" :header="$t('roles.roleName')" style="width: 20%">
             <template #body="slotProps">
               <span class="text-gray-600">{{ slotProps.data.role }}</span>
             </template>
          </Column>

          <Column :header="$t('button.view')" style="width: 5%"></Column>
          <Column :header="$t('button.create')" style="width: 5%"></Column>
          <Column :header="$t('button.edit')" style="width: 5%"></Column>
          <Column :header="$t('button.delete')" style="width: 5%"></Column>

          <template #expansion="userSlot">
            <div class="px-8 py-2 bg-gray-50/50">
              <DataTable :value="userSlot.data.modules" dataKey="moduleName" v-model:expandedRows="expandedModuleRows">
                 <Column expander style="width: 3rem" />

                 <Column :header="$t('reports.moduleName')" style="width: 40%">
                   <template #body="modSlot">
                     <div class="flex items-center gap-2 pl-4">
                       <i class="pi pi-folder text-yellow-500"></i>
                       <span class="font-semibold text-gray-700">{{ modSlot.data.moduleName }}</span>
                     </div>
                   </template>
                 </Column>
                 <Column :header="$t('button.view')" class="text-center" style="width: 15%">
                   <template #body="modSlot">
                     <div class="flex justify-center">
                        <i v-if="modSlot.data.view" class="pi pi-check text-green-500 font-bold"></i>
                         <i v-else class="pi pi-times text-red-300"></i>
                     </div>
                   </template>
                 </Column>
                 <Column :header="$t('button.create')" class="text-center" style="width: 15%">
                   <template #body="modSlot">
                     <div class="flex justify-center">
                        <i v-if="modSlot.data.create" class="pi pi-check text-green-500 font-bold"></i>
                         <i v-else class="pi pi-times text-red-300"></i>
                     </div>
                   </template>
                 </Column>
                 <Column :header="$t('button.edit')" class="text-center" style="width: 15%">
                   <template #body="modSlot">
                     <div class="flex justify-center">
                        <i v-if="modSlot.data.edit" class="pi pi-check text-green-500 font-bold"></i>
                         <i v-else class="pi pi-times text-red-300"></i>
                     </div>
                   </template>
                 </Column>
                 <Column :header="$t('button.delete')" class="text-center" style="width: 15%">
                   <template #body="modSlot">
                     <div class="flex justify-center">
                        <i v-if="modSlot.data.delete" class="pi pi-check text-green-500 font-bold"></i>
                         <i v-else class="pi pi-times text-red-300"></i>
                     </div>
                   </template>
                 </Column>
                 <template #expansion="modSlot">
                   <div class="px-12 py-2">
                      <DataTable :value="modSlot.data.screens" class="no-header-table">
                         <Column style="width: 3rem"></Column>
                         <Column :header="$t('reports.screenName')" style="width: 40%">
                           <template #body="screenSlot">
                             <div class="flex items-center gap-2 pl-8">
                               <span class="text-gray-600">{{ screenSlot.data.screenName }}</span>
                             </div>
                           </template>
                         </Column>
                         <Column :header="$t('button.view')" class="text-center" style="width: 15%">
                           <template #body="screenSlot">
                             <div class="flex justify-center">
                              <span v-if="screenSlot.data.view" class="text-sm">{{ t('button.yes') }}</span>
                              <span v-else class="text-sm text-gray-400">{{ t('button.no') }}</span>
                             </div>
                           </template>
                         </Column>
                         <Column :header="$t('button.create')" class="text-center" style="width: 15%">
                           <template #body="screenSlot">
                             <div class="flex justify-center">
                              <span v-if="screenSlot.data.create" class="text-sm">{{ t('button.yes') }}</span>
                              <span v-else class="text-sm text-gray-400">{{ t('button.no') }}</span>
                             </div>
                           </template>
                         </Column>
                         <Column :header="$t('button.edit')" class="text-center" style="width: 15%">
                           <template #body="screenSlot">
                             <div class="flex justify-center">
                              <span v-if="screenSlot.data.edit" class="text-sm">{{ t('button.yes') }}</span>
                              <span v-else class="text-sm text-gray-400">{{ t('button.no') }}</span>
                             </div>
                           </template>
                         </Column>
                         <Column :header="$t('button.delete')" class="text-center" style="width: 15%">
                           <template #body="screenSlot">
                             <div class="flex justify-center">
                              <span v-if="screenSlot.data.delete" class="text-sm">{{ t('button.yes') }}</span>
                              <span v-else class="text-sm text-gray-400">{{ t('button.no') }}</span>
                             </div>
                           </template>
                         </Column>
                      </DataTable>
                   </div>
                 </template>
              </DataTable>
            </div>
          </template>
        </DataTable>
      </template>
    </card>
  </div>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 1rem;
  color: var(--color-gray-500);
  vertical-align: middle;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #FAF9F9;
  font-weight: 600;
  color: var(--color-gray-700);
  font-size: 13px;
  padding: 1.25rem 1rem;
}

:deep(.no-header-table .p-datatable-thead) {
  display: none;
}

:deep(.p-datatable-wrapper) {
  overflow: visible;
}
</style>