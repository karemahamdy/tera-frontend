<script setup>
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import PageHeader from "@/sharedComponents/PageHeader.vue";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useSearch } from "@/composables/useSearch";
import { useFilters } from "@/composables/useFilters";

const { t } = useI18n();
const router = useRouter();
const loading = ref(false);
const showDeleteDialog = ref(false);
const rowToDelete = ref(null);

const props = defineProps({
    data: {
        type: Array,
        default: () => [
            {
                id: 1,
                user: 'Mick Taylor',
                email: "john@tera.com",
                img: "https://i.pravatar.cc/40",
                branch: 'Cairo',
                ipAddress: '192.168.1.100',
                device: "Edge 120.0 / Windows 11",
                status: "Active",
                loginTime: '5 Hours',
                lastActivity: '22d ago',
            },
        ]
    },
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

const emit = defineEmits(['search']);
const { onSearch, filteredData } = useSearch(props.data);
const { filters, filteredData: filteredByFilters, onFilterChange } = useFilters(props.data, filtersOperation);

const columns = computed(() => {
    const Columns = [
        { field: 'user', header: t('activeSessions.user'), sortable: true, type: "slot" },
        { field: 'branch', header: t('activeSessions.branch'), sortable: true, type: "badge", Class: "custom-badge", },
        { field: 'ipAddress', header: t('activeSessions.ipAddress'), sortable: true },
        { field: 'device', header: t('activeSessions.device'), sortable: true },
        { field: 'status', header: t('activeSessions.status'), sortable: true },
        { field: 'loginTime', header: t('activeSessions.loginTime'), sortable: true },
        { field: 'lastActivity', header: t('activeSessions.lastActivity'), sortable: true },
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
                    searchPlaceholder="activeSessions.searchPlaceholder" @search="onSearch" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="filteredData" :loading="loading">
                    <template #col-user="{ data }">
                        <div class="flex items-center gap-2">
                            <Avatar :image="data.img" shape="circle" />
                            <span>
                                <span class="font-semibold">{{ data.user }}</span>
                                <br />
                                <small class="text-sm text-admin-muted">{{ data.email }}</small>
                            </span>
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