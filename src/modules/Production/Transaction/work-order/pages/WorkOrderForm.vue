<script setup lang="ts">
import BaseStepper from '@/sharedComponents/stepper/BaseStepper.vue';
import StepperActions from '@/sharedComponents/stepper/StepperActions.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import WODetails from '../components/WODetails.vue';

const { t } = useI18n();
const route = useRoute();
// const router = useRouter();
const mode = computed(() => {
  if (route.name === 'SalesWaybillView') return 'view';
  if (route.name === 'SalesWaybillEdit') return 'edit';
  return 'create';
});
const activeStep = ref(0);

const nextTab = () => {
  if (activeStep.value < steps.length - 1) activeStep.value++;
};

const previousTab = () => {
  if (activeStep.value > 0) activeStep.value--;
};
const steps = [
  { label: t("steps.woNumber") },
  { label: t("steps.Materials") },
  { label: t("steps.Operations") },
];
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <!-- <div class="flex items-center justify-between mb-6"> -->
     <ScreenHeader title="production" subtitle="masterData"
      :actionName="mode === 'edit' ? $t('workOrder.editWorkCenterInfo') : $t('workOrder.createWorkCenterInfo')" />
    <!-- </div> -->

    <BaseStepper 
      v-model="activeStep" 
      :steps="steps" 
    >
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
            <div v-show="activeStep === 0">
            <WODetails :mode="mode" />
            </div>
            <div v-show="activeStep === 1">
            </div>
            <div v-show="activeStep === 2">  
            </div>

        </template>
      </Card>
      
      <StepperActions 
        v-if="mode !== 'view'"
        :current="activeStep" 
        :total="steps.length"    
        :finishText="mode === 'edit' ? t('button.update') : t('button.create')"
        @next="nextTab" 
        @previous="previousTab" 
        
      />
    </BaseStepper>
  </div>
</template>