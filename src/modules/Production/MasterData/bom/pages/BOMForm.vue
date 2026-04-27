<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Materials from '../components/Materials.vue';
import OperationForm from '../components/OperationForm.vue';
import HeaderInformation from '../components/HeaderInformation.vue';
import router from '@/app/router';
import { useBOM } from '../composables/useBom';

const { t } = useI18n();
const route = useRoute();
const { createBOM, updateBOM, fetchBOMById } = useBOM();
const stepErrors = ref<string[]>([]);

const mode = computed(() => {
  if (route.name === 'BOMFormEdit') return 'edit';
  return 'create';
});
const activeStep = ref(0);

const nextTab = async () => {
  stepErrors.value = [];
  if (activeStep.value === 0) {
    const result = await headerRef.value?.validate();
    if (!result?.valid) return;
  } else if (activeStep.value === 1) {
    const isValid = await materialsRef.value?.validate();
    if (!isValid) return;
  }

  if (activeStep.value < steps.length - 1) {
    activeStep.value++;
  }
};

const previousTab = () => {
  stepErrors.value = [];
  if (activeStep.value > 0) activeStep.value--;
};

const headerRef = ref();
const materialsRef = ref();
const routingsRef = ref();

onMounted(async () => {
  if (mode.value === 'edit' && route.params.id) {
    const bomData = await fetchBOMById(route.params.id as string);
    if (bomData) {
      headerRef.value?.setValues(bomData);
      materialsRef.value?.setItems(bomData.materials || []);
      routingsRef.value?.setItems(bomData.routings || []);
    }
  }
});

const onFinish = async () => {
  stepErrors.value = [];

  // 1. validate header
  const headerResult = await headerRef.value?.validate();
  if (!headerResult?.valid) {
    activeStep.value = 0;
    return;
  }

  // 2. validate materials
  const materialsValid = await materialsRef.value?.validate();
  if (!materialsValid) {
    activeStep.value = 1;
    return;
  }

  // 3. validate routings
  const routingsValid = await routingsRef.value?.validate();
  if (!routingsValid) {
    activeStep.value = 2;
    return;
  }

  // ✅ لو كله تمام كمل
  const header = headerRef.value?.getValues();
  const materials = materialsRef.value?.getItems();
  const routings = routingsRef.value?.getItems();

  const payload = {
    bomCode: header.bomCode,
    bomName: header.bomName,
    parentItemId: header.parentItemId,
    baseQuantity: header.baseQuantity,
    notes: header.notes ?? null,
    materials: materials.map((m: any) => ({
      itemId: m.itemId,
      quantity: m.quantity,
      uomId: m.unitId,
      notes: m.notes,
      scrapPercentage: m.scrap,
    })),
    routings: routings.map((r: any) => ({
      sequence: r.sequence,
      operationId: r.operationId,
      machineId: r.machineId,
      runTime: r.runTimeHours + r.runTimeMinutes / 60,
      setupTime: r.setupTimeHours + r.setupTimeMinutes / 60,
      notes: r.notes,
    })),
  };

  try {
    if (mode.value === 'edit') {
      await updateBOM(route.params.id as string, payload);
    } else {
      await createBOM(payload);
    }
    router.push({ name: 'BOM' });
  } catch (error) {
    console.error(error);
  }
};
const steps = [
  { label: t("BOM.headerInformation") },
  { label: t("steps.Materials") },
  { label: t("steps.Operations") },
];
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="production" subtitle="masterData"
      :actionName="mode === 'edit' ? $t('BOM.BOMeditInfo') : $t('BOM.BOMcreateInfo')" />
    <BaseStepper v-model="activeStep" :steps="steps">
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <div v-show="activeStep === 0">
            <HeaderInformation :mode="mode" ref="headerRef" />
          </div>
          <div v-show="activeStep === 1">
            <Materials :mode="mode"  ref="materialsRef" />
          </div>
          <div v-show="activeStep === 2">
            <OperationForm :mode="mode" ref="routingsRef" />
          </div>
        </template>
      </Card>

    <StepperActions :current="activeStep" :total="steps.length"
        :finishText="mode === 'edit' ? t('button.update') : t('button.create')" @next="nextTab" @previous="previousTab"
        @finish="onFinish" />
    </BaseStepper>
  </div>
</template>