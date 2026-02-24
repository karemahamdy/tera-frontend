<script setup lang="ts">
import { onMounted, reactive, computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useWarehouseTransaction } from "../composables/useWarehouseTransaction";
import { useInventoryLookups } from "@/composables/useInventoryLookups";

const { t } = useI18n()
const props = defineProps<{
  modelValue: any
}>()
const emit = defineEmits(['update:modelValue'])
const { fetchNextNumber } = useWarehouseTransaction();
const { getCostCenterLookups, costCenterLookups } = useInventoryLookups();

const directions = [
  { value: 'Transfer', labelKey: 'direction.transfer' },
  { value: 'Inbound', labelKey: 'direction.inbound' },
  { value: 'Outbound', labelKey: 'direction.outbound' },
]
const type = ref([
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
  Zone: "",
  type: "",
  costCenter: "",
})

onMounted(async () => {
  await Promise.all([getCostCenterLookups()]);
  const nextNumber = await fetchNextNumber()
  if (nextNumber) {
    modelValue.value.documentNumber = nextNumber.documentNumber
  }
})
</script>

<template>
  <div>
    <div>
      <h2 class="text-xl font-bold text-gray-900 mb-4">{{ t('warehouseTransaction.title') }}</h2>
      <p class="text-gray-500 text-sm">
        {{ t('warehouseTransaction.desc') }}
      </p>
    </div>

    <div class="flex gap-4 mt-6 border-b pt-4 border-t border-gray-200 justify-center">
      <button v-for="dir in directions" :key="dir.value" @click="modelValue.direction = dir.value" :class="[
        'pb-2 px-4 text-sm font-medium transition-colors border-b-2',
        modelValue.direction === dir.value
          ? 'border-primary-500 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      ]">
        {{ t(dir.labelKey) }}
      </button>
    </div>


   <FormInput
  :label="t('purchaseWaybill.WaybillNumber')"
  v-model="modelValue.documentNumber"
  :error="errors.documentNumber"
  :placeholder="t('purchaseWaybill.WaybillNumberPlaceholder')"
  :invalid="!!errors.documentNumber"
  disabled
/>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

      <div class="flex gap-4 mt-2 md:col-span-2">
        <div class="w-1/2">
          <label class="block text-gray-600 text-lg">
            {{ t("purchaseWaybill.WaybillDate") }}
          </label>
          <DatePicker v-model="modelValue.waybillDate" showIcon fluid iconDisplay="input"
            :placeholder="t('purchaseWaybill.WaybillDatePlaceholder')" />
        </div>

        <div class="w-1/2">
          <FormDropdown :label="t('inventoryRequest.inventoryRequest')" v-model="modelValue.inventoryRequest"
            :error="errors.InventoryRequest" :placeholder="t('warehouseTransaction.InventoryRequestPlaceholder')"
            :invalid="!!errors.InventoryRequest" />
        </div>
      </div>
      <!--  Warehouse/Zone for Inbound/Outbound -->
      <template v-if="modelValue.direction !== 'Transfer'">
        <FormDropdown :label="t('warehouseTransaction.warehouse')" v-model="modelValue.warehouse"
          :error="errors.warehouse" :placeholder="t('itemList.warehousePlaceholder')" />

        <FormDropdown :label="t('itemList.zone')" v-model="modelValue.zone" :error="errors.Zone"
          :placeholder="t('warehouseTransaction.ZonePlaceholder')" />
      </template>


      <template v-if="modelValue.direction !== 'Transfer'">
        <FormDropdown :label="t('items.costCenter')" v-model="modelValue.costCenter" :error="errors.costCenter"
          :placeholder="t('items.costCenterPlaceholder')" :options="costCenterLookups" />

        <FormDropdown :label="t('warehouses.type')" v-model="modelValue.type" :error="errors.type"
          :placeholder="t('RequestInformation.typePlaceholder')" :options="type" />
      </template>


      <!-- Transfer Source/Target Grid -->
      <div v-if="modelValue.direction === 'Transfer'" class="mt-5 md:col-span-2">
        <p><strong>{{ $t("itemTransaction.sourceTargetItems") }}</strong></p>
        <div class="grid grid-cols-9 justify-center items-center gap-2">

          <!-- Source -->
          <div class="col-span-4 bg-primary-50 rounded-xl p-5">
            <p class="text-primary-500 my-4"><strong>{{ $t("itemTransaction.sourceFrom") }}</strong></p>
            <FormDropdown :label="t('warehouseTransaction.warehouse')" v-model="modelValue.source.warehouse"
              :placeholder="t('warehouseTransaction.warehousePlaceholder')" class="my-4" />

            <FormDropdown :label="t('warehouseTransaction.Zone')" v-model="modelValue.source.zone"
              :placeholder="t('warehouseTransaction.ZonePlaceholder')" class="my-4" />
          </div>

          <!-- Arrow -->
          <div class="col-span-1 flex justify-center items-center h-full">
            <div class="p-3 rounded-full bg-primary-500 text-white">
              <VsxIcon iconName="ArrowRight" type="linear" />
            </div>
          </div>

          <!-- Target -->
          <div class="col-span-4 bg-primary-50 rounded-xl p-5">
            <p class="text-primary-500 my-4"><strong>{{ $t("itemTransaction.targetTo") }}</strong></p>
            <FormDropdown :label="t('warehouseTransaction.warehouse')" v-model="modelValue.destination.warehouse"
              :placeholder="t('warehouseTransaction.warehousePlaceholder')" class="my-4" />

            <FormDropdown :label="t('warehouseTransaction.Zone')" v-model="modelValue.destination.zone"
              :placeholder="t('warehouseTransaction.ZonePlaceholder')" class="my-4" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
