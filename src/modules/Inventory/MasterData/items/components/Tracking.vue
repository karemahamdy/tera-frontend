<script setup lang="ts">
import { useItems } from "../composables/useItems";
const { errors, accessScope } = useItems();
</script>
<template>
  <div class="flex flex-wrap gap-4">
    <div class="box flex flex-col gap-1 justify-between">
      <div>
        <p class="font-bold">{{ $t("items.trackingMethod") }}</p>
        <div
          class="mt-2 flex items-center gap-5 p-5 rounded-xl border border-gray-300"
        >
          <RadioButton
            inputId="input1"
            name="access"
            value="noTracking"
            v-model="accessScope"
          />
          <label class="ml-2 cursor-pointer" for="input1">
            {{ $t("items.noTracking") }}
            <br />
            <small class="text-gray-500">{{
              $t("items.trackOnlyByQuantity")
            }}</small>
          </label>
        </div>
      </div>
      <div class="mt-2 p-5 rounded-xl border bg-primary-50 border-primary-500">
        <div class="flex items-center gap-5">
          <RadioButton
            inputId="input2"
            name="access"
            value="serialTracking"
            v-model="accessScope"
          />
          <label class="ml-2 cursor-pointer" for="input2">
            {{ $t("items.serialTracking") }}
            <br />
            <small class="text-gray-500">{{
              $t("items.serialBatchTrackingPerEachQuantity")
            }}</small>
          </label>
        </div>
        <hr class="mt-5 text-gray-300" />
        <div class="flex items-center gap-5 mt-5">
          <Checkbox v-model="accessScope" inputId="input3" binary @click.stop />
          <label class="ml-2 cursor-pointer" for="input3">
            {{ $t("items.autoGenerateSerialWhileReciving") }}
          </label>
        </div>
        <FormInput
          :label="$t('items.initialSerial')"
          :error="errors.initialSerial"
          :placeholder="$t('items.initialSerialPlaceholder')"
          :invalid="!!errors.initialSerial"
          class="mt-5"
        />
        <div class="flex gap-2 mt-2 items-center text-success-500">
          <VsxIcon iconName="InfoCircle" :size="16" type="linear" />
          <p class="text-sm">By Default Item Code</p>
        </div>
      </div>
    </div>
    <div class="box flex flex-col gap-1 justify-between">
      <FormInput
        :label="$t('items.reorderPoint')"
        :error="errors.reorderPoint"
        :placeholder="$t('items.reorderPointPlaceholder')"
        :invalid="!!errors.reorderPoint"
      />
      <FormInput
        :label="$t('items.reorderQuantity')"
        :error="errors.reorderQuantity"
        :placeholder="$t('items.reorderQuantityPlaceholder')"
        :invalid="!!errors.reorderQuantity"
      />
      <FormInput
        :label="$t('items.maximumStockLevel')"
        :error="errors.maximumStockLevel"
        :placeholder="$t('items.maximumStockLevelPlaceholder')"
        :invalid="!!errors.maximumStockLevel"
      />
      <FormInput
        :label="$t('items.leadTimeDays')"
        :error="errors.leadTimeDays"
        :placeholder="$t('items.leadTimeDaysPlaceholder')"
        :invalid="!!errors.leadTimeDays"
      />
      <FormInput
        :label="$t('items.shelfLifeDays')"
        :error="errors.shelfLifeDays"
        :placeholder="$t('items.shelfLifeDaysPlaceholder')"
        :invalid="!!errors.shelfLifeDays"
      />
    </div>
  </div>
</template>
<style scoped>
.box {
  flex: 1;
  min-height: 200px;
  padding: 1rem;
}
</style>
