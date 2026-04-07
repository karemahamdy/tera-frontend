<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
// import { useLookups } from "@/composables/useLookups";
// import { useReports } from "../composables/useProductionReports";
// import { FileService } from "@/app/services/file.service";
import { useReports } from "@/modules/AccessControl/reports/composables/useReports";


const { t } = useI18n();
let hasSearched = ref(false);
// const {rolesLookups, groupsLookups, getGroupLookups, getRolesLookups } = useLookups();
const { 
  data, 
  loading, 
  setFilter, 
 totalRecords,
  pageIndex,
  pageSize,
  setGroupPage
 } = useReports();

const filtersOperation = computed(() => {
  return [
    {
      placeholder: "OperationActuals.ReceiptNo",
      value:  filterState.value.userGroup,
      field: "userGroup",
      options: [ 
        // ...groupsLookups.value
      ],
    },
     {
      placeholder: "OperationActuals.WorkOrder",
      value:  filterState.value.userGroup,
      field: "userGroup",
      options: [ 
        // ...groupsLookups.value
      ],
    },
     {
      placeholder: "OperationActuals.Process",
      value:  filterState.value.userGroup,
      field: "userGroup",
      options: [ 
        // ...groupsLookups.value
      ],
    },
     {
      placeholder: "OperationActuals.Machine",
      value:  filterState.value.userGroup,
      field: "userGroup",
      options: [ 
        // ...groupsLookups.value
      ],
    },
    
  ];
});
const filterState = ref({
  userGroup: null,
  status: null,
  roles: null
});

const columns = computed(() => {
  const Columns = [
   { field: 'groupName', header: t('OperationActuals.ReceiptNo') },
        { field: 'description', header: t('OperationActuals.WorkOrder') },
        { field: 'assignedRoles', header: t('OperationActuals.SEQ') },
        { field: 'userCount', header: t('OperationActuals.Process') },
        { field: 'userCount', header: t('OperationActuals.Machine') },
        { field: 'userCount', header: t('OperationActuals.ActualRuntime') },
        { field: 'userCount', header: t('OperationActuals.ActualSetupTime') },
        { field: 'userCount', header: t('OperationActuals.BOMRunTime') },
        { field: 'userCount', header: t('OperationActuals.BOMSetupTime') },
 
  ];
  return Columns;
});

const firstRecord = computed(() => {
  return data.value.length === 0 ? 0 : (pageIndex.value - 1) * pageSize + 1;
});

const lastRecord = computed(() => {
  if (data.value.length === 0) return 0;
  const last = firstRecord.value + data.value.length - 1;
  return last > totalRecords.value ? totalRecords.value : last;
});

const getFilterBody = (filters: any[]) => {
  const body: any = {
    pageIndex: 1,
    pageSize: pageSize,
    status: null,
    groupIds: null,
    roleIds: null,
  };
  filters.forEach((f) => {
    switch (f.field) {
      case "userGroup":
        body.groupIds = f.value ?? null;
        break;
    case "status":
        body.status = f.value 
        break;
      case "roles":
        body.roleIds = f.value ?? null;
        break;
    }
  });
  return body;
};
const onExport = async () => {
    // try {
    //     const body = getFilterBody(filtersOperation.value);
    //     const response = await GroupService.getGroupExport(body);
    //     FileService.downloadBlob(response, "GroupReport.xlsx");
    // } catch (e) {
    //     console.error(e);
    // }

};

const onSearch = (filters: any[]) => {
  const body = getFilterBody(filters);
  setFilter(body);
  hasSearched.value = true;
};
const onClearFilters = () => {
     filterState.value = { userGroup: null, status: null, roles: null };
    //  hasSearched.value = false;
};
const onFilterChange = ({ filter, value }: any) => {
  filterState.value[filter.field as keyof typeof filterState.value] = value;

};
// onMounted(() => {
//   Promise.all([getGroupLookups(false), getRolesLookups(false)]);
//   const body = getFilterBody([]);
//   setFilter(body);
//   hasSearched.value = true;
// });

</script>
<template>
  <div class="p-6 w-full h-full bg-gray-100">
             <ScreenHeader title="production" subtitle="reports.title" actionName="OperationActuals.OperationActuals" />

    <card class="bg-white rounded-[10px] w-full overflow-x-auto">
      <!-- PageHeader component -->
      <template #title>
         <PageHeader
          title="OperationActuals.title"
          subtitle="OperationActuals.subtitle"
          :showExport="true"
          :showSearch="false"
          :onExport="onExport"
        />

        <ReportFilters :showExport="true" :showFilter="true" :filters="filtersOperation"  @search="onSearch" @clear="onClearFilters"  @filter-change="onFilterChange"/>
      </template>
      <template #content>
        <DynamicTable  :columns="columns" :data="data" :loading="loading" :paginator="false" :scrollPaginator="true"
            :first="firstRecord" :last="lastRecord" :rows="pageSize" :totalRecords="totalRecords" @page-change="setGroupPage" lazy />
      </template>
    </card>
  </div>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 16px;
    color: var(--color-gray-500);
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background: #FAF9F9;
    font-weight: 600;
    color: var(--color-gray-700);
    font-size: 13px;
    padding: 20px 16px;
}
</style>