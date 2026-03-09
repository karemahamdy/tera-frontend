<script setup lang="ts">
import { useInventoryLookups } from "@/composables/useInventoryLookups";
import { useLookups } from "@/composables/useLookups";
import {  reactive, onMounted } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const { modelValue: formData } = defineProps<{
  modelValue: any
}>();

const emit = defineEmits(['update:modelValue']);

const {
  usersLookups,
  getUsersLookups,
} = useLookups();
const { WarehouseLookups, getWarehouseLookups } = useInventoryLookups()

const TypesOptions = [
  { label: t("inventoryRequest.inbound"), value: "Inbound" },
  { label: t("inventoryRequest.outbound"), value: "Outbound" },
  { label: t("inventoryRequest.transfer"), value: "Transfer" },
]
onMounted(() => {
  getUsersLookups();
  getWarehouseLookups()

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
      :error="errors.inventoryRequestNumber" :placeholder="t('RequestInformation.inventoryRequestNumberPlaceholder')"
      :invalid="!!errors.inventoryRequestNumber" :disabled="true" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <FormDropdown :label="t('RequestInformation.RequestedBy')" v-model="formData.requestedBy" :options="usersLookups"
        :error="errors.RequestedBy" :placeholder="t('RequestInformation.RequestedByPlaceholder')"
        :invalid="!!errors.RequestedBy" />
      <div class="">
        <label class="block text-gray-600 text-lg">
          {{ t("RequestInformation.RequestDate") }}
        </label>
        <DatePicker v-model="formData.requestDate" showIcon fluid iconDisplay="input"
          :placeholder="t('RequestInformation.RequestDatePlaceholder')" />
      </div>

    </div>

    <FormDropdown class="w-full pt-8" :label="t('RequestInformation.type')" :options="TypesOptions"
      optionLabel="label" optionValue="value" v-model="formData.type" :error="errors.type"
      :placeholder="t('RequestInformation.typePlaceholder')" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <FormDropdown :label="t('RequestInformation.SourceWarehouse')" v-model="formData.warehouseId" :options="WarehouseLookups"
        :error="errors.SourceWarehouse" :placeholder="t('RequestInformation.SourceWarehousePlaceholder')" />
      <FormDropdown :label="t('RequestInformation.TargetWarehouse')" v-model="formData.destinationWarehouseId" :options="WarehouseLookups"
        :error="errors.TargetWarehouse" :placeholder="t('RequestInformation.TargetWarehousePlaceholder')" />
    </div>
    <div>
      <label class="text-gray-700 font-medium mb-2 block">
        {{ $t("RequestInformation.Reason") }}
      </label>
      <Textarea v-model="formData.reason" :placeholder="$t('RequestInformation.ReasonPlaceholder')"
        class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.Reason }" />
      <small v-if="errors.Reason" class="text-danger-500">
        {{ $t(errors.Reason) }}
      </small>
    </div>
  </div>
</template>
