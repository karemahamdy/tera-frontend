<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import ReturnDetails from "../components/ReturnDetails.vue";

import BaseStepper from "@/sharedComponents/stepper/BaseStepper.vue";
import StepperActions from "@/sharedComponents/stepper/StepperActions.vue";
import LineItems from "../components/LineItems.vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  mode: "edit" | "create" | "view";
}>();

import { useSalesReturnForm } from "../composables/useSalesReturnForm";
import QualityInspection from "../components/QualityInspection.vue";
const {
  initializeForm,
  fetchLookupsData,
  handleSubmit,
  isView,
  id,
  errors,
  documentNumber,
  createReturn,
  updateReturn,
} = useSalesReturnForm();

const activeStep = ref(0);
const nextTab = () => {
  if (activeStep.value < steps.value.length - 1) activeStep.value++;
};

const previousTab = () => {
  if (activeStep.value > 0) activeStep.value--;
};


const onSubmit = handleSubmit(async (values) => {
  if (id) {
    await updateReturn(id, values);
  } else {
    await createReturn(values);
  }
});


const steps = computed(() => {
  return [
    { label: t("SalesReturn.ReturnInformation") },
    { label: t("ReturnItems.title") },
    { label: t("SalesReturn.QualityInspection") }
  ]
});

onMounted(() => {
  isView.value = props.mode === "view"

  initializeForm();
  fetchLookupsData();
});
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="inventory" subtitle="operation.transactions" actionName="SalesReturn.salesReturn" />
    <BaseStepper v-model="activeStep" :steps="steps" :code="documentNumber">
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <div v-if="Object.keys(errors).length > 0"
            class="w-full p-5 border border-dashed border-danger-500 bg-danger-200 my-5 rounded-xl">
            <div v-for="(errorList, field) in errors" :key="field" class="mb-2 text-black">
              <strong>{{ $t(`SalesReturn.${field}`) }}:</strong> {{ $t(errorList as string) }}
            </div>
          </div>
          <ReturnDetails v-if="activeStep === 0" />
          <LineItems v-else-if="activeStep === 1" @next="nextTab" @prev="previousTab" />
          <QualityInspection v-else-if="activeStep === 2" @prev="previousTab" @submit="onSubmit" />
        </template>
      </Card>
      <StepperActions :current="activeStep" :total="steps.length" nextText="Next" prevText="Back" finishText="Create"
        :isView="isView" @next="nextTab" @previous="previousTab" @finish="onSubmit" />
    </BaseStepper>
  </div>
</template>

<style scoped></style>
