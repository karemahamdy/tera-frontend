<script setup>
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import PageHeader from "@/sharedComponents/PageHeader.vue";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useSearch } from "@/composables/useSearch";
import { useFilters } from "@/composables/useFilters";
import { useSession } from "../composables/useSession";

const { t } = useI18n();
const router = useRouter();


const {
    List,
    loading,
    pagination,
    getList,
    changePage,
    sort,
    search
} = useSession();


onMounted(() => {
    getList()
});

const filtersOperation = [
    {
        placeholder: "activeSessions.allIPAddress",
        value: null,
        field: "ipAddress",
        options: [
            { label: "activeSessions.allIPAddress", value: null },
            { label: "option 1", value: "option 1" },
        ],
    },
    {
        placeholder: "activeSessions.allBranches",
        value: null,
        field: "allUsers",
        options: [
            { label: "activeSessions.allBranches", value: null },
            { label: "option 1", value: "option 1" },
        ],
    },
    {
        placeholder: "activeSessions.allStatus",
        value: null,
        field: "allStatus",
        options: [
            { label: "activeSessions.allStatus", value: null },
            { label: "option 1", value: "option 1" },
        ],
    }
];

const firstRecord = computed(() => {
    return List.value.length === 0
        ? 0
        : (pagination.value.PageIndex - 1) * pagination.value.PageSize + 1;
});

const lastRecord = computed(() => {
    if (List.value.length === 0) return 0;
    const last = firstRecord.value + List.value.length - 1;
    return last > pagination.value.total ? pagination.value.total : last;
});

const columns = computed(() => {
    const Columns = [
        { field: 'fullName', header: t('activeSessions.user'), sortable: true, type: "slot" },
        { field: 'branchNameEn', header: t('activeSessions.branch'), sortable: true, type: "badge", Class: "custom-badge", },
        { field: 'ipAddress', header: t('activeSessions.ipAddress'), sortable: true },
        { field: 'device', header: t('activeSessions.device'), sortable: true },
        { field: 'isActive', header: t('activeSessions.status'), sortable: true },
        { field: 'loginTime', header: t('activeSessions.loginTime'), type: "dateTimeDetailed", sortable: true },
        { field: 'logoutTime', header: t('activeSessions.lastActivity'), sortable: true },
        { field: 'actionItem', header: t('activeSessions.action'), type: "slot" },
    ];

    return Columns;
});

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="accessControl" subtitle="activeSessions.title" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="activeSessions.title" subtitle="activeSessions.subtitle" :showExport="true"
                    :showFilter="true" @filter-change="onFilterChange" :filters="filters"
                    searchPlaceholder="activeSessions.searchPlaceholder" @search="search" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="List" :loading="loading" :first="firstRecord" :last="lastRecord"
                    :rows="pagination.PageSize" :totalRecords="pagination.total" @action-menu-click="handleActionMenu"
                    @page-change="changePage" @order-change="sort" lazy>
                    <template v-slot:["col-fullName"]="{ data }">
                        <div class="flex items-center gap-2 rounded">
                            <Badge v-if="data.isAdmin" severity="warn" class="circle-badge-sm">
                                <VsxIcon iconName="Award" :size="20" type="linear" />
                            </Badge>

                            <Avatar :image="data.profileImageUrl"
                                :label="!data.profileImageUrl ? data.fullName.charAt(0) : ''" shape="circle"
                                class="w-10 h-10 bg-gray-800" />
                            <div class="flex flex-col">
                                <div class="text-base text-gray-700">{{ data.fullName }}</div>
                                <div class="text-sm text-gray-500">{{ data.userName }}</div>
                            </div>
                        </div>
                    </template>
                    <template #col-actionItem="{ data }">
                        <div class="flex items-center gap-2 text-danger-500 cursor-pointer">
                            <VsxIcon iconName="PlayCricle" :size="24" type="linear" />
                            {{ $t("activeSessions.end") }}
                        </div>
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