<script setup lang="ts">
import { onMounted, reactive, computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useWarehouseTransaction } from "../composables/useWarehouseTransaction";
import { useInventoryLookups } from "@/composables/useInventoryLookups";
import StorageLocationPicker from "@/modules/Inventory/shared/components/StorageLocationPicker.vue";
import { useRoute } from "vue-router";
import { WarehouseTransactionSchema } from "../validation/WarehouseTransactionSchema";

const { t } = useI18n()
const props = defineProps<{
  modelValue: any;
  disabled?: boolean;
}>()
const route = useRoute();
const id = route.params.id ? String(route.params.id) : null;

const emit = defineEmits(['update:modelValue'])
const { fetchNextNumber } = useWarehouseTransaction();
const { 
  getCostCenterLookups, costCenterLookups, 
  WarehouseLookups, getWarehouseLookups,
  getWarehouseHierarchyLookups, WarehouseHierarchyLookups
} = useInventoryLookups();

const directions = [
  { value: 'Transfer', labelKey: 'direction.transfer' },
  { value: 'Inbound', labelKey: 'direction.inbound' },
  { value: 'Outbound', labelKey: 'direction.outbound' },
]

const typeOptions = ref([
  { label: t("button.free"), value: "Free" },
  { label: t("button.production"), value: "Production" },
])

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const errors = reactive({
  documentNumber: "",
  InventoryRequest: "",
  warehouse: "",
  destinationWarehouse: "",
  Zone: "",
  type: "",
  costCenter: "",
})

// Location Picker Logic
const showSrcPicker = ref(false);
const showDstPicker = ref(false);
const isLoadingSrc = ref(false);
const isLoadingDst = ref(false);

const getWhType = (whId: string) => {
  const wh = WarehouseLookups.value.find(w => w.value === whId);
  return wh?.type;
};

const srcLocations = computed(() => {
  const wh = WarehouseHierarchyLookups.value.find((w: any) => w.warehouseId === modelValue.value.warehouse);
  return wh?.locations || [];
});

const dstLocations = computed(() => {
  const wh = WarehouseHierarchyLookups.value.find((w: any) => w.warehouseId === modelValue.value.destination?.warehouse);
  return wh?.locations || [];
});

async function handleSrcWarehouseChange(val: string) {
  modelValue.value.warehouse = val;
  // Always clear previously selected zone/location when warehouse changes
  modelValue.value.zone = null;
  modelValue.value.zoneName = null;
  modelValue.value.locationId = null;
  modelValue.value.locationCode = null;
  modelValue.value.row = null;
  modelValue.value.column = null;
  modelValue.value.rack = null;
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
  if (!modelValue.value.destination) modelValue.value.destination = {};
  modelValue.value.destination.warehouse = val;
  // Always clear previously selected zone/location when destination warehouse changes
  modelValue.value.destination.zone = null;
  modelValue.value.destination.zoneName = null;
  modelValue.value.destination.locationId = null;
  modelValue.value.destination.locationCode = null;
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
  modelValue.value.zone = location.zoneId;
  modelValue.value.zoneName = location.zoneName;
  modelValue.value.locationId = location.id || location.locationId;
  modelValue.value.locationCode = location.locationCode;
  modelValue.value.row = location.row || '';
  modelValue.value.column = location.column || '';
  modelValue.value.rack = location.rack || '';
}

function handleDstLocation(location: any) {
  modelValue.value.destination.zone = location.zoneId;
  modelValue.value.destination.zoneName = location.zoneName;
  modelValue.value.destination.locationId = location.id || location.locationId;
  modelValue.value.destination.locationCode = location.locationCode;
}

onMounted(async () => {
  await Promise.all([
    getCostCenterLookups(),
    getWarehouseLookups(),
    getWarehouseHierarchyLookups()
  ]);
  if(!id){
    if (!modelValue.value.documentNumber) {
      const nextNumber = await fetchNextNumber()
      if (nextNumber && typeof nextNumber === 'string') {
        modelValue.value.documentNumber = nextNumber;
      } else if (nextNumber && nextNumber.documentNumber) {
        modelValue.value.documentNumber = nextNumber.documentNumber;
      }
    }
  }
})

