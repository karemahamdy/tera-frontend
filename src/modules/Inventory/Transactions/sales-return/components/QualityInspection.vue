<script setup lang="ts">
import { useI18n } from "vue-i18n"

const { t } = useI18n()

import { useSalesReturnForm } from "../composables/useSalesReturnForm";
const {
  errors,
  inspector,
  inspectionDate,
  inspectionResult,
  inspectionNotes,
  inspectionResultsLookups,
  id
} = useSalesReturnForm();
</script>

<template>
  <div>

    <p class="font-bold mb-5 text-lg">
      {{ t("purchaseReturn.QualityInspection") }}
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

      <FormInput :label="t('purchaseReturn.Inspector')" v-model="inspector" :error="errors.inspector"
        :placeholder="t('SalesReturn.InspectorPlaceholder')" :invalid="!!errors.inspector" />

      <FormInput :label="t('purchaseReturn.InspectionDate')" type="date" v-model="inspectionDate"
        :error="errors.inspectionDate" :placeholder="t('purchaseReturn.InspectionDatePlaceholder')"
        :invalid="!!errors.inspectionDate" />

      <FormDropdown :label="t('purchaseReturn.InspectionResult')" v-model="inspectionResult"
        :options="inspectionResultsLookups"
        :error="errors.inspectionResult" :placeholder="t('purchaseReturn.InspectionResultPlaceholder')"
        :invalid="!!errors.inspectionResult" :disabled="!!id" class="md:col-span-2" />

      <div class="md:col-span-2">
        <label class="text-gray-700 font-medium mb-2 block">
          {{ $t("purchaseReturn.InspectionNotes") }}
        </label>

        <Textarea v-model="inspectionNotes" :placeholder="$t('purchaseReturn.InspectionNotesPlaceholder')"
          class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.inspectionNotes }" />

        <small v-if="errors.inspectionNotes" class="text-danger-500">
          {{ $t(errors.inspectionNotes) }}
        </small>
      </div>
    </div>
  </div>
</template>
