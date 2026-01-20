<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";

const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const emit = defineEmits(['search', 'action-menu-click']);

const props = defineProps({
    data: {
        type: Array,
        default: () => [
            {
                code: "WH-001",
                name: "John Moore",
                transferLedger: "5",
                zones: "Administration",
                address: "Finance",
                type: "Global",
                status: "in Active",
            },
            {
                code: "WH-001",
                name: "John Moore",
                transferLedger: "5",
                zones: "Administration",
                address: "Finance",
                type: "Professional",
                status: "Active",
            },
        ],
    },
});
const tabs = computed(() => [
    { label: t('itemGroup.categories'), level: 1 },
    { label: t('itemGroup.group1'), level: 2 },
    { label: t('itemGroup.group2'), level: 3 },
    { label: t('itemGroup.group3'), level: 4 },
    { label: t('itemGroup.group4'), level: 5 },
]);

const currentLevel = computed(() => Number(route.query.level || 1));

const activeIndex = computed(() =>
    tabs.value.findIndex(tab => tab.level === currentLevel.value)
);

const onTabChange = (e: any) => {
    const tab = tabs.value[e.index]; 
    if (!tab) return;
    const level = tab.level;
    router.replace({ query: { level } });
};


const headerTitle = computed(() => {
    const tab = tabs.value.find(t => t.level === currentLevel.value);
    return tab ? tab.label : '';
});

const customItems = [
    {
        slot: true,
        label: t("button.view"),
        icon: "Eye",
        color: "#3F5FAC",
        command: (row: any) => {
            router.push({ name: "ItemGroupView", params: { id: row.id } });
        },
    },
];

const columns = computed(() => [
    { field: 'code', header: t('itemGroup.code'), sortable: true },
    { field: 'name', header: t('itemGroup.name'), sortable: true },
    { field: 'isActive', header: t('status'), type: 'slot' },
    { field: 'action', header: t('action') },
]);

const confirmDelete = (row: any) => {
    rowToDelete.value = row;
    showDeleteDialog.value = true;
};

const handleActionMenu = (payload: any) => {
    const action = payload.action || payload;
    const row = payload.row || payload;

    if (action === 'delete') confirmDelete(row);
    if (action === 'edit') {
        router.push({
            path: `/inventory/item-groups/edit/${row.id}`,
            query: { level: currentLevel.value },
        });
    }
};

const handleDeleteConfirm = async () => {
    if (!rowToDelete.value) return;
    isDeleting.value = true;
    try {
        // await deleteItemGroup(rowToDelete.value.id);
        showDeleteDialog.value = false;
        rowToDelete.value = null;
    } catch (error) {
        console.error(error);
    } finally {
        isDeleting.value = false;
    }
};

const addItemGroup = () => {
    router.push({
        path: '/item-groups/create',
        query: { level: currentLevel.value },
    });
};
</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="inventory" subtitle="masterData" :actionName="headerTitle" />
        <TabMenu :model="tabs" :activeIndex="activeIndex" @tab-change="onTabChange" />
        <card class="bg-white rounded-[10px]" style="border-top-left-radius: 0px; border-top-right-radius: 0px;">
            <template #title>
                <PageHeader :title="headerTitle" subtitle="itemGroup.subtitle" :showExport="true" :showImport="true"
                    :mainBtn="true" mainBtnText="itemGroup.additemGroup" searchPlaceholder="itemGroup.searchPlaceholder"
                    :onMainBtnClick="addItemGroup" />
            </template>
            <template #content>
                <DynamicTable :key="currentLevel" :columns="columns" :data="data" :customItems="customItems"
                    :showDelete="true" @action-menu-click="handleActionMenu" />
            </template>
        </card>
        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon" :title="$t('itemGroup.deleteItemConfirm')"
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
    color: var(--color-gray-500);
    font-size: 13px;
    padding: 20px 16px;
}

:deep(.p-tabmenu-tablist) {
    display: flex;
    margin: 0;
    padding: 4px;
    list-style-type: none;
    background: #D6E0FF;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

:deep(.p-tabmenu-item-active .p-tabmenu-item-link) {
    background: var(--p-tabmenu-item-active-background);
    border-color: #3F5FAC;
    color: #3F5FAC;
}

:deep(.p-tabmenu-active-bar) {
    z-index: 1;
    display: block;
    position: absolute;
    bottom: var(--p-tabmenu-active-bar-bottom);
    height: var(--p-tabmenu-active-bar-height);
    background: transparent;
    transition: 250ms cubic-bezier(0.35, 0, 0.25, 1);
}
</style>
