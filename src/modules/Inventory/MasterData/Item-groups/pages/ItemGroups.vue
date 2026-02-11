<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { useItemGroup } from "../composables/useItemGroup";

const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const {
    fetchItemGroups,
    deleteItemGroup,
    apiItemGroups,
    loading,
    onSearch,
    importItemGroup,
    onSort,
    setPage,
    pageIndex,
    pageSize,
    totalCount,
    clearSearch,
} = useItemGroup();

const customItems = [
    {
        slot: true,
        label: t("button.view"),
        icon: "Eye",
        color: "#3F5FAC",
        action: 'view',
    },
];

onMounted(() => {
    const levelNum = Number(route.query.level || 1);
    fetchItemGroups(1, levelNum);
});

const tabs = computed(() => [
    { label: t('itemGroup.categories'), level: "Category" },
    { label: t('itemGroup.group1'), level: "Group1" },
    { label: t('itemGroup.group2'), level: "Group2" },
    { label: t('itemGroup.group3'), level: "Group3" },
    { label: t('itemGroup.group4'), level: "Group4" },
]);

const currentLevelString = computed(() => {
    const levelNum = Number(route.query.level || 1);
    const levelMap: Record<number, string> = { 1: 'Category', 2: 'Group1', 3: 'Group2', 4: 'Group3', 5: 'Group4' };
    return levelMap[levelNum] || 'Category';
});

const activeIndex = computed(() =>
    tabs.value.findIndex(tab => tab.level === currentLevelString.value)
);

const headerTitle = computed(() => {
    const tab = tabs.value.find(t => t.level === currentLevelString.value);
    return tab ? tab.label : '';
});

const columns = computed(() => [
    { field: 'code', header: t('itemGroup.code'), sortable: true },
    { field: 'name', header: t('itemGroup.name'), sortable: true },
    { field: 'description', header: t('itemGroup.description'), sortable: true },
    { field: 'itemsCount', header: t('itemGroup.itemsCount'), sortable: true },
    { field: 'action', header: t('action') },
]);

const onTabChange = (e: any) => {
    const tab = tabs.value[e.index];
    if (!tab) return;
    const level = tab.level;
    const levelMap: Record<string, number> = { 'Category': 1, 'Group1': 2, 'Group2': 3, 'Group3': 4, 'Group4': 5 };
    clearSearch();
    router.replace({ query: { level: levelMap[level] } });
};

const firstRecord = computed(() => {
    if (!totalCount.value || totalCount.value === 0) return 0;
    return (pageIndex.value - 1) * pageSize.value + 1;
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

const handleActionMenu = (payload: any) => {
    const action = payload.action || payload;
    const row = payload.row || payload.data  || payload; 
    if (action === 'delete') confirmDelete(row);
    if (action === 'edit') {
        router.push({
            name: "ItemGroupsEdit",
            params: { id: row.id },
            query: { level: route.query.level || 1 },
        });
    }
    if (action === 'view') {
        router.push({
            name: "ItemGroupView",
            params: { id: row.id },
            query: { level: route.query.level || 1 },
        });
    }
};

const handleDeleteConfirm = async () => {
    if (!rowToDelete.value) return;
    isDeleting.value = true;
    try {
        showDeleteDialog.value = false;
        await deleteItemGroup(rowToDelete.value.id);
        rowToDelete.value = null;
    } catch (error) {
        console.error(error);
    } finally {
        isDeleting.value = false;
    }
};

const addItemGroup = () => {
    router.push({
        name: "ItemGroupsCreate",
        query: { level: route.query.level || 1 },
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
                    :mainBtn="true" mainBtnText="itemGroup.additemGroup" @search="onSearch"
                    searchPlaceholder="itemGroup.searchPlaceholder" :onMainBtnClick="addItemGroup" hasMenu
                    :templateFileUrl="`/ItemClassifications/import-template/${currentLevelString}`"
                    :dataFileUrl="`/ItemClassifications/export/${currentLevelString}`"
                    templateFileName="item-group-template.csv" dataFileName="item-group-data.csv"
                    @upload="importItemGroup" />
            </template>
            <template #content>
                <DynamicTable :key="currentLevelString" :columns="columns" :data="apiItemGroups"
                    :customItems="customItems" :showDelete="true" :loading="loading"
                    @action-menu-click="handleActionMenu" @page-change="setPage" :first="firstRecord" :last="lastRecord"
                    :rows="pageSize" :totalRecords="totalCount" @search="onSearch"
                    @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" lazy />
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