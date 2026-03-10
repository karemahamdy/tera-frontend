<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import alertIcon from "@/assets/images/alert.png";
const { t } = useI18n();
import { usePhysicalCount } from "../composables/usePhysicalCount";
const { deletePhysicalCount, physicalCount, fetchPhysicalCountById, fetchPhysicalCountSerials, PhysicalCountSerials } = usePhysicalCount();
import { formatDateTimeLang } from "@/app/utils/dates";
import type { InventoryCountLine } from "../types/PhysicalCount";

const showDeleteDialog = ref(false);
const isVisible = ref(false);
const selectedItem = ref<null | InventoryCountLine>(null)
const columns = computed(() => {
  const Columns = [
    { field: 'countId', header: t('PhysicalCount.CountID') },
    { field: 'itemName', header: t('table.item') },
    { field: 'warehouseName', header: t('PhysicalCount.warehouse') },
    { field: 'actualQty', header: t('InventoryAdjustment.availableBalance') },
    { field: 'countedQty', header: t('PhysicalCount.Counted') },
    { field: 'varianceQty', header: t('PhysicalCount.Variances') },
    { field: 'serial', header: t('operation.serial') },
  ];
  return Columns;
});

const serialsColumns = computed(() => {
  const Columns = [
    { field: 'mainSerial', header: t('operation.serial') },
    { field: 'actualQty', header: t('PhysicalCount.SystemBalance') },
    { field: 'countedQty', header: t('PhysicalCount.Counted') },
    { field: 'varianceQty', header: t('PhysicalCount.Variances') },
  ];
  return Columns;
});


const getSerail = (data: InventoryCountLine) => {
  isVisible.value = true
  selectedItem.value = data;
  fetchPhysicalCountSerials(physicalCount.value?.id as string, data.id)
};

const handleDeleteConfirm = async () => {
  showDeleteDialog.value = false;
  await deletePhysicalCount(
    physicalCount.value?.id as string,
    false,
  );
};

onMounted(() => {
  fetchPhysicalCountById()
})
</script>

<template>
  <div>
    <ScreenHeader title="inventory" subtitle="operation.title" actionName="PhysicalCount.viewPhysicalCount" />
    <card class="bg-white rounded-[10px]">
      <!-- PageHeader component -->
      <template #title>
        <div class="flex justify-between mb-10">
          <div>
            <div class="flex gap-5 items-center">
              <p class="font-bold">{{ $t("PhysicalCount.newPhysicalCount") }}</p>
              <div class="rounded-lg text-primary-500 bg-primary-50 p-2 text-sm">
                {{ physicalCount?.code }}
              </div>
            </div>
            <p class="text-gray-500">{{ $t("PhysicalCount.CompareSystemStockWithActualPhysicalCount") }}</p>
          </div>
          <div>
            <BaseButton label="button.delete" variant="danger" icon="Trash" @click="showDeleteDialog = true" />
          </div>
        </div>
      </template>
      <!-- DynamicTable component -->
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p class="text-gray-500">{{ $t('PhysicalCount.CountNumber') }}</p>
            <p>{{ physicalCount?.code }}</p>
          </div>
          <div class="mb-5">
            <p class="text-gray-500">{{ $t("itemTransaction.notes") }}</p>
            <p>{{ physicalCount?.notes }}</p>
          </div>
          <div class="mb-5">
            <p class="text-gray-500">{{ $t("PhysicalCount.date") }}</p>
            <p>{{ formatDateTimeLang(physicalCount?.countDate as string, false) }}</p>
          </div>
        </div>
        <div class="my-5">
          <p class="text-xl">
            <strong>{{
              $t("PhysicalCount.LineItems")
            }}</strong>
          </p>
        </div>
        <div>
          <DynamicTable :columns="columns" :data="physicalCount?.lines ?? []" :paginator="false">
            <template v-slot:["col-serial"]="{ data }">
              <VsxIcon v-if="data.hasSerials" class="cursor-pointer text-primary-500" iconName="Eye" :size="24" type="linear"
                @click="getSerail(data as InventoryCountLine)" />
            </template>
          </DynamicTable>
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

    <Dialog v-model:visible="isVisible" modal :style="{ width: '80%' }">
        <div>
            <PageHeader 
              title="PhysicalCount.serialItemSelection" 
              :subtitle="`${selectedItem?.itemName} (${selectedItem?.itemCode})`" 
              :showSearch="false"                     
            />
            <DynamicTable :columns="serialsColumns" :data="PhysicalCountSerials ?? []" :paginator="false">
            <template v-slot:["col-varianceQty"]="{ data }">
              <VsxIcon v-if="data.hasSerials" class="cursor-pointer text-primary-500" iconName="Eye" :size="24" type="linear" />
              <span class="text-danger-500">{{ data.varianceQty }}</span>
            </template>
          </DynamicTable>
        </div>
    </Dialog>
  </div>
</template>
