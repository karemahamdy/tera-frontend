<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SalesDetails from '../components/SalesDetails.vue';
import WarehouseDetails from '../components/WarehouseDetails.vue';
import BaseStepper from '@/sharedComponents/stepper/BaseStepper.vue';
import StepperActions from '@/sharedComponents/stepper/StepperActions.vue';
import LineItems from '../components/LineItems.vue';
import Payment from '../components/Payment.vue';
import { useSalesWaybill } from '../composables/useSales';
import { useI18n } from "vue-i18n";
import { toastService } from '@/app/services/toastService';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { fetchSalesWaybillById, createSalesWaybill, updateSalesWaybill } = useSalesWaybill();

const id = computed(() => route.params.id as string | undefined);
const mode = computed(() => {
  if (route.name === 'SalesWaybillView') return 'view';
  if (route.name === 'SalesWaybillEdit') return 'edit';
  return 'create';
});

const isDisabled = computed(() => mode.value === 'view');

const dataReady = computed(() => !id.value || !!formData.value.customerDetails);

const defaultFormData = {
  customerDetails: {
    documentNumber: "",
    customerId: null,
    customerName: "",
    salesOrderRef: "",
    trackingNumber: "",
    shippingAddress: "",
    invoiceNumber: "",
    waybillDate: new Date(),
    deliveryDate: new Date(),
  },
  paymentTerms: {
    currencyId: null,
    currencyCode: "",
    exchangeRate: 1,
    rateDate: new Date(),
    baseCurrencyCode: "USD",
  },
  warehouseDetails: null,
  lineItems: [],
  paymentInfo: null,
  notes: null
};

const formData = ref<any>({ ...defaultFormData });

const activeStep = ref(0);

const updateCustomerData = (data: any) => {
  console.log('SalesWaybillForm received customer update:', data);
  formData.value.customerDetails = data.customerDetails;
  formData.value.paymentTerms = { ...formData.value.paymentTerms, ...data.paymentTerms };
  console.log('SalesWaybillForm formData.customerDetails after update:', formData.value.customerDetails);
};

const updateWarehouseData = (data: any) => {
  formData.value.warehouseDetails = data;
};

const updateLineItemsData = (data: any[]) => {
  formData.value.lineItems = data;
};

const updatePaymentData = (data: any) => {
  formData.value.paymentInfo = data.paymentInfo;
  formData.value.paymentTerms = { ...formData.value.paymentTerms, ...data.paymentTerms };
  formData.value.notes = data.notes;
};

const nextTab = () => {
  if (activeStep.value < steps.length - 1) activeStep.value++;
};

const previousTab = () => {
  if (activeStep.value > 0) activeStep.value--;
};

const submit = async () => {
  try {
    console.log('Submitting with formData:', formData.value);
    const exchangeRate = formData.value.paymentTerms?.exchangeRate !== null && 
          formData.value.paymentTerms?.exchangeRate !== undefined && 
          formData.value.paymentTerms?.exchangeRate !== '' 
            ? Number(formData.value.paymentTerms.exchangeRate) 
            : 1;

    const payload = {
      customerDetails: formData.value.customerDetails,
      paymentTerms: {
        ...formData.value.paymentTerms,
        exchangeRate
      },
      warehouseDetails: formData.value.warehouseDetails,
      paymentInfo: formData.value.paymentInfo ? {
        ...formData.value.paymentInfo,
        subTotalBase: Number(((formData.value.paymentInfo.subTotal || 0) * exchangeRate).toFixed(2)),
        taxAmountBase: Number(((formData.value.paymentInfo.totalTax || 0) * exchangeRate).toFixed(2)),
        globalDiscountBase: Number(((formData.value.paymentInfo.globalDiscount || 0) * exchangeRate).toFixed(2)),
        grandTotalBase: Number(((formData.value.paymentInfo.grandTotal || 0) * exchangeRate).toFixed(2))
      } : null,
      notes: formData.value.notes
    };
    
    console.log('Final payload before lineItems:', payload);
    
    const finalPayload = {
        ...payload,
        lineItems: formData.value.lineItems.map((item: any) => ({
            id: item.id || undefined, // Preserve ID for updates
            itemId: item.itemId,
            quantity: Number(item.quantity) || 0,
            unitId: item.unitId || null,
            warehouseId: item.warehouseId || formData.value.warehouseDetails?.warehouseId || null,
            zoneId: item.zoneId || formData.value.warehouseDetails?.zoneId || null,
            locationId: item.locationId || null,
            unitPrice: Number(item.unitPrice) || 0,
            unitTaxPercent: Number(item.tax) || 0,
            note: item.note || '',
            isBlocked: item.isBlocked || false,
            serials: (item.serials || []).map((s: any) => ({
                mainSerial: s.serial || s.mainSerial || '',
                quantity: Number(s.qty ?? s.quantity) || 0,
                batchNumber: s.batch || s.batchNumber || null,
                expireDate: s.expire || s.expireDate ? new Date((s.expire || s.expireDate)).toISOString() : null,
                serialNumber2: s.serialNumber2 || null,
                serialNumber3: s.serialNumber3 || null,
                comment: s.comment || null,
            }))
        }))
    };
    
    console.log('Final payload to send:', finalPayload);
    
    if (mode.value === 'edit' && id.value) {
      await updateSalesWaybill(id.value, finalPayload);
    } else {
      await createSalesWaybill(finalPayload);
    }
    await router.push("/sales-waybill");
  } catch (error: any) {
   toastService.error(error);
  }
};

const steps = [
  { label: t("salesWaybill.CustomerDetails") },
  { label: t("steps.warehouseDetails") },
  { label: t("steps.lineItems") },
  { label: t("steps.payment") }
];

