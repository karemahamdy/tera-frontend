<script setup lang="ts">
import BaseStepper from '@/sharedComponents/stepper/BaseStepper.vue';
import StepperActions from '@/sharedComponents/stepper/StepperActions.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import WODetails from '../components/WODetails.vue';
import Materials from '../components/Materials.vue';
import Operations from '../components/Operations.vue';
import ProductionReceiptsDetails from '../components/ProductionReceiptsDetails.vue';

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
  { label: t("steps.RejectWaste") },
];
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
            <ScreenHeader title="production" subtitle="operation.transactions" 
             :actionName="mode === 'edit' ? $t('ProductionReceipts.ProductionReceiptseditInfo') : $t('ProductionReceipts.ProductionReceiptscreateInfo')" />

    <BaseStepper v-model="activeStep" :steps="steps" >
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
            <div v-show="activeStep === 0">
            <ProductionReceiptsDetails :mode="mode" />
            </div>
            <div v-show="activeStep === 1">
              <Materials :mode="mode" />
            </div>
            <div v-show="activeStep === 2">
              <Operations :mode="mode" />  
            </div>
             <div v-show="activeStep === 3">
              <!-- <RejectWaste :mode="mode" />   -->
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