<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
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

const { screensLookups, CodeLookups, rolesLookups, groupsLookups, getGroupLookups, getRolesLookups, getScreenLookups,
  getModuleLookups } = useLookups();
const { data, loading, clearPermissionData, setPermissionFilter, setPermissionPage, pageSize, totalRecords } = useReports();

const tableEnd = ref(null);
let observer: IntersectionObserver | null = null;

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
      field: "moduleCodes", options: [...CodeLookups.value]
    },
    { placeholder: "auditLog.screen", value: filterState.value.screenCodes, field: "screenCodes", options: [...screensLookups.value] },
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
    moduleCodes: null,
    screenCodes: null,
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
      case "moduleCodes":
        body.moduleCodes = f.value ?? null;
        break;
      case "screenCodes":
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
  setPermissionFilter(body);
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
  clearPermissionData();
};

const onFilterChange = ({ filter, value }: any) => {
  filterState.value[filter.field as keyof typeof filterState.value] = value;
};

onMounted(() => {
  Promise.all([getGroupLookups(false), getRolesLookups(false), getScreenLookups(),
  getModuleLookups()]);
  const body = getFilterBody([]);
  setPermissionFilter(body);
  hasSearched.value = true;

  observer = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting) {
      onReachEnd();
    }
  }, { root: null, rootMargin: '0px', threshold: 0.1 });

  if (tableEnd.value) observer.observe(tableEnd.value as Element);
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});

const onReachEnd = () => {
    const currentPage = Math.ceil(data.value.length / pageSize);       // current page number
  const totalPages = Math.ceil(totalRecords.value / pageSize); // total number of pages

  if (currentPage < totalPages) {
    let pageNo = currentPage + 1;
    setPermissionPage(pageNo);
  }
};

