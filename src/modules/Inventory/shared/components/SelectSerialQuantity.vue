<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import { useInventoryLookups } from "@/composables/useInventoryLookups";

const { t } = useI18n();
const { getItemSerials, serialsLookups } = useInventoryLookups();

const props = defineProps<{
  visible: boolean;
  item: any;
}>();

const emit = defineEmits(["update:visible", "select"]);

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
    { field: "mainSerial", header: t("serial.serial") },
    { field: "availableQuantity", header: t("PhysicalCount.SystemBalance") },
    { field: "CountedQTY", header: t("PhysicalCount.CountedQTY") },
    { field: "variances", header: t("PhysicalCount.Variances") },
  ];
});
const filteredItems = computed(() => {
  return serialsLookups.value
});

const setSelectedRows = (rows: any[]) => {
  selectedRowsLocal.value = rows;
};

defineExpose({
  setSelectedRows,
});

const fetchSerials = async () => {
  if (props.item?.itemId && props.item?.warehouseId) {
    await getItemSerials(
      props.item.itemId,
      props.item?.warehouseId,
      props.item?.zoneId,
      props.item?.locationId,
    );
  }
};

onMounted(() => {
  fetchSerials();
});
</script>

<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    :header="t('serial.selectSerialAndQuantity')"
    :style="{ width: '60vw' }"
    :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
  >
    <div>
      <p class="mb-3">{{ item?.itemName }}</p>
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
          dataKey="mainSerial"
          hasSelection
        >
          <template #col-CountedQTY="{ data }">
            <div>
              <InputNumber v-model="data.countedQty" :min="1" />
            </div>
          </template>

          <template #col-variances="{ data }">
            <div :class="{'text-danger-500':  (data.countedQty -  data.availableQuantity) < 0}">
              {{ (data.countedQty -  data.availableQuantity) || 0 }}
            </div>
          </template>
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
