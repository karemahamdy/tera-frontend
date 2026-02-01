<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useForm } from "vee-validate";
import FormDropdown from "@/sharedComponents/inputs/FormDropdown.vue";
import { LDCSchema } from "../validation/LDCSchema";
import { useLookups } from "@/composables/useLookups";
import { useLDC } from "../composables/useLDC";
import router from "@/app/router";

const props = defineProps<{
  mode: "edit" | "create";
}>();

const editMode = props.mode === "edit";
const isSubmitting = ref(false);

const {
 accountLookups,
 getAccountsLookups
} = useLookups();
const { createLDC } = useLDC()

onMounted(async () => {
  await Promise.all([getAccountsLookups()]);
  
});
const accountFields = [
  { key: "purchaseAccountId", label: "LDC.localPurchaseAccount" },
  { key: "localSalesAccountId", label: "LDC.localSalesAccount" },
  { key: "localPurchaseReturnId", label: "LDC.localPurchaseReturn" },
  { key: "localSalesReturnAccountId", label: "LDC.localSalesReturn" },
  { key: "importPurchaseAccountId", label: "LDC.importPurchaseAccount" },
  { key: "importPurchaseReturnsAccountId", label: "LDC.importPurchaseReturn" },
  { key: "exportSalesAccountId", label: "LDC.exportSalesAccount" },
  { key: "exportSalesReturnAccountId", label: "LDC.exportSalesReturn" },
  { key: "physicalCountAdjustmentId", label: "LDC.physicalCount" },
  { key: "cogsAccountId", label: "LDC.cogs" },
];

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: LDCSchema,
  initialValues: {
    code: "",
    nameAr: "",
    nameEn: "",
    inventoryAdjustment: "",
    ...Object.fromEntries(accountFields.map(f => [f.key, null]))
  }
});

const [code] = defineField("code");
const [nameAr] = defineField("nameAr");
const [nameEn] = defineField("nameEn");
const [inventoryAdjustment] = defineField("inventoryAdjustment");

const fields = Object.fromEntries(
  accountFields.map((f: any) => [f.key, defineField(f.key)[0]])
) as Record<string, any>;

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;

  try {
    const payload = {
      code: values.code,
      nameAr: values.nameAr,
      nameEn: values.nameEn,
      inventoryAdjustment: values.inventoryAdjustment,
      purchaseAccountId: values.purchaseAccountId,
      localSalesAccountId: values.localSalesAccountId,
      localPurchaseReturnId: values.localPurchaseReturnId,        
      localSalesReturnAccountId: values.localSalesReturnAccountId,
      importPurchaseAccountId: values.importPurchaseAccountId,
      importPurchaseReturnsAccountId: values.importPurchaseReturnsAccountId,
      exportSalesAccountId: values.exportSalesAccountId,
      exportSalesReturnAccountId: values.exportSalesReturnAccountId,
      physicalCountAdjustmentId: values.physicalCountAdjustmentId,
      cogsAccountId: values.cogsAccountId
    };

    await createLDC(payload);
    router.push({ name: "LDC" });
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false;
  }
});

</script>


<template>
  <div>
    <ScreenHeader title="inventory" subtitle="masterData" actionName="LDC.title" />

    <card class="p-6 bg-[#ffffff] rounded-[10px]">
      <template #title>
        <div class="flex flex-col px-20">
          <h2 class="heading-title">
            {{ editMode ? $t("LDC.editLDCInfo") : $t("LDC.addLDCInfo") }}
          </h2>
          <p class="subheading-title">
          {{ editMode ? $t("LDC.editLDCInfoDesc") : $t("LDC.addLDCInfoDesc") }}
          </p>
        </div>
      </template>

      <template #content>
        <form form @submit.prevent="onSubmit" class="space-y-6 px-20">
         <FormInput :label="$t('LDC.code')" v-model="code" :placeholder="$t('LDC.codePlaceholder')"
            :error="errors.code" :invalid="!!errors.code" />

          <div class="grid grid-cols-2 gap-4">        
            <FormInput :label="$t('LDC.nameEn')" v-model="nameEn" :placeholder="$t('LDC.nameEnPlaceholder')"
            :error="errors.nameEn" :invalid="!!errors.nameEn" :disabled="editMode" />
            <FormInput :label="$t('LDC.nameAr')" v-model="nameAr" :placeholder="$t('LDC.nameArPlaceholder')"
              :error="errors.nameAr" :invalid="!!errors.nameAr" :disabled="editMode" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormDropdown v-for="field in accountFields" :key="field.key" :label="$t(field.label)"
              v-model="fields[field.key]" :options="accountLookups" :placeholder="$t('LDC.select') + ' ' + $t(field.label)"
               />
          </div>

          <FormDropdown :label="$t('LDC.inventoryAdjustment')"
            v-model="inventoryAdjustment" :options="accountLookups" :placeholder="$t('LDC.select') + ' ' + $t('LDC.inventoryAdjustment')"
            :error="errors.inventoryAdjustment" />

          <div class="flex justify-between gap-4 mb-4 w-full">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'LDC' }"
              :disabled="isSubmitting" />

            <BaseButton type="submit" :label="editMode ? 'button.save' : 'button.create'" variant="primary"
              block :disabled="isSubmitting" :loading="isSubmitting" />
          </div>
        </form>
      </template>
    </card>
  </div>
</template>

<style scoped></style>