const mapApiToForm = (apiData: any) => {
  const cd = apiData.customerDetails ?? {};
  const pt = apiData.paymentTerms ?? {};
  const wd = apiData.warehouseDetails ?? {};
  const pi = apiData.paymentInfo ?? {};

  return {
    customerDetails: {
      documentNumber: cd.documentNumber ?? "",
      customerId:     cd.customerId ?? null,
      customerName:   cd.customerName ?? "",
      salesOrderRef:  cd.salesOrderRef ?? "",
      trackingNumber: cd.trackingNumber ?? "",
      shippingAddress:cd.shippingAddress ?? "",
      invoiceNumber:  cd.invoiceNumber ?? "",
      waybillDate:    cd.waybillDate ? new Date(cd.waybillDate) : new Date(),
      deliveryDate:   cd.deliveryDate ? new Date(cd.deliveryDate) : new Date(),
    },
    paymentTerms: {
      currencyId:       pt.currencyId ?? null,
      currencyCode:     pt.currencyCode ?? "",
      exchangeRate:     pt.exchangeRate ?? 1,
      rateDate:         pt.rateDate ? new Date(pt.rateDate) : new Date(),
      baseCurrencyCode: pt.baseCurrencyCode ?? "SAR",
    },
    warehouseDetails: {
      warehouseId:   wd.warehouseId ?? "",
      warehouseName: wd.warehouseName ?? "",
      zoneId:        wd.zoneId ?? null,
      zoneName:      wd.zoneName ?? "",
    },
    lineItems: (apiData.lineItems || []).map((item: any) => ({
      id:           item.id,
      itemId:       item.itemId,
      code:         item.itemCode,
      name:         item.itemName,
      quantity:     item.quantity,
      unitId:       item.unitId,
      uom:          item.unitName,
      unitPrice:    item.unitPrice,
      tax:          item.unitTaxPercent,
      total:        item.lineTotal,
      warehouseId:  item.warehouseId,
      warehouseName:item.warehouseName,
      zoneId:       item.zoneId,
      zone:         item.zoneName,
      zoneName:     item.zoneName,
      locationId:   item.locationId,
      locationCode: item.locationCode,
      note:         item.note,
      isBlocked:    item.isBlocked,
      trackingType: item.trackingType,
      balance:      item.balance ?? 0,
      tracked:      item.trackingType === 'Serial',
      serials: (item.serials || []).map((s: any) => ({
        id:            s.id,
        mainSerial:    s.mainSerial,
        qty:           s.quantity,
        batchNumber:   s.batchNumber,
        expireDate:    s.expireDate,
        serialNumber2: s.serialNumber2,
        serialNumber3: s.serialNumber3,
        comment:       s.comment,
      }))
    })),
    paymentInfo: {
      paymentType:    pi.paymentType ?? "Payable",
      paymentTermId:  pi.paymentTermId ?? null,
      paymentTermName:pi.paymentTermName ?? "",
      incoterm:       pi.incoterm ?? null,
      subTotal:       pi.subTotal ?? 0,
      totalTax:       pi.totalTax ?? 0,
      globalDiscount: pi.globalDiscount ?? 0,
      grandTotal:     pi.grandTotal ?? 0,
    },
    notes: apiData.notes ?? null,
  };
};


onMounted(async () => {
  if (id.value) {
    const result = await fetchSalesWaybillById(id.value);
    if (result) {
      formData.value = mapApiToForm(result);
    }
  }
});
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <div class="flex items-center justify-between mb-6">
      <ScreenHeader
        title="inventory"
        subtitle="operation.transactions"
        :actionName="mode === 'create' ? 'salesWaybill.addSalesWaybill' : 'salesWaybill.viewSalesWaybill'"
        class="!mb-0"
      />
    </div>

    <BaseStepper 
      v-model="activeStep" 
      :steps="steps" 
      :code="formData?.customerDetails?.documentNumber ?? ''"
    >
      <Card class="mt-6 rounded-2xl shadow-sm">
        <template #content>
          <div v-if="!dataReady" class="flex justify-center items-center py-20">
            <ProgressSpinner />
          </div>
          <template v-else>
            <div v-show="activeStep === 0">
              <SalesDetails 
                :salesDetails="formData?.customerDetails"
                :paymentTerms="formData?.paymentTerms"
                :disabled="isDisabled"
                @update="updateCustomerData" 
              />
            </div>
            <div v-show="activeStep === 1">
              <WarehouseDetails 
                :warehouseDetails="formData?.warehouseDetails"
                :disabled="isDisabled"
                @update="updateWarehouseData" 
              />
            </div>
            <div v-show="activeStep === 2">
              <LineItems 
                :lineItems="formData?.lineItems" 
                :disabled="isDisabled"
                @update="updateLineItemsData"
                @next="nextTab" 
                @prev="previousTab" 
              />
            </div>
            <div v-show="activeStep === 3">
              <Payment 
                :lineItems="formData?.lineItems"
                :paymentInfo="formData?.paymentInfo"
                :paymentTerms="formData?.paymentTerms"
                :notes="formData?.notes"
                :disabled="isDisabled"
                @update="updatePaymentData"
                @prev="previousTab" 
                @submit="submit" 
              />
            </div>
          </template>
        </template>
      </Card>
      
      <StepperActions 
        v-if="mode !== 'view'"
        :current="activeStep" 
        :total="steps.length" 
        nextText="Next" 
        prevText="Back" 
        :finishText="mode === 'edit' ? 'Update' : 'Create'"
        @next="nextTab" 
        @previous="previousTab" 
        @finish="submit" 
      />
    </BaseStepper>
  </div>
</template>

<style scoped></style>