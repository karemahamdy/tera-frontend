<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  visible: boolean;
  items: any[];
  selectedRows: any[];
}>();

const emit = defineEmits(["update:visible", "select"]);

const searchQuery = ref("");

const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

const selectItem = (item: any) => {
  isVisible.value = false;
  emit("select", item);
};

const selectedRowsLocal = computed({
  get: () => props.selectedRows,
  set: (value) => emit("select", value),
});

const columns = computed(() => {
  return [
    {
      field: "WaybillId",
      header: t("purchaseWaybill.WaybillId"),
      sortable: true,
    },
    { field: "customer", header: t("salesWaybill.customer"), sortable: true },
    {
      field: "date",
      header: t("salesWaybill.date"),
      sortable: true,
      type: "date",
    },
    { field: "items", header: t("salesWaybill.items"), sortable: true },
    { field: "Returned", header: t("purchaseReturn.returned"), sortable: true },
    { field: "action", header: "" },
  ];
});

const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items;
  const query = searchQuery.value.toLowerCase();
  return props.items.filter(
    (item: any) =>
      item.code?.toLowerCase().includes(query) ||
      item.name?.toLowerCase().includes(query),
  );
});
</script>

<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    :header="t('purchaseReturn.selectOriginalWaybill')"
    :style="{ width: '60vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <div>
      <div class="overflow-hidden rounded-lg border border-gray-100">
        <DynamicTable
          :columns="columns"
          :data="filteredItems"
          :paginator="true"
          :rows="5"
          :showView="false"
          :showEdit="false"
          :showDelete="false"
          v-model:selectedRows="selectedRowsLocal"
          hasSelection
        >
        </DynamicTable>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
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
