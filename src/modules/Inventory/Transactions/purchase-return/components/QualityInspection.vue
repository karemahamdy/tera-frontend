<script setup lang="ts">
import { ref, reactive } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const InspectionResult = ref("")
const Inspector = ref(null)
const InspectionDate = ref()
const InspectionNotes = ref()

const id = ref(null)


const errors = reactive({
  SalesReturnNumber: "",
  Inspector: "",
  InspectionNotes: "",
  InspectionResult: ""
})
</script>

<template>
  <div>

    <p class="font-bold mb-5 text-lg">
      {{ t("purchaseReturn.QualityInspection") }}
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

      <FormDropdown :label="t('purchaseReturn.Inspector')" v-model="Inspector" :error="errors.Inspector"
        :placeholder="t('purchaseReturn.InspectorPlaceholder')" :invalid="!!errors.Inspector" />

      <div>
        <label class="block text-gray-600 text-lg">
          {{ t("purchaseReturn.InspectionDate") }}
        </label>
        <DatePicker v-model="InspectionDate" showIcon fluid iconDisplay="input"
          :placeholder="t('purchaseReturn.InspectionDatePlaceholder')" />
      </div>
<FormDropdown :label="t('purchaseReturn.InspectionResult')" v-model="InspectionResult"
      :error="errors.InspectionResult" :placeholder="t('purchaseReturn.InspectionResultPlaceholder')"
      :invalid="!!errors.InspectionResult" :disabled="!!id" class="md:col-span-2"/>

      <div class="md:col-span-2">
        <label class="text-gray-700 font-medium mb-2 block">
          {{ $t("purchaseReturn.InspectionNotes") }}
        </label>

        <Textarea v-model="InspectionNotes" :placeholder="$t('SalesReturn.InspectionNotesPlaceholder')"
          class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.InspectionNotes }" />

        <small v-if="errors.InspectionNotes" class="text-danger-500">
          {{ $t(errors.InspectionNotes) }}
        </small>
      </div>
    </div>
  </div>
</template>
