<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
// import { useLookups } from "@/composables/useLookups";
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
      placeholder: "downtime.machine",
      value:  filterState.value.status,
      field: "status",
    //   selectionMode: "single",
      options: [
        // { label: t("button.active"), value: true },
        // { label: t("button.inactive"), value: false },
      ],
    },
    {
        placeholder: "downtime.WorkOrder",
      value:  filterState.value.userGroup,
      field: "userGroup",
      options: [ 
        // ...groupsLookups.value
      ],
    },
    {
      placeholder: "downtime.DowntimeType",
      value:  filterState.value.roles,
      field: "roles",
      options: [ 
        // ...rolesLookups.value
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
      { field: 'code', header: t('DowntimeLog.EntryNo'), sortable: true },
      { field: 'code', header: t('downtime.date'), sortable: true },
      { field: 'code', header: t('downtime.time'), sortable: true },
        { field: 'name', header: t('downtime.machine'), type: 'slot', sortable: true },
        { field: 'department', header: t('downtime.WorkOrder'), type: 'slot', sortable: true },
        { field: 'machines', header: t('downtime.DowntimeType'), sortable: true },
        { field: 'machines', header: t('downtime.duration'), sortable: true },
        { field: 'machines', header: t('downtime.notes'), sortable: true },
    
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
    try {
        // const body = getFilterBody(filtersOperation.value);
        // const response = await GroupService.getGroupExport(body);
        // FileService.downloadBlob(response, "GroupReport.xlsx");
        console.log("test");
        
    } catch (e) {
        console.error(e);
    }
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
onMounted(() => {
//   Promise.all([getGroupLookups(false), getRolesLookups(false)]);
  // const body = getFilterBody([]);
  // setFilter(body);
  hasSearched.value = true;
});

</script>
<template>
  <div class="p-6 w-full h-full bg-gray-100">
 <ScreenHeader title="production" subtitle="reports.title" actionName="DowntimeLog.DowntimeLogReport" />
    <card class="bg-white rounded-[10px] w-full overflow-x-auto">
      <!-- PageHeader component -->
      <template #title>
         <PageHeader
          title="DowntimeLog.ReportTitle"
          subtitle="DowntimeLog.ReportDescription"
          :showExport="true"
          :showSearch="false"
          :onExport="onExport"
        />
        <ReportFilters :showExport="true" :showFilter="true" :filters="filtersOperation"  @search="onSearch" @clear="onClearFilters"  @filter-change="onFilterChange"/>
      </template>
      <template #content>
        <DynamicTable v-if="hasSearched" :columns="columns" :data="data" :loading="loading" :paginator="false" :scrollPaginator="true"
            :first="firstRecord" :last="lastRecord" :rows="pageSize" :totalRecords="totalRecords" @page-change="setGroupPage" lazy>
          <template #col-isGlobal="{ data }">
            {{ data.isGlobal ? t("users.global") : t("users.branch") }}
          </template>
          <template #col-isAdmin="{ data }">
            {{ data.isAdmin ? t("Admin") : t("User") }}
          </template>
          
        </DynamicTable>
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