<script lang="ts" setup>
import { reactive, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n"
import { useInventoryLookups } from "@/composables/useInventoryLookups"
import type { WarehouseDetailsData } from "../types/PurchaseWaybill";

const props = withDefaults(defineProps<{
  warehouseDetails?: WarehouseDetailsData | null;
  disabled?: boolean;
  errors?: Record<string, string>;
}>(), {
  warehouseDetails: null,
  disabled: false,
  errors: () => ({}),
});

const { t } = useI18n()
const emit = defineEmits(["update"])
const { WarehouseLookups, ZonesLookups, getZonesLookups, getWarehouseLookups } = useInventoryLookups()

const form = reactive({
  warehouseId: props.warehouseDetails?.warehouseId ?? "",
  zoneId: props.warehouseDetails?.zoneId ?? null as string | null,
});



const selectedWarehouse = computed(() =>
  WarehouseLookups.value.find(w => w.value === form.warehouseId)
);

const isProf = computed(() => selectedWarehouse.value?.type === 'Professional');

function emitUpdate() {
  if (props.disabled) return;
  emit("update", {
    warehouseId: form.warehouseId,
    zoneId: form.zoneId,
  });
}

async function onWarehouseChange(val: string) {
  form.warehouseId = val;
  const wh = WarehouseLookups.value.find(w => w.value === val);
  if (wh?.type === 'Professional') {
    await getZonesLookups(val);
  } else {
    form.zoneId = null;
  }
  emitUpdate();
}

function onZoneChange(val: string | null) {
  form.zoneId = val;
  emitUpdate();
}



onMounted(async () => {
  await getWarehouseLookups();

  if (props.warehouseDetails?.warehouseId && props.warehouseDetails?.zoneId) {
    await getZonesLookups(props.warehouseDetails.warehouseId);
  }
});
</script>

<template>
  <div class="flex flex-col">
    <h2 class="heading-title">{{ t("purchaseWaybill.WarehouseDetails") }}</h2>
    <p class="subheading-title">{{ t("purchaseWaybill.WarehouseDetailsDesc") }}</p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <FormDropdown v-if="!disabled" :label="t('purchaseWaybill.ReceivingWarehouse')" :modelValue="form.warehouseId"
      :error="props.errors?.warehouseId" :placeholder="t('purchaseWaybill.ReceivingWarehousePlaceholder')"
      :invalid="!!props.errors?.warehouseId" :options="WarehouseLookups" @update:modelValue="onWarehouseChange" />
    <FormInput v-else :label="t('purchaseWaybill.ReceivingWarehouse')"
      :modelValue="props.warehouseDetails?.warehouseName ?? ''" disabled />

    <FormDropdown v-if="isProf && !disabled" :label="t('purchaseWaybill.zone')" :modelValue="form.zoneId"
      :error="props.errors?.zoneId" :placeholder="t('purchaseWaybill.zonePlaceholder')" :invalid="!!props.errors?.zoneId"
      :options="ZonesLookups" @update:modelValue="onZoneChange" />
    <FormInput v-else-if="isProf && disabled" :label="t('purchaseWaybill.zone')"
      :modelValue="props.warehouseDetails?.zoneName ?? '—'" disabled />
  </div>
</template>