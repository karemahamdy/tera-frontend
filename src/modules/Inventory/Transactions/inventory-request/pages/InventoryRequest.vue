<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useInventoryRequest } from "../composables/useInventoryRequest";
import RulesCard from "@/sharedComponents/RulesCard.vue";


const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const { loading, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, onFilterChange } = useInventoryRequest();

const rules = [
  "RequestRules.department",    
  "RequestRules.items",          
  "RequestRules.serialLot",         
];

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      {
        requestId: "PW-2026-001",
        requestedBy: "#001",
        date: "Oct 11, 2025",
        reason: "ABC Industrial Supplies",
        items: 5,
        type: "Transfer"
      },
      {
        requestId: "PW-2026-001",
        requestedBy: "#001",
        date: "Oct 11, 2025",
        reason: "ABC Industrial Supplies",
        items: 5,
        type: "Inbound"
      },
      {
        requestId: "PW-2026-001",
        requestedBy: "#001",
        date: "Oct 11, 2025",
        reason: "ABC Industrial Supplies",
        items: 5,
        type: "Outbound"
      },
    ],
  },
});
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
    // fetchInventoryRequest();
});
const filtersOperation = computed(() => {
    return [
        {
            placeholder: "inventoryRequest.allTypes",
            value: null,
            field: "type",
            options: [
                { label: t("inventoryRequest.allTypes"), value: null },
                { label: t("inventoryRequest.inbound"), value: "inbound" },
                { label: t("inventoryRequest.outbound"), value: "outbound" },
                { label: t("inventoryRequest.transfer"), value: "transfer" },
            ],
        }
    ]
});

const columns = computed(() => {
    const Columns = [ 
        { field: 'requestId', header: t('inventoryRequest.requestId'), sortable: true },
        { field: 'requestedBy', header: t('inventoryRequest.requestedBy'), sortable: true },
        { field: 'type', header: t('inventoryRequest.type'), type: 'slot', sortable: true },
        { field: 'date', header: t('inventoryRequest.date'), type: 'date', sortable: true },
        { field: 'items', header: t('inventoryRequest.items'), sortable: true },
        { field: 'reason', header: t('inventoryRequest.reason'), sortable: true },
        { field: 'action', header: t('inventoryRequest.action'), type: 'action', sortable: false },
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
            name: "InventoryRequestFormEdit",
            params: { id: data.id },
        });
    }
    if (action === 'view') {
        router.push({
            name: "InventoryRequestFormView",
            params: { id: data.id },
        });
    }
    if (action === 'delete') {
        confirmDelete(data);
    }
};

const addInventoryRequest = () => {
    router.push({name: 'InventoryRequestCreate' });
};
</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="inventory" subtitle="inventoryRequest.transaction" actionName="inventoryRequest.inventoryRequest" />
        <card class="bg-white rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="inventoryRequest.inventoryRequest" subtitle="inventoryRequest.description" :showExport="false"
                    :showImport="false" :mainBtn="true" mainBtnText="inventoryRequest.newRequest" :showFilter="true"
               :filters="filtersOperation" @filter-change="onFilterChange"
                    searchPlaceholder="inventoryRequest.searchPlaceholder" @search="onSearch" :onMainBtnClick="addInventoryRequest" 
                    />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="data" :loading="loading" :customItems="customItems"
                    @action-menu-click="handleActionMenu" :showDelete="true" @page-change="setPage" @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount"  @search="onSearch" lazy >
                    <template  v-slot:["col-type"]="{ data }">
                        <div v-if="data.type === 'Transfer'" class="flex align-items-center justify-center rounded gap-1 p-1 text-sm bg-primary-50 text-primary-500">
                            <VsxIcon iconName="ArrowSwapHorizontal" type="linear" />
                            <span>{{ $t("inventoryRequest.transfer") }}</span>
                        </div>
                        <div v-else-if="data.type === 'Inbound'" class="flex align-items-center justify-center rounded gap-1 p-1 text-sm bg-success-50 text-success-500">
                            <VsxIcon iconName="ArrowDown" type="linear" />
                            <span>{{ $t("inventoryRequest.inbound") }}</span>
                        </div>
                        <div v-else-if="data.type === 'Outbound'" class="flex align-items-center justify-center rounded gap-1 p-1 text-sm bg-danger-50 text-danger-500">
                            <VsxIcon iconName="ArrowUp" type="linear" />
                            <span>{{ $t("inventoryRequest.outbound") }}</span>
                        </div>
                    </template>
                    <template  v-slot:["col-requestId"]="{ data }">
                        <span class="text-primary-500 cursor-pointer underline" @click="handleActionMenu({ action: 'view', data })">{{ data.requestId }}</span>
                    </template>
                    </DynamicTable>
                <RulesCard title="RequestRules.ruleHeader" :items="rules" color="primary" />
              
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
.status-active {
  background: var(--color-success-500);
  outline: 1px solid var(--color-success-500);
}

.status-inactive {
  background: var(--color-warning-500);
  outline: 1px solid var(--color-warning-500);
}

.status-text-active {
  color: var(--color-success-500);
}

.status-text-inactive {
  color: var(--color-warning-500);
}
</style>