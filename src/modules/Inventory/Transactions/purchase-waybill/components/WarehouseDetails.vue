<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n"
import { useInventoryLookups } from "@/composables/useInventoryLookups"
import type { WarehouseDetailsData } from "../types/PurchaseWaybill";

const props = withDefaults(defineProps<{
  warehouseDetails?: WarehouseDetailsData | null;
  disabled?: boolean;
}>(), {
  warehouseDetails: null,
  disabled: false,
});

const { t } = useI18n()
const { WarehouseLookups, ZonesLookups, getZonesLookups, getWarehouseLookups } = useInventoryLookups()

const ReceivingWarehouse = ref<string>("")
const zone = ref<string | null>(null)
const showZone = ref(false)

const errors = reactive({
  ReceivingWarehouse: "",
  zone: "",
})

// Populate from props when viewing/editing
watch(() => props.warehouseDetails, async (details) => {
  if (details) {
    ReceivingWarehouse.value = details.warehouseId ?? "";
    if (details.zoneId) {
      zone.value = details.zoneId;
      showZone.value = true;
      await getZonesLookups(details.warehouseId);
    } else {
      zone.value = null;
      showZone.value = false;
    }
  }
}, { immediate: true });

// When user manually changes warehouse (create/edit mode)
watch(() => ReceivingWarehouse.value, async (newVal) => {
  if (newVal) {
    const selectedWarehouse = WarehouseLookups.value.find(w => w.value === newVal)
    if (selectedWarehouse?.type === 'Professional') {
      showZone.value = true
      await getZonesLookups(newVal)
    } else {
      showZone.value = false
      zone.value = null
    }
  } else {
    showZone.value = false
    zone.value = null
  }
})

onMounted(() => {
  getWarehouseLookups()
})
</script>

<template>
  <div class="flex flex-col">
    <h2 class="heading-title">{{ t("purchaseWaybill.WarehouseDetails") }}</h2>
    <p class="subheading-title">{{ t("purchaseWaybill.WarehouseDetailsDesc") }}</p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <FormDropdown
      :label="t('purchaseWaybill.ReceivingWarehouse')"
      v-model="ReceivingWarehouse"
      :error="errors.ReceivingWarehouse"
      :placeholder="t('purchaseWaybill.ReceivingWarehousePlaceholder')"
      :invalid="!!errors.ReceivingWarehouse"
      :options="WarehouseLookups"
      :disabled="disabled"
    />

    <FormDropdown
      v-if="showZone"
      :label="t('purchaseWaybill.zone')"
      v-model="zone"
      :error="errors.zone"
      :placeholder="t('purchaseWaybill.zonePlaceholder')"
      :invalid="!!errors.zone"
      :options="ZonesLookups"
      :disabled="disabled"
    />
  </div>
</template>