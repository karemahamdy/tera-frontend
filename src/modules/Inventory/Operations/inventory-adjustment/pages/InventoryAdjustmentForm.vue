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
const selectedRows = ref([]);
</script>

<template>
  <div>
    <ScreenHeader
      title="inventory"
      subtitle="operation.title"
      actionName="InventoryAdjustment.InventoryAdjustment"
    />
    <card class="bg-white rounded-[10px]">
      <!-- PageHeader component -->
      <template #title>
        <PageHeader
          title="InventoryAdjustment.createNewAdjustment"
          subtitle="InventoryAdjustment.subtitle"
          :showSearch="false"
        />
      </template>
      <!-- DynamicTable component -->
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormDropdown
            class="w-full"
            :label="$t('InventoryAdjustment.adjustmentNumber')"
            :options="[]"
            optionValue="value"
            :placeholder="$t('InventoryAdjustment.adjustmentNumber')"
          />
          <FormDropdown
            class="w-full"
            :label="$t('InventoryAdjustment.reason')"
            :options="[]"
            optionValue="value"
            :placeholder="$t('InventoryAdjustment.reason')"
          />
        </div>
        <div class="my-5">
          <p class="text-xl">
            <strong>{{
              $t("InventoryAdjustment.selectItemToAdjustment")
            }}</strong>
          </p>
        </div>
        <div>
          <DynamicTable
            :columns="columns"
            :data="data"
            v-model:selectedRows="selectedRows"
            :paginator="false"
            hasSelection
          />
        </div>

        <div class="w-full mt-5">
          <label class="text-gray-700 font-medium mb-2 block">
            {{ $t("itemTransaction.notes") }}
          </label>

          <Textarea
            :placeholder="$t('itemTransaction.notesPlaceholder')"
            class="mt-1 w-full p-3 border rounded-lg"
            rows="3"
          />
        </div>
      </template>
    </card>
    <div class="w-full flex justify-end">
        <div class="flex gap-4 mt-5 w-1/2">
          <BaseButton
            label="button.cancel"
            variant="ghost"
            block
            :to="{ name: 'BranchManagement' }"
          />
          <BaseButton type="submit" label="InventoryAdjustment.createAdjustment" variant="primary" block />
        </div>
    </div>
  </div>
</template>
