<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useInventoryAdjustment } from "../composables/useInventoryAdjustment";
import alertIcon from "@/assets/images/alert.png";

const {
  inventoryAdjustment,
  fetchInventoryAdjustmentById,
  deleteInventoryAdjustment,
} = useInventoryAdjustment();

const { t } = useI18n();
const props = defineProps<{
  mode: "view" | "create";
}>();
const showDeleteDialog = ref(false);

const columns = computed(() => {
  const Columns = [
    { field: "countedId", header: t("InventoryAdjustment.countID") },
    { field: "itemName", header: t("InventoryAdjustment.item") },
    { field: "warehouseName", header: t("operation.warehouse") },
    {
      field: "availableQuantity",
      header: t("InventoryAdjustment.availableBalance"),
    },
    { field: "countedQuantity", header: t("InventoryAdjustment.counted") },
    { field: "variance", header: t("InventoryAdjustment.variance") },
  ];

  return Columns;
});

const handleDeleteConfirm = async () => {
  showDeleteDialog.value = false;
  await deleteInventoryAdjustment(
    inventoryAdjustment.value?.id as string,
    false,
  );
};

onMounted(() => {
  fetchInventoryAdjustmentById();
});
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
        <div class="flex justify-between mb-10">
          <div>
            <div class="flex gap-5 items-center">
              <p class="font-bold">
                {{ $t("InventoryAdjustment.newAdjustment") }}
              </p>
              <div
                class="rounded-lg text-primary-500 bg-primary-50 p-2 text-sm"
              >
                {{ `${inventoryAdjustment?.documentNumber}` }}
              </div>
            </div>
            <p class="text-gray-500">
              {{ $t("InventoryAdjustment.subtitle") }}
            </p>
          </div>
          <div>
            <BaseButton
              label="button.delete"
              variant="danger"
              icon="Trash"
              @click="showDeleteDialog = true"
            />
          </div>
        </div>
      </template>
      <!-- DynamicTable component -->
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-gray-500">
              {{ $t("InventoryAdjustment.adjustmentNumber") }}
            </p>
            <p>{{ `${inventoryAdjustment?.documentNumber}` }}</p>
          </div>
          <div>
            <p class="text-gray-500">{{ $t("InventoryAdjustment.reason") }}</p>
            <p>{{ `${inventoryAdjustment?.adjustmentReason}` }}</p>
          </div>
        </div>
        <div class="my-5">
          <p class="text-xl">
            <strong>{{ $t("InventoryAdjustment.itemToAdjustment") }}</strong>
          </p>
        </div>
        <div>
          <DynamicTable
            :columns="columns"
            :data="inventoryAdjustment?.lines ?? []"
            :paginator="false"
          />
        </div>
      </template>
    </card>

    <StatusDialog
      v-model:visible="showDeleteDialog"
      :icon="alertIcon"
      :title="$t('InventoryAdjustment.deleteConfirm')"
      :buttons="[
        { label: $t('button.cancel'), variant: 'ghost', action: 'cancel' },
        { label: $t('button.delete'), variant: 'danger', action: 'confirm' },
      ]"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>
