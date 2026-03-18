<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import BaseStepper from "@/sharedComponents/stepper/BaseStepper.vue";
import StepperActions from "@/sharedComponents/stepper/StepperActions.vue";

import CountInformation from "../components/CountInformation.vue";
import LineItems from "../components/LineItems.vue";
import Review from "../components/Review.vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { usePhysicalCountForm } from "../composables/usePhysicalCountForm";
const { fetchLookupsData, resetFormToInitialValues, handleSubmit, createPhysicalCount, errors } = usePhysicalCountForm();

const activeStep = ref(0);
const nextTab = () => {
  if (activeStep.value < steps.value.length - 1) activeStep.value++;
};

const previousTab = () => {
  if (activeStep.value > 0) activeStep.value--;
};

const submit = () => {
  console.log("finish wizard");
};


const onSubmit = handleSubmit(async (values) => {
  await createPhysicalCount(values);
});

const steps = computed(() => {
  return [
    { label: t("PhysicalCount.CountInformation") },
    { label: t("PhysicalCount.LineItems") },
    { label: t("PhysicalCount.Review") },
  ];
});

onMounted(async () => {
  await fetchLookupsData();
  resetFormToInitialValues();
});
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="inventory" subtitle="operation.title" actionName="PhysicalCount.NewCount" />
    <BaseStepper v-model="activeStep" :steps="steps">
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <div v-if="Object.keys(errors).length > 0"
            class="w-full p-5 border border-dashed border-danger-500 bg-danger-200 my-5 rounded-xl">
            <div v-for="(errorList, field) in errors" :key="field" class="mb-2 text-black">
              <strong>{{ $t(`PhysicalCount.${field}`) }}:</strong> {{ $t(errorList as string) }}
            </div>
          </div>
          <CountInformation v-if="activeStep === 0" />
          <LineItems v-else-if="activeStep === 1" @prev="previousTab" @next="nextTab" />
          <Review v-else-if="activeStep === 2" @prev="previousTab" @submit="submit" />
        </template>
      </Card>
      <StepperActions :current="activeStep" :total="steps.length" :nextText="$t('items.next')"
        :prevText="$t('items.previous')" :finishText="$t('button.create')" @next="nextTab" @previous="previousTab"
        @finish="onSubmit" />
    </BaseStepper>
  </div>
</template>

<style scoped></style>
