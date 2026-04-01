<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useworkCenter } from "../composables/useWorkCenters";
import { useLookups } from "@/composables/useLookups";

const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);
const { loading, toggleActive, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, deleteworkCenter, onFilterChange, fetchworkCenter, apiworkCenter } = useworkCenter();
const {  departmentsLookups, getDepartmentsLookups } = useLookups();  

const emit = defineEmits(['search', 'action-menu-click']);
const customItems = [
      {
        action: "toggleActive",
        changeStatus: true,
        label: t("button.active"),
        type: "switch",
        key: "isActive",
    },
     {
      slot: true,
      label: t("button.view"),
      icon: "Eye",
      color: "#3F5FAC",
      action: 'view',
    },
];
onMounted(() => {
    fetchworkCenter();
    getDepartmentsLookups();
});
const filtersOperation = computed(() => {
    return [
          {
            placeholder: "workCenter.department",
            value: null,
            field: "departmentId",
            options: [

             { label: t("usersManagement.allDepartment"), value: null },
              ...departmentsLookups.value
            ],
        },
        {
            placeholder: "status",
            value: null,
            field: "status",
            options: [
                  { label: t("usersManagement.allStatus"), value: null },
                { label: t("button.active"), value: true },
                 { label: t("button.inactive"), value: false },
            ],
        },
    ]
});

const columns = computed(() => {
    const Columns = [ 
        { field: 'workCenterCode', header: t('workCenter.code'), sortable: true },
        { field: 'workCenterName', header: t('workCenter.name'), type: 'slot', sortable: true },
        { field: 'departmentName', header: t('workCenter.department'), type: 'slot', sortable: true },
        { field: 'machinesCount', header: t('workCenter.machines'), sortable: true },
        { field: 'isActive', header: t('status'), type: 'status', sortable: true },
        { field: 'action', header: t('action') }
    ];

    return Columns;
});

const firstRecord = computed(() => {
     if (!totalCount.value || totalCount.value === 0) return 0;
    return ((pageIndex.value - 1) * pageSize.value) + 1;
});

const lastRecord = computed(() => {
     if (!totalCount.value || totalCount.value === 0) return 0;
    const last = pageIndex.value * pageSize.value;
    return Math.min(last, totalCount.value || last);
});


const confirmDelete = (row: any) => {
    rowToDelete.value = row;
    showDeleteDialog.value = true;
};

const handleActionMenu = async (payload: any) => {
    const action = payload.action || payload;
    const data = payload.data || payload.row || payload;
    if (action === 'edit') {
        router.push({
            name: "workCenterFormEdit",
            params: { id: data.id },
        });
    }
    if (action === 'view') {
        router.push({
            name: "workCenterFormView",
            params: { id: data.id },
        });
    }
    if (action === 'delete') {
        confirmDelete(data);
    }
    if (action === "toggleActive") {
        if (loading.value) return;
        await toggleActive(data.id, !data.isActive);
    }
};

const handleDeleteConfirm = async () => {
    if (!rowToDelete.value) return;
    isDeleting.value = true;
    await deleteworkCenter(rowToDelete.value.id).finally(() => {
        isDeleting.value = false;
        showDeleteDialog.value = false;
        rowToDelete.value = null;
    });
};

const addworkCenter = () => {
    router.push({name: 'workCenterCreate' });
};

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="production" subtitle="masterData" actionName="workCenter.workCenter" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="workCenter.workCenter" subtitle="workCenter.subtitle" :showExport="false"
                    :showImport="false" :mainBtn="true" mainBtnText="workCenter.addNew" :showFilter="true"
               :filters="filtersOperation" @filter-change="onFilterChange"
                    searchPlaceholder="workCenter.searchPlaceholder" @search="onSearch" :onMainBtnClick="addworkCenter" 
                    />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="apiworkCenter" :loading="loading" :customItems="customItems"
                    @action-menu-click="handleActionMenu" :showDelete="true" @page-change="setPage" @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount"  @search="onSearch" lazy >
               <template  v-slot:["col-code"]="{ data }">
                        <span class="text-primary-500 cursor-pointer">{{ data.code }}</span>
                    </template>
                    </DynamicTable>
            </template>
        </card>

        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon" :title="$t('workCenter.deleteConfirm')"
            :buttons="[
                { label: $t('button.cancel'), variant: 'ghost', action: 'cancel' },
                { label: $t('button.delete'), variant: 'danger', action: 'confirm' },
            ]" @confirm="handleDeleteConfirm" />

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