</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="reports.title" subtitle="reports.report" />

    <card class="bg-white rounded-[10px] w-full overflow-x-auto min-h-[600px]">
      <template #title>
        <PageHeader title="reports.permissionReportInfo" :showExport="true" :showSearch="false" :onExport="onExport" />
        <ReportFilters :showExport="true" :showFilter="true" :filters="filtersOperation" @search="onSearch"
          @clear="onClearFilters" @filter-change="onFilterChange" />
      </template>

      <template #content>
        <!-- LEVEL 1: USERS -->
        <DataTable :value="data" :loading="loading" dataKey="userName" v-model:expandedRows="expandedUserRows"  >
          <Column field="userName" :header="$t('usersManagement.userId')" style="width: 12%">
            <template #body="slotProps">
              <span class="text-gray-900 font-medium">{{ slotProps.data.userName }}</span>
            </template>
          </Column>
          <Column expander style="width: 3rem" />  
          <Column field="name" :header="$t('reports.nameModuleScreen')" style="width: 28%">
             <template #body="slotProps">
               <div class="flex items-center gap-2">
                 <span class="text-gray-900">{{ slotProps.data.name }}</span>
               </div>
             </template>
          </Column>

          <Column field="userGroup" :header="$t('userGroup.userGroup')" style="width: 15%">
             <template #body="slotProps">
               <span class="text-gray-600">{{ slotProps.data.userGroup || '-' }}</span>
             </template>
          </Column>

          <Column field="role" :header="$t('roles.roleName')" style="width: 15%">
             <template #body="slotProps">
               <span class="text-gray-600">{{ slotProps.data.role }}</span>
             </template>
          </Column>

          <Column :header="$t('button.view')" class="text-center" style="width: 7.5%"></Column>
          <Column :header="$t('button.create')" class="text-center" style="width: 7.5%"></Column>
          <Column :header="$t('button.edit')" class="text-center" style="width: 7.5%"></Column>
          <Column :header="$t('button.delete')" class="text-center" style="width: 7.5%"></Column>

          <template #expansion="userSlot">
            <div class="bg-gray-50/30">
              <DataTable :value="userSlot.data.modules" dataKey="moduleName" v-model:expandedRows="expandedModuleRows" class="nested-module-table">
                <Column style="width: 12%"></Column>
                <Column expander style="width: 3rem" />

                 <Column style="width: 28%">
                   <template #body="modSlot">
                     <div class="flex items-center gap-2">
                       <span class="font-medium text-gray-800">{{ modSlot.data.moduleName }}</span>
                     </div>
                   </template>
                 </Column>
                 
                 <Column style="width: 15%"></Column>
                 <Column style="width: 15%"></Column>
                 
                 <Column class="text-center" style="width: 7.5%">
                   <template #body="modSlot">
                     <div class="flex justify-center">
                        <span class="text-sm text-gray-700">{{ modSlot.data.view ? 'Yes' : 'No' }}</span>
                     </div>
                   </template>
                 </Column>
                 <Column class="text-center" style="width: 7.5%">
                   <template #body="modSlot">
                     <div class="flex justify-center">
                        <span class="text-sm text-gray-700">{{ modSlot.data.create ? 'Yes' : 'No' }}</span>
                     </div>
                   </template>
                 </Column>
                 <Column class="text-center" style="width: 7.5%">
                   <template #body="modSlot">
                     <div class="flex justify-center">
                        <span class="text-sm text-gray-700">{{ modSlot.data.edit ? 'Yes' : 'No' }}</span>
                     </div>
                   </template>
                 </Column>
                 <Column class="text-center" style="width: 7.5%">
                   <template #body="modSlot">
                     <div class="flex justify-center">
                        <span class="text-sm text-gray-700">{{ modSlot.data.delete ? 'Yes' : 'No' }}</span>
                     </div>
                   </template>
                 </Column>
                 <template #expansion="modSlot">
                   <div class="bg-white">
                      <DataTable :value="modSlot.data.screens" class="nested-screen-table">
                         <Column style="width: 3rem"></Column>
                         <Column style="width: 12%"></Column>
                         <Column style="width: 28%">
                           <template #body="screenSlot">
                             <div class="flex items-center gap-2 pl-4">
                               <span class="text-gray-700">{{ screenSlot.data.screenName }}</span>
                             </div>
                           </template>
                         </Column>
                         <Column style="width: 15%"></Column>
                         <Column style="width: 15%"></Column>
                         <Column class="text-center" style="width: 7.5%">
                           <template #body="screenSlot">
                             <div class="flex justify-center pl-8">
                              <span class="text-sm text-gray-600">{{ screenSlot.data.view ? 'Yes' : 'No' }}</span>
                             </div>
                           </template>
                         </Column>
                         <Column class="text-center" style="width: 7.5%">
                           <template #body="screenSlot">
                             <div class="flex justify-center pl-8">
                              <span class="text-sm text-gray-600">{{ screenSlot.data.create ? 'Yes' : 'No' }}</span>
                             </div>
                           </template>
                         </Column>
                         <Column class="text-center" style="width: 7.5%">
                           <template #body="screenSlot">
                             <div class="flex justify-center pl-8">
                              <span class="text-sm text-gray-600">{{ screenSlot.data.edit ? 'Yes' : 'No' }}</span>
                             </div>
                           </template>
                         </Column>
                         <Column class="text-center" style="width: 7.5%">
                           <template #body="screenSlot">
                             <div class="flex justify-center pl-8">
                              <span class="text-sm text-gray-600">{{ screenSlot.data.delete ? 'Yes' : 'No' }}</span>
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
    <div ref="tableEnd" class="h-4"></div>
  </div>
</template>

<style scoped>

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  /* padding: 1rem; */
  color: var(--color-gray-500);
  vertical-align: middle;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #FAF9F9 !important;
  font-weight: 600;
  color: var(--color-gray-700);
  font-size: 13px;
  /* padding: 1.25rem 1rem; */
}

/* Hide headers for nested module tables */
:deep(.nested-module-table .p-datatable-thead) {
  display: none;
}

/* Hide headers for nested screen tables */
:deep(.nested-screen-table .p-datatable-thead) {
  display: none;
}

/* Remove extra padding from nested tables */
:deep(.nested-module-table .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
    background: #F0F3FA !important;

}

:deep(.nested-screen-table .p-datatable-tbody > tr > td) {
  /* padding: 0.75rem 1rem; */
  border: none !important;
    background: var(--color-success-25) !important;
}

/* Remove borders between screen rows */
:deep(.nested-screen-table .p-datatable-tbody > tr) {
  border: none !important;
}

:deep(.nested-screen-table .p-datatable-tbody > tr > td) {
  border-top: none !important;
  border-bottom: none !important;
}

:deep(.p-datatable-wrapper) {
  overflow: visible;
}
</style>