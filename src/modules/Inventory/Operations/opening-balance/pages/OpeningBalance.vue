<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from "@/assets/images/alert.png";
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useOpeningBalance } from "../composables/useOpeningBalance";
import { useLookups } from "@/composables/useLookups";

const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);
const {
  loading,
  pageIndex,
  pageSize,
  totalCount,
  onSearch,
  onSort,
  setPage,
  onFilterChange,
  fetchOpeningBalance,
  apiOpeningBalance,
} = useOpeningBalance();
const { warehouseLookup, unitsLookups, getUnitsLookups, getWarehouseLookups } =
  useLookups();

const filtersOperation = computed(() => {
  return [
    {
      placeholder: "items.uom",
      value: null,
      field: "UoM",
      options: [
        { label: t("button.all"), value: null },
        ...unitsLookups.value
      ],
    },
    {
      placeholder: "warehouses.title",
      value: null,
      field: "WarehouseFilter",
      options: [
        { label: t("button.all"), value: null },
        ...warehouseLookup.value
      ],
    },
  ];
});

const columns = computed(() => {
  const Columns = [
    { field: "code", header: t("OpeningBalance.OBID"), sortable: true },
    {
      field: "date",
      header: t("OpeningBalance.date"),
      type: "date",
      sortable: true,
    },
    {
      field: "itemCode",
      header: t("OpeningBalance.ItemName"),
      type: "slot",
      sortable: true,
    },
    {
      field: "warehouse",
      header: t("OpeningBalance.warehouse"),
      type: "slot",
      sortable: true,
    },
    { field: "zoneCode", header: t("OpeningBalance.zone"), sortable: true },
    {
      field: "uom",
      header: t("OpeningBalance.Uom"),
      type: "slot",
      sortable: true,
    },
    { field: "quantity", header: t("OpeningBalance.Quantity"), sortable: true },
    {
      field: "unitCost",
      header: t("OpeningBalance.UnitCost"),
      type: "slot",
      sortable: true,
    },
    {
      field: "totalValue",
      header: t("OpeningBalance.TotalValue"),
      sortable: true,
    },
    { field: "action", header: t("action") },
  ];

  return Columns;
});

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

const handleActionMenu = async (payload: any) => {
  const action = payload.action || payload;
  const data = payload.data || payload.row || payload;
  if (action === "edit") {
    router.push({
      name: "OpeningBalanceEdit",
      params: { id: 10 },
    });
  }
  if (action === "delete") {
    confirmDelete(data);
  }
};

const handleDeleteConfirm = async () => {
  if (!rowToDelete.value) return;
  isDeleting.value = true;
  // await deleteOpeningBalance(rowToDelete.value.id).finally(() => {
  //     isDeleting.value = false;
  //     showDeleteDialog.value = false;
  //     rowToDelete.value = null;
  // });
};

const addPurchaseWaybill = () => {
  router.push({ name: "OpeningBalanceCreate" });
};

onMounted(() => {
  Promise.all([
    (fetchOpeningBalance(), getUnitsLookups(), getWarehouseLookups()),
  ]);
});
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader
      t
      title="inventory"
      subtitle="operation.title"
      actionName="OpeningBalance.OpeningBalance"
    />
    <card class="bg-white rounded-[10px]">
      <!-- PageHeader component -->
      <template #title>
        <PageHeader
          title="OpeningBalance.OpeningBalance"
          subtitle="OpeningBalance.subtitle"
          :showExport="false"
          :showImport="false"
          :mainBtn="true"
          mainBtnText="OpeningBalance.addNew"
          :showFilter="true"
          :filters="filtersOperation"
          @filter-change="onFilterChange"
          searchPlaceholder="OpeningBalance.searchPlaceholder"
          @search="onSearch"
          :onMainBtnClick="addPurchaseWaybill"
        />
      </template>
      <!-- DynamicTable component -->
      <template #content>
        <DynamicTable
          :columns="columns"
          :data="apiOpeningBalance"
          :loading="loading"
          @action-menu-click="handleActionMenu"
          :showDelete="true"
          @page-change="setPage"
          @order-change="
            (payload: any) => onSort(payload.orderBy, payload.direction)
          "
          :first="firstRecord"
          :last="lastRecord"
          :rows="pageSize"
          :totalRecords="totalCount"
          @search="onSearch"
          lazy
        />
      </template>
    </card>

    <StatusDialog
      v-model:visible="showDeleteDialog"
      :icon="alertIcon"
      :title="$t('OpeningBalance.deleteConfirm')"
      :buttons="[
        { label: $t('button.cancel'), variant: 'ghost', action: 'cancel' },
        { label: $t('button.delete'), variant: 'danger', action: 'confirm' },
      ]"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 16px;
  color: var(--color-gray-500);
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #faf9f9;
  font-weight: 600;
  color: var(--color-gray-700);
  font-size: 13px;
  padding: 20px 16px;
}
</style>
