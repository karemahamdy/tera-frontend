<script setup lang="ts">
import { useInventoryLookups } from "@/composables/useInventoryLookups";
import { useLookups } from "@/composables/useLookups";
import { reactive, onMounted, computed, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import StorageLocationPicker from "@/modules/Inventory/shared/components/StorageLocationPicker.vue";

const { t } = useI18n()

const { modelValue: formData, disabled } = defineProps<{
  modelValue: any;
  disabled?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const {
  usersLookups,
  getUsersLookups,
} = useLookups();
const {
  WarehouseLookups,
  getWarehouseLookups,
  getWarehouseHierarchyLookups,
  WarehouseHierarchyLookups,
} = useInventoryLookups()

const TypesOptions = [
  { label: t("inventoryRequest.inbound"), value: "Inbound" },
  { label: t("inventoryRequest.outbound"), value: "Outbound" },
  { label: t("inventoryRequest.transfer"), value: "Transfer" },
]

// Location picker state
const showSrcPicker = ref(false);
const showDstPicker = ref(false);
const isLoadingSrc = ref(false);
const isLoadingDst = ref(false);

const getWhType = (whId: string) => {
  const wh = WarehouseLookups.value.find(w => w.value === whId);
  return wh?.type;
};

const srcLocations = computed(() => {
  const wh = WarehouseHierarchyLookups.value.find((w: any) => w.warehouseId === formData.warehouseId);
  return wh?.locations || [];
});

const dstLocations = computed(() => {
  const wh = WarehouseHierarchyLookups.value.find((w: any) => w.warehouseId === formData.destinationWarehouseId);
  return wh?.locations || [];
});

async function handleSrcWarehouseChange(val: string) {
  formData.warehouseId = val;
  // Reset source zone/location when warehouse changes
  formData.zoneId = '';
  formData.zoneName = '';
  formData.locationId = null;
  formData.locationCode = '';
  const type = getWhType(val);
  if (type === 'Professional') {
    isLoadingSrc.value = true;
    try {
      await getWarehouseHierarchyLookups();
    } finally {
      isLoadingSrc.value = false;
    }
    showSrcPicker.value = true;
  }
}

async function handleDstWarehouseChange(val: string) {
  formData.destinationWarehouseId = val;
  // Reset destination zone/location when warehouse changes
  formData.destinationZoneId = '';
  formData.destinationZoneName = '';
  formData.destinationLocationId = null;
  formData.destinationLocationCode = '';
  const type = getWhType(val);
  if (type === 'Professional') {
    isLoadingDst.value = true;
    try {
      await getWarehouseHierarchyLookups();
    } finally {
      isLoadingDst.value = false;
    }
    showDstPicker.value = true;
  }
}

function handleSrcLocation(location: any) {
  formData.zoneId = location.zoneId;
  formData.zoneName = location.zoneName;
  formData.locationId = location.id || location.locationId;
  formData.locationCode = location.locationCode;
}

function handleDstLocation(location: any) {
  formData.destinationZoneId = location.zoneId;
  formData.destinationZoneName = location.zoneName;
  formData.destinationLocationId = location.id || location.locationId;
  formData.destinationLocationCode = location.locationCode;
}

watch(() => formData.type, (newType) => {
  if (newType !== 'Transfer') {
    formData.destinationWarehouseId = '';
    formData.destinationZoneId = '';
    formData.destinationZoneName = '';
    formData.destinationLocationId = null;
    formData.destinationLocationCode = '';
  }
});

watch([
  () => formData.warehouseId, 
  () => formData.destinationWarehouseId, 
  () => formData.type,
  () => formData.zoneId,
  () => formData.destinationZoneId
], ([srcWh, dstWh, type, srcZn, dstZn]) => {
  if (type === 'Transfer' && srcWh && dstWh && srcWh === dstWh) {
    if (srcZn && dstZn && srcZn !== dstZn) {
      if (errors.TargetWarehouse === t('validation.sameSourceAndDestination')) errors.TargetWarehouse = '';
      if (errors.SourceWarehouse === t('validation.sameSourceAndDestination')) errors.SourceWarehouse = '';
    } else {
      errors.TargetWarehouse = t('validation.sameSourceAndDestination');
      errors.SourceWarehouse = t('validation.sameSourceAndDestination');
    }
  } else {
    if (errors.TargetWarehouse === t('validation.sameSourceAndDestination')) errors.TargetWarehouse = '';
    if (errors.SourceWarehouse === t('validation.sameSourceAndDestination')) errors.SourceWarehouse = '';
  }
});

onMounted(async () => {
  await Promise.all([
    getUsersLookups(),
    getWarehouseLookups(),
    getWarehouseHierarchyLookups(),
  ]);
});

const errors = reactive({
  inventoryRequestNumber: "",
  RequestedBy: "",
  SourceWarehouse: "",
  Reason: "",
  TargetWarehouse: "",
  type: "",
})
</script>

<template>
  <div class="grid grid-rows gap-2">
    <!-- ================= Supplier Details ================= -->
    <p class="font-bold mb-5 text-lg">
      {{ t("RequestInformation.RequestInformation") }}
    </p>

    <FormInput :label="t('RequestInformation.InventoryRequestNumber')" v-model="formData.documentNumber"
      :error="errors.inventoryRequestNumber" :placeholder="t('RequestInformation.InventoryRequestNumberPlaceholder')"
      :invalid="!!errors.inventoryRequestNumber" :disabled="true" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <FormDropdown :label="t('RequestInformation.RequestedBy')" v-model="formData.requestedBy" :options="usersLookups"
        :error="errors.RequestedBy" :placeholder="t('RequestInformation.RequestedByPlaceholder')"
        :invalid="!!errors.RequestedBy" :disabled="disabled" />
      <div class="">
        <label class="block text-gray-600 text-lg">
          {{ t("RequestInformation.RequestDate") }}
        </label>
        <DatePicker v-model="formData.requestDate" showIcon fluid iconDisplay="input"
          :placeholder="t('RequestInformation.RequestDatePlaceholder')" :disabled="disabled" />
      </div>

    </div>

    <FormDropdown class="w-full pt-8" :label="t('RequestInformation.type')" :options="TypesOptions"
      optionLabel="label" optionValue="value" v-model="formData.type" :error="errors.type"
      :placeholder="t('RequestInformation.typePlaceholder')" :disabled="disabled" />

    <!-- Source & Destination Warehouse with Zone/Location -->
    <div class="mt-5">
      <p><strong>{{ $t("itemTransaction.sourceTargetItems") }}</strong></p>
      <div class="grid grid-cols-9 justify-center items-start gap-2 mt-2">

        <!-- Source -->
        <div 
          :class="formData.type === 'Transfer' ? 'col-span-4' : 'col-span-9'"
          class="bg-primary-50 rounded-xl p-5"
        >
          <p class="text-primary-500 mb-4"><strong>{{ $t("itemTransaction.sourceFrom") }}</strong></p>

          <FormDropdown
            :label="t('RequestInformation.SourceWarehouse')"
            v-model="formData.warehouseId"
            :options="WarehouseLookups"
            :error="errors.SourceWarehouse"
            :placeholder="t('RequestInformation.SourceWarehousePlaceholder')"
            :disabled="disabled"
            class="mb-4"
            @update:modelValue="handleSrcWarehouseChange"
          />

          <div v-if="getWhType(formData.warehouseId) === 'Professional'">
            <label class="block text-primary-500 text-sm font-bold mb-1">{{ t('warehouseTransaction.Zone') }}</label>
            <div v-if="isLoadingSrc" class="py-2"><ProgressSpinner style="width:20px;height:20px" /></div>
            <div v-else class="flex flex-col gap-1">
              <BaseButton
                :label="formData.locationCode || t('warehouseTransaction.selectZone')"
                variant="outline-primary"
                class="w-full text-left justify-start font-normal border-gray-300 bg-white"
                :disabled="disabled"
                @click="showSrcPicker = true"
              />
              <span v-if="formData.locationCode" class="text-xs text-gray-400">
                {{ formData.zoneName }}
              </span>
            </div>
          </div>
        </div>

        <!-- Arrow & Destination -->
        <template v-if="formData.type === 'Transfer'">
          <!-- Arrow -->
          <div class="col-span-1 flex justify-center items-center h-full pt-8">
            <div class="p-3 rounded-full bg-primary-500 text-white">
              <VsxIcon iconName="ArrowRight" type="linear" />
            </div>
          </div>

          <!-- Destination -->
          <div class="col-span-4 bg-primary-50 rounded-xl p-5">
            <p class="text-primary-500 mb-4"><strong>{{ $t("itemTransaction.targetTo") }}</strong></p>

            <FormDropdown
              :label="t('RequestInformation.TargetWarehouse')"
              v-model="formData.destinationWarehouseId"
              :options="WarehouseLookups"
              :error="errors.TargetWarehouse"
              :placeholder="t('RequestInformation.TargetWarehousePlaceholder')"
              :disabled="disabled"
              class="mb-4"
              @update:modelValue="handleDstWarehouseChange"
            />

            <div v-if="getWhType(formData.destinationWarehouseId) === 'Professional'">
              <label class="block text-primary-500 text-sm font-bold mb-1">{{ t('warehouseTransaction.Zone') }}</label>
              <div v-if="isLoadingDst" class="py-2"><ProgressSpinner style="width:20px;height:20px" /></div>
              <div v-else class="flex flex-col gap-1">
                <BaseButton
                  :label="formData.destinationLocationCode || t('warehouseTransaction.selectZone')"
                  variant="outline-primary"
                  class="w-full text-left justify-start font-normal border-gray-300 bg-white"
                  :disabled="disabled"
                  @click="showDstPicker = true"
                />
                <span v-if="formData.destinationLocationCode" class="text-xs text-gray-400">
                  {{ formData.destinationZoneName }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="mt-4">
      <label class="text-gray-700 font-medium mb-2 block">
        {{ $t("RequestInformation.Reason") }}
      </label>
      <Textarea v-model="formData.reason" :placeholder="$t('RequestInformation.ReasonPlaceholder')"
        class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.Reason }" :disabled="disabled" />
      <small v-if="errors.Reason" class="text-danger-500">
        {{ $t(errors.Reason) }}
      </small>
    </div>

    <!-- Location Pickers -->
    <StorageLocationPicker
      v-if="showSrcPicker"
      v-model:visible="showSrcPicker"
      :locations="srcLocations"
      :selectedLocationId="formData.locationId"
      @select="handleSrcLocation"
    />
    <StorageLocationPicker
      v-if="showDstPicker"
      v-model:visible="showDstPicker"
      :locations="dstLocations"
      :selectedLocationId="formData.destinationLocationId"
      @select="handleDstLocation"
    />
  </div>
</template>
