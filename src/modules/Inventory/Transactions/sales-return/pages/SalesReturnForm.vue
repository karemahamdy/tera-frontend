<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import ReturnDetails from "../components/ReturnDetails.vue";
import LineItems from "../components/LineItems.vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  mode: "edit" | "create" | "view";
}>();

import { useSalesReturnForm } from "../composables/useSalesReturnForm";
import QualityInspection from "../components/QualityInspection.vue";

const form = useSalesReturnForm();
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
} = form;

const activeStep = ref<number>(0);
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
    { label: t("purchaseReturn.QualityInspection") },
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
          <ReturnDetails v-if="activeStep === 0" :form="form" />
          <LineItems v-else-if="activeStep === 1" :form="form" @next="nextTab" @prev="previousTab" />
          <QualityInspection v-else-if="activeStep === 2" :form="form" @prev="previousTab" @submit="onSubmit" />
        </template>
      </Card>
      <StepperActions :current="activeStep" :total="steps.length" :nextText="$t('items.next')"
        :prevText="$t('items.previous')" :finishText="id ? t('button.update') : t('button.create')" :isView="isView"
        @next="nextTab" @previous="previousTab" @finish="onSubmit" />
    </BaseStepper>
  </div>
</template>

<style scoped></style>
