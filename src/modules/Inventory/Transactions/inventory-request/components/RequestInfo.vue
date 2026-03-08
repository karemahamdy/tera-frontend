<script setup lang="ts">
import { useInventoryLookups } from "@/composables/useInventoryLookups";
import { useLookups } from "@/composables/useLookups";
import { ref, reactive, onMounted } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const InventoryRequestNumber = ref("")
const {
  usersLookups,
  getUsersLookups,
} = useLookups();
const { WarehouseLookups, getWarehouseLookups } = useInventoryLookups()

const RequestedBy = ref("")
const TargetWarehouse = ref(null)
const SourceWarehouse = ref("")
const Reason = ref("")
const expectedDelivery = ref()
const selectedtype = ref(null)

const id = ref(null)
const currencyOptions = [
  { label: t("inventoryRequest.inbound"), value: "inbound" },
  { label: t("inventoryRequest.outbound"), value: "outbound" },
  { label: t("inventoryRequest.transfer"), value: "transfer" },
]
onMounted(() => {
  getUsersLookups();
  getWarehouseLookups()

});
const errors = reactive({
  InventoryRequestNumber: "",
  Supplier: "",
  SourceWarehouse: "",
  RequestedBy: "",
  Reason: "",
  TargetWarehouse: "",
  Reference: "",
  type: "",
  ExchangeValue: "",
})
</script>

<template>
  <div class="grid grid-rows gap-2">
    <!-- ================= Supplier Details ================= -->
    <p class="font-bold mb-5 text-lg">
      {{ t("RequestInformation.RequestInformation") }}
    </p>

    <FormInput :label="t('RequestInformation.InventoryRequestNumber')" v-model="InventoryRequestNumber"
      :error="errors.InventoryRequestNumber" :placeholder="t('RequestInformation.InventoryRequestNumberPlaceholder')"
      :invalid="!!errors.InventoryRequestNumber" :disabled="!!id" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <FormDropdown :label="t('RequestInformation.RequestedBy')" v-model="RequestedBy" :options="usersLookups"
        :error="errors.RequestedBy" :placeholder="t('RequestInformation.RequestedByPlaceholder')"
        :invalid="!!errors.RequestedBy" />
      <div class="">
        <label class="block text-gray-600 text-lg">
          {{ t("RequestInformation.RequestDate") }}
        </label>
        <DatePicker v-model="expectedDelivery" showIcon fluid iconDisplay="input"
          :placeholder="t('RequestInformation.RequestDatePlaceholder')" />
      </div>

    </div>

    <!-- ================= type Info ================= -->

    <FormDropdown class="w-full pt-8" :label="t('RequestInformation.type')" :options="currencyOptions"
      optionLabel="label" optionValue="value" v-model="selectedtype" :error="errors.type"
      :placeholder="t('RequestInformation.typePlaceholder')" />


    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

      <FormDropdown :label="t('RequestInformation.SourceWarehouse')" v-model="SourceWarehouse" :options="WarehouseLookups"
        :error="errors.SourceWarehouse" :placeholder="t('RequestInformation.SourceWarehousePlaceholder')" />
      <FormDropdown :label="t('RequestInformation.TargetWarehouse')" v-model="TargetWarehouse" :options="WarehouseLookups"
        :error="errors.TargetWarehouse" :placeholder="t('RequestInformation.TargetWarehousePlaceholder')" />
    </div>
    <div>
      <label class="text-gray-700 font-medium mb-2 block">
        {{ $t("RequestInformation.Reason") }}
      </label>

      <Textarea v-model="Reason" :placeholder="$t('RequestInformation.ReasonPlaceholder')"
        class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.Reason }" />

      <small v-if="errors.Reason" class="text-danger-500">
        {{ $t(errors.Reason) }}
      </small>
    </div>
  </div>
</template>
