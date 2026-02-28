<script setup lang="ts">
import { onMounted, ref } from "vue";
import ReturnDetails from "../components/ReturnDetails.vue";

import BaseStepper from "@/sharedComponents/stepper/BaseStepper.vue";
import StepperActions from "@/sharedComponents/stepper/StepperActions.vue";
import LineItems from "../components/LineItems.vue";
import Review from "../components/Review.vue";

import { usePurchaseReturnForm } from "../composables/usePurchasReturnForm";
const {
  initializeForm,
  handleSubmit,
  id,
  errors,
  createSalesReturn,
  updateSalesReturn,
} = usePurchaseReturnForm();

const activeStep = ref(0);
const nextTab = () => {
  if (activeStep.value < steps.length - 1) activeStep.value++;
};

const previousTab = () => {
  if (activeStep.value > 0) activeStep.value--;
};


const onSubmit = handleSubmit(async (values) => {
  console.log(`values: ${values}`);
  
  if (id) {
    await updateSalesReturn(id, values);
  } else {
    await createSalesReturn(values);
  }
});

const steps = [
  { label: "Return Information" },
  { label: "Return Items" },
  { label: "Review" },
];

onMounted(() => {
  initializeForm();
});
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader
      title="inventory"
      subtitle="operation.transactions"
      actionName="purchaseWaybill.purchaseWaybill"
    />
    <BaseStepper v-model="activeStep" :steps="steps" code="PW-2026-001">
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <div v-if="Object.keys(errors).length > 0"
            class="w-full p-5 border border-dashed border-danger-500 bg-danger-200 my-5 rounded-xl">
            <div v-for="(errorList, field) in errors" :key="field" class="mb-2 text-black">
              <strong>{{ $t(`PurchaseReturn.${field}`) }}:</strong> {{ $t(errorList as string) }}
            </div>
          </div>
          <ReturnDetails v-if="activeStep === 0" />
          <LineItems
            v-else-if="activeStep === 1"
            @next="nextTab"
            @prev="previousTab"
          />
          <Review
            v-else-if="activeStep === 2"
            @prev="previousTab"
            @submit="onSubmit"
          />
        </template>
      </Card>
      <StepperActions
        :current="activeStep"
        :total="steps.length"
        nextText="Next"
        prevText="Back"
        finishText="Create"
        @next="nextTab"
        @previous="previousTab"
        @finish="onSubmit"
      />
    </BaseStepper>
  </div>
</template>

<style scoped></style>
