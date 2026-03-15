<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  visible: boolean;
  items: any[];
}>();

const emit = defineEmits(["update:visible", "select"]);

const searchQuery = ref("");

const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

const selectItem = () => {
  isVisible.value = false;
  emit("select", selectedRowsLocal.value);
};

const selectedRowsLocal = ref<any[]>([]);

const columns = computed(() => {
  return [
    { field: "serial", header: t("serial.serial") },
    { field: "Balance", header: t("PhysicalCount.SystemBalance") },
    { field: "CountedQTY", header: t("PhysicalCount.CountedQTY") },
    { field: "variances", header: t("PhysicalCount.Variances") },
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

const setSelectedRows = (rows: any[]) => {
  selectedRowsLocal.value = rows;
};

defineExpose({
  setSelectedRows,
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
      <div class="col-span-2 flex gap-1 mt-5">
        <BaseButton
          label="button.cancel"
          variant="ghost"
          block
          @click="isVisible = false"
        />
        <BaseButton
          label="locationPicker.confirmSelection"
          variant="primary"
          block
          @click="selectItem"
        />
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
