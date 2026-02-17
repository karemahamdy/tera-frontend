<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps<{
  mode: "view" | "create";
}>();

const columns = computed(() => {
  const Columns = [
    { field: "countID", header: t("InventoryAdjustment.countID") },
    { field: "item", header: t("InventoryAdjustment.item") },
    { field: "warehouse", header: t("operation.warehouse") },
    {
      field: "availableBalance",
      header: t("InventoryAdjustment.availableBalance"),
    },
    { field: "counted", header: t("InventoryAdjustment.counted") },
    { field: "variance", header: t("InventoryAdjustment.variance") },
  ];

  return Columns;
});

const data = ref([
  {
    countID: "C-001",
    item: "Laptop Dell XPS 15",
    warehouse: "WH-044",
    availableBalance: 50,
    counted: 50,
    variance: 0,
  },
]);
</script>

<template>
  <div>
    <ScreenHeader title="inventory" subtitle="operation.title" actionName="InventoryAdjustment.InventoryAdjustment" />
    <card class="bg-white rounded-[10px]">
      <!-- PageHeader component -->
      <template #title>
        <div class="flex justify-between mb-10">
          <div>
            <div class="flex gap-5 items-center">
              <p class="font-bold">{{ $t("InventoryAdjustment.newAdjustment") }}</p>
              <div class="rounded-lg text-primary-500 bg-primary-50 p-2 text-sm">
                ADJ-045
              </div>
            </div>
            <p class="text-gray-500">{{ $t("InventoryAdjustment.subtitle") }}</p>
          </div>
          <div>
            <BaseButton label="button.delete" variant="danger" icon="Trash" />
          </div>
        </div>
      </template>
      <!-- DynamicTable component -->
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-gray-500">{{ $t('InventoryAdjustment.adjustmentNumber') }}</p>
            <p>ADJ-045</p>
          </div>
          <div>
            <p class="text-gray-500">{{ $t('InventoryAdjustment.reason') }}</p>
            <p>ADJ-045</p>
          </div>
        </div>
        <div class="my-5">
          <p class="text-xl">
            <strong>{{
              $t("InventoryAdjustment.itemToAdjustment")
            }}</strong>
          </p>
        </div>
        <div>
          <DynamicTable :columns="columns" :data="data" :paginator="false" />
        </div>
      </template>
    </card>
  </div>
</template>
