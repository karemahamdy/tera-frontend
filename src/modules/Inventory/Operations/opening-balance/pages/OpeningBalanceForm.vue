<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import BaseStepper from '@/sharedComponents/stepper/BaseStepper.vue';
import StepperActions from '@/sharedComponents/stepper/StepperActions.vue';

import OpeningBalanceInfo from '../components/OpeningBalanceInfo.vue';
import OpeningBalanceReview from '../components/OpeningBalanceReview.vue';
import { useOpeningBalance } from "../composables/useOpeningBalance";

const { resetFormToInitialValues, handleSubmit, createOpeningBalance, errors } = useOpeningBalance();
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const activeStep = ref(0);
const nextTab = () => {
  if (activeStep.value < steps.value.length - 1) activeStep.value++;
};

const previousTab = () => {
  if (activeStep.value > 0) activeStep.value--;
};

const onSubmit = handleSubmit(
  (values) => {
    createOpeningBalance(values);
  },
);

const steps = computed(() => {
  return [{ label: t("OpeningBalance.openingBalanceInfo") },
  { label: t("OpeningBalance.review") }]
});

onMounted(() => {
  resetFormToInitialValues();
});
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="inventory" subtitle="operation.title" actionName="OpeningBalance.createOpeningBalance" />
    <BaseStepper v-model="activeStep" :steps="steps">
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <div v-if="Object.keys(errors).length > 0"
            class="w-full p-5 border border-dashed border-danger-500 bg-danger-200 my-5 rounded-xl">
            <div v-for="(errorList, field) in errors" :key="field" class="mb-2 text-black">
              <strong>{{ $t(`OpeningBalance.${field}`) }}:</strong> {{ $t(errorList as string) }}
            </div>
          </div>
          <OpeningBalanceInfo v-if="activeStep === 0" title="OpeningBalance.createOpeningBalance" subtitle="OpeningBalance.createOpeningBalanceInfo" />
          <OpeningBalanceReview v-else-if="activeStep === 1" @prev="previousTab" @submit="onSubmit" />
        </template>
      </Card>
      <StepperActions :current="activeStep" :total="steps.length" :nextText="$t('items.next')"
        :prevText="$t('items.previous')" :finishText="$t('OpeningBalance.createOpeningBalance')" @next="nextTab"
        @previous="previousTab" @finish="onSubmit" />

    </BaseStepper>
  </div>
</template>

<style scoped></style>