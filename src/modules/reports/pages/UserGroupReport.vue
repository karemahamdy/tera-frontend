<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import ReportFilters from "../components/ReportFilters.vue";
import { useI18n } from "vue-i18n";
import { useLookups } from "@/composables/useLookups";
import { useReports } from "../composables/useReports";

const { t } = useI18n();
let hasSearched = ref(false);
const {rolesLookups, groupsLookups, getGroupLookups, getRolesLookups } = useLookups();
const { data, loading, setFilter } = useReports();

const filtersOperation = computed(() => {
  return [
    {
      placeholder: "usersManagement.allGroups",
      value:  filterState.value.userGroup,
      field: "userGroup",
      options: [ 
        ...groupsLookups.value
      ],
    },
    {
      placeholder: "usersManagement.allStatus",
      value:  filterState.value.isActive,
      field: "isActive",
      options: [
        { label: t("button.active"), value: true },
        { label: t("button.inactive"), value: false },
      ],
    },
    {
      placeholder: "roles.roles",
      value:  filterState.value.roles,
      field: "roles",
      options: [ 
        ...rolesLookups.value
      ],
    },
    
  ];
});
const filterState = ref({
  userGroup: null,
  isActive: null,
  roles: null
});

const columns = computed(() => {
  const Columns = [
   { field: 'groupName', header: t('reports.groupName') },
        { field: 'description', header: t('reports.description') },
        { field: 'assignedRoles', header: t('reports.assignedRoles') },
        { field: 'userCount', header: t('reports.userCount') },
        { field: 'isActive', header: t('reports.status') },
        { field: 'createdDate', header: t('reports.created'), type: "date" },
  ];
  return Columns;
});

const onSearch = (filters: any[]) => {
  const body: any = {
    pageIndex: 1,
    pageSize: 20,
    isActive: null,
    groupIds: null,
    roleIds: null,
  };
  filters.forEach((f) => {
    switch (f.field) {
      case "userGroup":
        body.groupIds = f.value ?? null;
        break;
      case "isActive":
        body.isActive = f.value ?? false;
        break;
      case "roles":
        body.roleIds = f.value ?? null;
        break;
    }
  });

  setFilter(body);
  hasSearched.value = true;
};

const onClearFilters = () => {
     filterState.value = { userGroup: null, isActive: null, roles: null };
     hasSearched.value = false;
};
const onFilterChange = ({ filter, value }: any) => {
  filterState.value[filter.field as keyof typeof filterState.value] = value;

};
onMounted(() => {
  Promise.all([getGroupLookups(false), getRolesLookups(false)]);
});

</script>
<template>
  <div class="p-6 w-full h-full bg-gray-100">
       <ScreenHeader title="reports.title" subtitle="reports.userGroupReport" />

    <card class="bg-white rounded-[10px] w-full overflow-x-auto">
      <!-- PageHeader component -->
      <template #title>
         <PageHeader
          title="reports.userGroupReportInfo"
          :showExport="false"
          :showSearch="false"
        />

        <ReportFilters :showExport="true" :showFilter="true" :filters="filtersOperation"  @search="onSearch" @clear="onClearFilters"  @filter-change="onFilterChange"/>
      </template>
      <template #content>
        <DynamicTable v-if="hasSearched" :columns="columns" :data="data" :loading="loading" :paginator="false">
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