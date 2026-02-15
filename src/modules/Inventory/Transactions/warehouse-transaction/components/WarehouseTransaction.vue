<script setup lang="ts">
import { ref, reactive } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const props = defineProps<{
  modelValue: any
}>()

const WaybillNumber = ref("") // Local Ref for now
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

    <!-- Direction Tabs -->
    <div class="flex gap-4 mt-6 border-b border-gray-200">
      <button 
        v-for="dir in ['Transfer', 'Inbound', 'Outbound']" 
        :key="dir"
        @click="modelValue.direction = dir"
        :class="['pb-2 px-4 text-sm font-medium transition-colors border-b-2', 
          modelValue.direction === dir ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700']"
      >
        {{ dir }}
      </button>
    </div>


    <FormInput :label="t('purchaseWaybill.WaybillNumber')" v-model="WaybillNumber" :error="errors.WaybillNumber"
      :placeholder="t('purchaseWaybill.WaybillNumberPlaceholder')" :invalid="!!errors.WaybillNumber" :disabled="!!id" class="mt-6"/>
    
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
            :error="errors.InventoryRequest" :placeholder="t('inventoryRequest.InventoryRequestPlaceholder')"
            :invalid="!!errors.InventoryRequest" />
        </div>
      </div>
 <template v-if="modelValue.direction !== 'Transfer'">
      <FormDropdown :label="t('warehouseTransaction.costCenter')" v-model="modelValue.costCenter" :error="errors.costCenter"
        :placeholder="t('warehouseTransaction.costCenterPlaceholder')" />

      <FormDropdown :label="t('warehouses.type')" v-model="modelValue.type" :error="errors.type"
        :placeholder="t('warehouses.typePlaceholder')" />
</template>
      <!--  Warehouse/Zone for Inbound/Outbound -->
      <template v-if="modelValue.direction !== 'Transfer'">
         <FormDropdown :label="t('warehouseTransaction.warehouse')" v-model="modelValue.warehouse" :error="errors.warehouse"
        :placeholder="t('warehouseTransaction.warehousePlaceholder')" />

        <FormDropdown :label="t('warehouseTransaction.Zone')" v-model="modelValue.zone" :error="errors.Zone"
            :placeholder="t('warehouseTransaction.ZonePlaceholder')" />
      </template>
      

      <!-- Transfer Source/Target Grid -->
      <div v-if="modelValue.direction === 'Transfer'" class="mt-5 md:col-span-2">
        <p><strong>{{ $t("itemTransaction.sourceTargetItems") }}</strong></p>
        <div class="grid grid-cols-9 justify-center items-center gap-2">
          
          <!-- Source -->
          <div class="col-span-4 bg-primary-50 rounded-xl p-5">
            <p class="text-primary-500 my-4"><strong>{{ $t("itemTransaction.sourceFrom") }}</strong></p>
            <FormDropdown :label="t('warehouseTransaction.warehouse')" v-model="modelValue.source.warehouse" 
              :placeholder="t('warehouseTransaction.warehousePlaceholder')" class="my-4"/>

            <FormDropdown :label="t('warehouseTransaction.Zone')" v-model="modelValue.source.zone"
              :placeholder="t('warehouseTransaction.ZonePlaceholder')" class="my-4"/>
          </div>

          <!-- Arrow -->
          <div class="col-span-1 flex justify-center items-center h-full">
            <div class="p-3 rounded-full bg-primary-500 text-white">
              <VsxIcon  iconName="ArrowRight" type="linear" />
            </div>
          </div>

          <!-- Target -->
          <div class="col-span-4 bg-primary-50 rounded-xl p-5">
            <p class="text-primary-500 my-4"><strong>{{ $t("itemTransaction.targetTo") }}</strong></p>
            <FormDropdown :label="t('warehouseTransaction.warehouse')" v-model="modelValue.destination.warehouse"
              :placeholder="t('warehouseTransaction.warehousePlaceholder')" class="my-4"/>

            <FormDropdown :label="t('warehouseTransaction.Zone')" v-model="modelValue.destination.zone" 
              :placeholder="t('warehouseTransaction.ZonePlaceholder')" class="my-4"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
