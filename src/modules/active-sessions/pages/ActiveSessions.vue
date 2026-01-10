<script setup lang="ts">
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import PageHeader from "@/sharedComponents/PageHeader.vue";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useSession } from "../composables/useSession";
import { useLookups } from "@/composables/useLookups";
const { t } = useI18n();

const showDialog = ref(false);
const selectedRow = ref<any>(null);

const {
    List,
    loading,
    pagination,
    onFilterChange,
    getList,
    terminateSession,
    changePage,
    sort,
    search
} = useSession();
const {
    branchesLookups,
    getBranchLookups,
    getIPLookups,
    IPLookups
} = useLookups();

onMounted(() => {
    Promise.all([(getList(), getBranchLookups(), getIPLookups())])
});

const filtersOperation = computed(() => {
    return [
        {
            placeholder: "activeSessions.allIPAddress",
            value: null,
            field: "allIPAddress",
            options: [
                { label: "activeSessions.allIPAddress", value: null },
                ...IPLookups.value
            ],
        },
        {
            placeholder: "activeSessions.allBranches",
            value: null,
            field: "allBranches",
            options: [
                { label: t("activeSessions.allBranches"), value: null },
                ...branchesLookups.value
            ],
        },
        {
            placeholder: "activeSessions.allStatus",
            value: null,
            field: "status",
            options: [
                { label: t("usersManagement.allStatus"), value: null },
                { label: t("button.active"), value: "IsActive" },
                { label: t("button.inactive"), value: "InActive" },
            ],
        }
    ]
});

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
        { field: 'logoutTime', header: t('activeSessions.lastActivity'), type: "dateTimeDetailed", sortable: true },
        { field: 'actionItem', header: t('activeSessions.action'), type: "slot" },
    ];

    return Columns;
});

const openEndSessionDialog = (row: any) => {
    selectedRow.value = row;
    showDialog.value = true;
};
const handleConfirm = async () => {
    if (!selectedRow.value) return;
    await terminateSession(selectedRow.value.id);
    showDialog.value = false;
    selectedRow.value = null;
};

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="accessControl" subtitle="activeSessions.title" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="activeSessions.title" subtitle="activeSessions.subtitle" :showExport="true"
                    :showFilter="true" @filter-change="onFilterChange"
                    searchPlaceholder="activeSessions.searchPlaceholder" @search="search" :rows="pagination.PageSize"
                    :totalRecords="pagination.total" :first="firstRecord" :last="lastRecord" :filters="filtersOperation"
                      :hasMenu="false"  templateFileUrl="/Session/export" dataFileUrl="/Session/export"
                    templateFileName="session-template.csv" dataFileName="session-data.csv" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="List" :loading="loading" :first="firstRecord" :last="lastRecord"
                    :rows="pagination.PageSize" :totalRecords="pagination.total" @page-change="changePage"
                    @order-change="sort" lazy>
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
                    <template v-slot:["col-actionItem"]="{ data }">
                        <div class="flex items-center gap-2" :class="data.isActive
                            ? 'text-danger-500 cursor-pointer'
                            : 'text-gray-400 cursor-not-allowed opacity-60'"
                            @click="data.isActive && openEndSessionDialog(data)">
                            <VsxIcon iconName="PlayCricle" :size="24" type="linear" />
                            {{ $t("activeSessions.end") }}
                        </div>
                    </template>
                </DynamicTable>
            </template>
        </card>
        <StatusDialog v-model:visible="showDialog" :icon="alertIcon" :title="$t('sessions.title')"
            :description="$t('sessions.desc')" :buttons="[
                { label: $t('button.cancel'), variant: 'ghost', action: 'cancel' },
                { label: $t('button.terminate'), variant: 'danger', action: 'confirm' },
            ]" @confirm="handleConfirm" />
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