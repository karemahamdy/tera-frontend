<script setup lang="ts">
import { ref, reactive } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const WaybillNumber = ref("")
const InventoryRequest = ref(null)
const Zone = ref(null)
const warehouse = ref("")
const waybillDate = ref()
const costCenter = ref()
const type = ref()

const id = ref(null)


const errors = reactive({
  WaybillNumber: "",
  InventoryRequest: "",
  warehouse: "",
  Zone: "",
  type: "",
  Reference: "",
  Currency: "",
  ExchangeValue: "",
  costCenter: "",
  ReceivingWarehouse: "",
  CustomerNotes: ""
})
</script>

<template>
  <div>
    <div>
      <h2 class="text-xl font-bold text-gray-900">{{ t('warehouseTransaction.title') }}</h2>
      <p class="text-gray-500 text-sm">
        {{ t('warehouseTransaction.desc') }}
      </p>
    </div>
    
   <FormInput :label="t('purchaseWaybill.WaybillNumber')" v-model="WaybillNumber" :error="errors.WaybillNumber"
      :placeholder="t('purchaseWaybill.WaybillNumberPlaceholder')" :invalid="!!errors.WaybillNumber" :disabled="!!id" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

<div class="flex gap-4 mt-2 md:col-span-2">
        <div class="w-1/2">
          <label class="block text-gray-600 text-lg">
            {{ t("purchaseWaybill.WaybillDate") }}
          </label>
          <DatePicker v-model="waybillDate" showIcon fluid iconDisplay="input"
            :placeholder="t('purchaseWaybill.WaybillDatePlaceholder')" />
        </div>

        <div class="w-1/2">
          <FormDropdown :label="t('inventoryRequest.inventoryRequest')" v-model="InventoryRequest" :error="errors.InventoryRequest"
            :placeholder="t('inventoryRequest.InventoryRequestPlaceholder')" :invalid="!!errors.InventoryRequest" />
         
        </div>
      </div>

        <FormDropdown :label="t('warehouseTransaction.costCenter')" v-model="costCenter" :error="errors.costCenter"
          :placeholder="t('warehouseTransaction.costCenterPlaceholder')" />

    <FormDropdown :label="t('warehouses.type')" v-model="type" :error="errors.type"
          :placeholder="t('warehouses.typePlaceholder')" />

      <FormDropdown :label="t('warehouseTransaction.warehouse')" v-model="warehouse" :error="errors.warehouse"
        :placeholder="t('warehouseTransaction.warehousePlaceholder')" />

      <FormDropdown :label="t('warehouseTransaction.Zone')" v-model="Zone" :error="errors.Zone"
        :placeholder="t('warehouseTransaction.ZonePlaceholder')" />
      
    </div>
</div>
</template>
