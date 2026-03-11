<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import ReturnDetails from "../components/ReturnDetails.vue";

import BaseStepper from "@/sharedComponents/stepper/BaseStepper.vue";
import StepperActions from "@/sharedComponents/stepper/StepperActions.vue";
import LineItems from "../components/LineItems.vue";
import Review from "../components/Review.vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { usePurchaseReturnForm } from "../composables/usePurchasReturnForm";

const props = defineProps<{
  mode: "edit" | "create" | "view";
}>();

const {
  initializeForm,
  fetchLookupsData,
  isView,
  handleSubmit,
  id,
  errors,
  documentNumber,
  createReturn,
  updateReturn,
} = usePurchaseReturnForm();

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
    { label: t("purchaseReturn.ReturnInformation") },
    { label: t("ReturnItems.title") },
    { label: t("PhysicalCount.Review") }
  ]
});

onMounted(async () => {
  isView.value = props.mode === "view"
  await fetchLookupsData();
  initializeForm();
});
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="inventory" subtitle="operation.transactions" actionName="purchaseReturn.purchaseReturn" />
    <BaseStepper v-model="activeStep" :steps="steps" :code="documentNumber">
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <div v-if="Object.keys(errors).length > 0"
            class="w-full p-5 border border-dashed border-danger-500 bg-danger-200 my-5 rounded-xl">
            <div v-for="(errorList, field) in errors" :key="field" class="mb-2 text-black">
              <strong>{{ $t(`purchaseReturn.${field}`) }}:</strong> {{ $t(errorList as string) }}
            </div>
          </div>
          <ReturnDetails v-if="activeStep === 0" />
          <LineItems v-else-if="activeStep === 1" @next="nextTab" @prev="previousTab" />
          <Review v-else-if="activeStep === 2" @prev="previousTab" @submit="onSubmit" />
        </template>
      </Card>
      <StepperActions :current="activeStep" :total="steps.length" :isView="isView" :nextText="$t('items.next')"
        :prevText="$t('items.previous')" :finishText="id ? t('button.update') : t('button.create')" @next="nextTab" @previous="previousTab"
        @finish="onSubmit" />
    </BaseStepper>
  </div>
</template>

<style scoped></style>