async function validate(): Promise<boolean> {
  // Clear all errors first
  errors.warehouse = '';
  errors.destinationWarehouse = '';

  try {
    await WarehouseTransactionSchema.validate(
      {
        warehouseId: modelValue.value.warehouse,
        destinationWarehouseId: modelValue.value.destination?.warehouse || null,
        direction: modelValue.value.direction,
      },
      { abortEarly: false }
    );
    return true;
  } catch (err: any) {
    if (err.inner) {
      err.inner.forEach((e: any) => {
        if (e.path === 'warehouseId') errors.warehouse = t('validation.required');
        if (e.path === 'destinationWarehouseId') errors.destinationWarehouse = t('validation.required');
      });
    }
    return false;
  }
}

defineExpose({ validate });
</script>

<template>
  <div class="p-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900 mb-4">{{ t('warehouseTransaction.title') }}</h2>
      <p class="text-gray-500 text-sm">
        {{ t('warehouseTransaction.desc') }}
      </p>
    </div>

    <!-- Direction Tabs -->
    <div class="flex gap-4 mt-6 border-b pt-4 border-t border-gray-200 justify-center">
      <button 
        v-for="dir in directions" 
        :key="dir.value" 
        @click="!disabled && (modelValue.direction = dir.value)" 
        :class="[
          'pb-2 px-4 text-sm font-medium transition-colors border-b-2',
          modelValue.direction === dir.value
            ? 'border-primary-500 text-primary-600'
            : 'border-transparent text-gray-500 hover:text-gray-700',
          disabled ? 'cursor-not-allowed opacity-70' : ''
        ]"
      >
        {{ t(dir.labelKey) }}
      </button>
    </div>

    <!-- Waybill Number -->
    <FormInput
      :label="t('purchaseWaybill.WaybillNumber')"
      v-model="modelValue.documentNumber"
      :error="errors.documentNumber"
      :placeholder="t('purchaseWaybill.WaybillNumberPlaceholder')"
      :invalid="!!errors.documentNumber"
      disabled
      class="mt-6"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div class="flex gap-4 mt-2 md:col-span-2">
        <div class="w-1/2">
          <label class="block text-gray-600 text-lg mb-1">
            {{ t("purchaseWaybill.WaybillDate") }}
          </label>
          <DatePicker 
            v-model="modelValue.waybillDate" 
            showIcon 
            fluid 
            iconDisplay="input"
            :placeholder="t('purchaseWaybill.WaybillDatePlaceholder')" 
            :disabled="disabled"
          />
        </div>

        <div class="w-1/2">
          <FormDropdown 
            :label="t('inventoryRequest.inventoryRequest')" 
            v-model="modelValue.inventoryRequest"
            :error="errors.InventoryRequest" 
            :placeholder="t('warehouseTransaction.InventoryRequestPlaceholder')"
            :invalid="!!errors.InventoryRequest" 
            :disabled="disabled"
          />
        </div>
      </div>

      <!-- Warehouse/Zone for Inbound/Outbound -->
      <template v-if="modelValue.direction !== 'Transfer'">

        <FormDropdown 
          :label="t('items.costCenter')" 
          v-model="modelValue.costCenter" 
          :error="errors.costCenter"
          :placeholder="t('items.costCenterPlaceholder')" 
          :options="costCenterLookups" 
          :disabled="disabled"
        />

        <FormDropdown 
          :label="t('warehouses.type')" 
          v-model="modelValue.type" 
          :error="errors.type"
          :placeholder="t('RequestInformation.typePlaceholder')" 
          :options="typeOptions" 
          :disabled="disabled"
        />

          <FormDropdown 
          :label="t('warehouseTransaction.warehouse')" 
          v-model="modelValue.warehouse"
          :error="errors.warehouse" 
          :invalid="!!errors.warehouse"
          :placeholder="t('itemList.warehousePlaceholder')"
          :options="WarehouseLookups"
          :disabled="disabled"
          @update:modelValue="handleSrcWarehouseChange"
        />
        <!-- Zone/Location — StorageLocationPicker for Professional -->
        <div v-if="getWhType(modelValue.warehouse) === 'Professional'">
          <label class="block text-gray-600 text-lg mb-1">{{ t('itemList.zone') }}</label>
          <div v-if="isLoadingSrc" class="py-2"><ProgressSpinner style="width:20px;height:20px" /></div>
          <div v-else class="flex flex-col gap-1">
            <BaseButton
              :label="modelValue.locationCode || t('warehouseTransaction.selectZone')"
              variant="outline-primary"
              class="w-full text-left justify-start font-normal border-gray-300"
              :disabled="disabled"
              @click="showSrcPicker = true"
            />
            <span v-if="modelValue.locationCode" class="text-xs text-gray-400">
              {{ modelValue.zoneName }} <template v-if="modelValue.row">(R:{{ modelValue.row }} C:{{ modelValue.column }} R:{{ modelValue.rack }})</template>
            </span>
          </div>
        </div>

      </template>

      <!-- Transfer Source/Target Grid -->
      <div v-if="modelValue.direction === 'Transfer'" class="mt-5 md:col-span-2">
        <p><strong>{{ $t("itemTransaction.sourceTargetItems") }}</strong></p>
        <div class="grid grid-cols-9 justify-center items-center gap-2 mt-2">

          <!-- Source -->
          <div class="col-span-4 bg-primary-50 rounded-xl p-5">
            <p class="text-primary-500 mb-4"><strong>{{ $t("itemTransaction.sourceFrom") }}</strong></p>
            <FormDropdown 
              :label="t('warehouseTransaction.warehouse')" 
              v-model="modelValue.warehouse"
              :error="errors.warehouse"
              :invalid="!!errors.warehouse"
              :placeholder="t('warehouseTransaction.warehousePlaceholder')" 
              :options="WarehouseLookups"
              :disabled="disabled"
              class="mb-4" 
              @update:modelValue="handleSrcWarehouseChange"
            />

            <div v-if="getWhType(modelValue.warehouse) === 'Professional'">
              <label class="block text-primary-500 text-sm font-bold mb-1">{{ t('warehouseTransaction.Zone') }}</label>
              <div v-if="isLoadingSrc" class="py-2"><ProgressSpinner style="width:20px;height:20px" /></div>
              <div v-else class="flex flex-col gap-1">
                <BaseButton
                  :label="modelValue.locationCode || t('warehouseTransaction.selectZone')"
                  variant="outline-primary"
                  class="w-full text-left justify-start font-normal border-gray-300 bg-white"
                  :disabled="disabled"
                  @click="showSrcPicker = true"
                />
              </div>
            </div>
          </div>

          <!-- Arrow -->
          <div class="col-span-1 flex justify-center items-center h-full">
            <div class="p-3 rounded-full bg-primary-500 text-white">
              <VsxIcon iconName="ArrowRight" type="linear" />
            </div>
          </div>

          <!-- Target -->
          <div class="col-span-4 bg-primary-50 rounded-xl p-5">
            <p class="text-primary-500 mb-4"><strong>{{ $t("itemTransaction.targetTo") }}</strong></p>
            <FormDropdown 
              :label="t('warehouseTransaction.warehouse')" 
              v-model="modelValue.destination.warehouse"
              :error="errors.destinationWarehouse"
              :invalid="!!errors.destinationWarehouse"
              :placeholder="t('warehouseTransaction.warehousePlaceholder')" 
              :options="WarehouseLookups"
              :disabled="disabled"
              class="mb-4" 
              @update:modelValue="handleDstWarehouseChange"
            />

            <div v-if="getWhType(modelValue.destination?.warehouse) === 'Professional'">
              <label class="block text-primary-500 text-sm font-bold mb-1">{{ t('warehouseTransaction.Zone') }}</label>
              <div v-if="isLoadingDst" class="py-2"><ProgressSpinner style="width:20px;height:20px" /></div>
              <div v-else class="flex flex-col gap-1">
                <BaseButton
                  :label="modelValue.destination?.locationCode || t('warehouseTransaction.selectZone')"
                  variant="outline-primary"
                  class="w-full text-left justify-start font-normal border-gray-300 bg-white"
                  :disabled="disabled"
                  @click="showDstPicker = true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Location Pickers -->
    <StorageLocationPicker 
      v-if="showSrcPicker" 
      v-model:visible="showSrcPicker"
      :locations="srcLocations" 
      :selectedLocationId="modelValue.locationId"
      @select="handleSrcLocation" 
    />
    <StorageLocationPicker 
      v-if="showDstPicker" 
      v-model:visible="showDstPicker"
      :locations="dstLocations" 
      :selectedLocationId="modelValue.destination?.locationId"
      @select="handleDstLocation" 
    />
  </div>
</template>
