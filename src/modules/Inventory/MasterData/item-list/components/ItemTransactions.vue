<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useItem } from "../composables/useItem";
import type { ItemTransaction } from "../types/itemList";

const { t } = useI18n();
const route = useRoute();
const { fetchItemTransactions } = useItem();

const transactions = ref<ItemTransaction[]>([]);
const loading = ref(false);
const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const page = ref(1);
const rows = ref(10);

const id = route.params.id as string;

const loadTransactions = async () => {
  if (!id) return;
  loading.value = true;
  const response = await fetchItemTransactions(id, page.value);
  if (response) {
    transactions.value = response.items;
    totalCount.value = response.totalCount;
    rows.value = response.pageSize;
  }
  loading.value = false;
};

onMounted(() => {
  loadTransactions();
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

const onPageChange = (event: any) => {
  page.value = event.page + 1;
  loadTransactions();
};

const columns = computed(() => {
  return [
    { field: 'date', header: t('itemList.date'), type: 'date' },
    { field: 'warehaouse', header: t('warehouses.title') },
    { field: 'transactionType', header: t('itemList.transactiontype'), type: 'slot', Class: 'custom-badge' }, 
    { field: 'transactionDocNumber', header: t('itemList.transactionNumber') },
    { field: 'qountity', header: t('itemList.quantity') },
    { field: 'balance', header: t('itemList.balance') },
    { field: 'unitCoust', header: t('itemList.unitCost') },
  ];
});

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(); 
};
</script>

<template>
  <div class="card">
    <h1 class="text-lg font-bold text-[#717680] p-4">{{ $t("itemList.recentTransactions") }}</h1>
    <DynamicTable 
      :columns="columns" 
      :data="transactions" 
      :loading="loading"
      :totalRecords="totalCount"
      :rows="rows"
      :first="firstRecord"
       :last="lastRecord"
      :paginator="true"
      :lazy="true"
      @page="onPageChange"
    >
      <template #cell-date="{ data }">
          {{ formatDate(data.date) }}
      </template>
    </DynamicTable>
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