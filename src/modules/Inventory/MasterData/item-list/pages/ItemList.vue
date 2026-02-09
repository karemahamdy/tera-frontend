<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import ItemsInfo from "../components/ItemsInfo.vue";
import { useItem } from "../composables/useItem";
import { useLookups } from "@/composables/useLookups";


const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);

const { loading, toggleActive, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, apiItem, fetchItem, deleteItem, importItem, exportItem, onFilterChange } = useItem();
const { warehouseLookup, itemGroupLookups, getWarehouseLookups, getItemGroupLookups } = useLookups();  

onMounted(() => {
    Promise.all([
        fetchItem(),
        getWarehouseLookups(),
        getItemGroupLookups()
    ]);
});

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
        action: "view",
    },
    {
        slot: true,
        label: t("button.hold"),
        icon: "Lock",
        color: "#F04438",
        action: "hold",
    },
];

const filtersOperation = computed(() => {
    return [
        {
            placeholder: "activeSessions.allStatus",
            value: null,
            field: "isActive",
            isSingle: true,
            options: [
                { label: t("button.all"), value: " " },
                { label: t("button.active"), value: "IsActive" },
                { label: t("button.inactive"), value: "InActive" },
            ],
        },
        {
            placeholder: "items.category",
            value: null,
            field: "itemGroup",
            options: [
                { label: t("button.all"), value: " " },
                 ...itemGroupLookups.value
            ],
        },
        {
            placeholder: "warehouses.title",
            value: null,
            field: "Warehouse",
            options: [
                { label: t("button.all"), value: " " },
                ...warehouseLookup.value
            ],
        },
    ]
});

const columns = computed(() => {
    const Columns = [
        { field: 'name', header: t('itemList.itemName'),type: 'slot',  sortable: true },
        { field: 'code', header: t('itemList.itemCode'), type: 'slot', sortable: true },
        { field: 'itemGroupName', header: t('items.category'), type: 'slot', sortable: true, Class: 'custom-badge' },
        { field: 'baseUnitName', header: t('itemList.UOM'), sortable: true },
        { field: 'wareHouse', header: t('itemList.warehouse'), sortable: true },
        { field: 'isActive', header: t('status'), type: 'status', sortable: true },
        { field: 'action', header: t('action') }
    ];

    return Columns;
});

const firstRecord = computed(() => {
    return ((pageIndex.value - 1) * pageSize.value) + 1;
});

const lastRecord = computed(() => {
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
    if (action === "edit") {
        if (data && data.id) {
            handleEdit(data);
        }
    }
    if (action === 'delete') {
        confirmDelete(data);
    }
       if (action === 'view') {
        router.push({
            name: "ItemView",
            params: { id: data.id },
        });
    }
    if (action === "toggleActive") {
        if (loading.value) return;
        await toggleActive(data.id, !data.isActive);
    }
};

const handleDeleteConfirm = async () => {
    if (!rowToDelete.value) return;
    isDeleting.value = true;
    await deleteItem(rowToDelete.value.id).finally(() => {
        isDeleting.value = false;
        showDeleteDialog.value = false;
        rowToDelete.value = null;
    });
};

const handleEdit = (row: any) => {
    router.push(`/item-management/edit/${row.id}`);
};

const addBranch = () => {
    router.push('/item-management/create');
};

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="inventory" subtitle="masterData" actionName="itemList.itemList" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="itemList.title" subtitle="itemList.subtitle" :showExport="true" :showImport="true"
                    :mainBtn="true" mainBtnText="itemList.addItem" :showMultiFilter="true" :filters="filtersOperation"
                    searchPlaceholder="itemList.searchPlaceholder" @search="onSearch" :onMainBtnClick="addBranch"
                    hasMenu @upload="importItem" :onExportData="exportItem" @filter-change="onFilterChange"
                    templateFileUrl="/Item/DownloadImportTemplate" templateFileName="Items-data.csv"
                    dataFileName="Items-data.csv">
                    <template #middle>
                        <ItemsInfo />
                    </template>
                </PageHeader>
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="apiItem" :loading="loading" :customItems="customItems"
                    @action-menu-click="handleActionMenu" :showDelete="true" @page-change="setPage"
                    @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount" @search="onSearch" lazy>
                    <template v-slot:["col-name"]="{ data }">
                         <div class="flex items-center gap-2 rounded">
                        <Badge v-if="data.tracked" severity="success" class="circle-badge-sm">
                            <VsxIcon iconName="Airdrop" :size="20" type="linear" />
                        </Badge>
                        <Badge v-else severity="transparent" class="circle-badge">
                            <VsxIcon iconName="Airdrop" :size="20" type="linear" class="icon-transparent" />
                        </Badge>
                        <div class="text-base text-gray-700">{{ data.name }}</div>
                        </div>
                    </template>
                </DynamicTable>

            </template>
        </card>

        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon" :title="$t('itemList.deleteItemConfirm')"
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
.circle-badge-sm {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
}
.circle-badge {
 background-color: transparent;
}
.icon-transparent {
  color: transparent; 
}
</style>