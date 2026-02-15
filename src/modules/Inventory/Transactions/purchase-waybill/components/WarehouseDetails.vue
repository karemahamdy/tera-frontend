<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const ReceivingWarehouse = ref("")
const zone = ref(null)
const errors = reactive({
  ReceivingWarehouse: "",
  zone: "",
})

</script>

<template>

       <div class="flex flex-col">
      <h2 class="heading-title">{{ t("purchaseWaybill.WarehouseDetails") }}</h2>
      <p class="subheading-title">{{ t("purchaseWaybill.WarehouseDetailsDesc") }}</p>
    </div>
 <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <FormDropdown :label="t('purchaseWaybill.ReceivingWarehouse')" v-model="ReceivingWarehouse" :error="errors.ReceivingWarehouse"
        :placeholder="t('purchaseWaybill.ReceivingWarehousePlaceholder')" :invalid="!!errors.ReceivingWarehouse" />
        <FormDropdown :label="t('purchaseWaybill.zone')" v-model="zone" :error="errors.zone"
        :placeholder="t('purchaseWaybill.zonePlaceholder')" :invalid="!!errors.zone" />
        </div>
</template>