<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { warehousesSchema } from "../validation/warehousesSchema";

const props = defineProps<{
  mode: "edit" | "create" | "view";
}>();

const editMode = props.mode === "edit";
const isSubmitting = ref(false);

const { errors, defineField, } = useForm({
  validationSchema: warehousesSchema,
  initialValues: {
    warehousesNameAr: "",
    warehousesNameEn: "",
    code: "",
    description: "",
    address: "",
    isActive: ""
  },
});

const accountsOptions = ref([
  { label: "Account 1", value: 1 },
  { label: "Account 2", value: 2 }
]);
const [warehousesNameAr] = defineField("warehousesNameAr");
const [warehousesNameEn] = defineField("warehousesNameEn");
const [code] = defineField("code");
const [isActive] = defineField("isActive");
const [address] = defineField("address");
const [description] = defineField("description");

</script>

<template>
  <div>
    <ScreenHeader title="inventory" subtitle="masterData" actionName="warehouses.title" />

    <card class="p-6 bg-[#ffffff] rounded-[10px]">
      <template #title>
        <div class="flex flex-col px-20">
          <h2 class="heading-title">
            {{ editMode ? $t("warehouses.editWarehouseInfo") : $t("warehouses.addWarehouseInfo") }}
          </h2>
          <p class="subheading-title">
            {{ editMode ? $t("warehouses.editWarehouseInfoDesc") : $t("warehouses.editWarehouseInfoDesc") }}
          </p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="" class="space-y-6 px-20">
          <div class="flex justify-between w-full gap-4">
            <div class="w-[50%]">
             <FormInput :label="$t('warehouses.code')" v-model="code" :error="errors.code"
                :placeholder="$t('WH-MAIN-001')" :invalid="!!errors.code" />
            </div>
            <div class="w-[50%]">
              <FormInput :label="$t('warehouses.name')" v-model="warehousesNameEn"
                :error="errors.warehousesNameEn" :placeholder="$t('Main Central Warehouse')"
                :invalid="!!errors.warehousesNameEn" />
            </div>
          </div>
          <div class="flex justify-between w-full gap-4">
            <div class="w-[50%]">
              <FormInput :label="$t('itemGroup.itemGroupNameAr')" v-model="warehousesNameAr"
                :error="errors.warehousesNameAr" :placeholder="$t('المستودع الرئيسي')"
                :invalid="!!errors.warehousesNameAr" />
            </div>
            <div class="w-[50%]">
              <FormInput :label="$t('branch.address')" v-model="address"
                :error="errors.address" :placeholder="$t('Industrial Zone, Block 5, Cairo – Egypt')"
                :invalid="!!errors.address" />
            </div>
          </div>
          <div class="flex justify-between w-full gap-4">
            <div class="w-[50%]">
             <FormDropdown  :label="$t('warehouses.manager')"
               :options="accountsOptions" :placeholder="$t('Ahmed Hassan')" />
            </div>
            <div class="w-[50%]">
             <FormDropdown  :label="$t('warehouses.warehouseType')"
               :options="accountsOptions" :placeholder="$t('Normal')" />
            </div>
          </div>
          <div>
            <label class="text-gray-700 font-medium mb-2 block">
              {{ $t("itemGroup.description") }}
            </label>

            <Textarea v-model="description" :placeholder="$t('warehouses.descriptionPlaceholder')"
              class="mt-1 w-full p-3 border rounded-lg" rows="2" :class="{ 'border-danger-500': errors.description }"
              :disabled="isSubmitting" />

            <small v-if="errors.description" class="text-danger-500">
              {{ $t(errors.description) }}
            </small>
          </div>
         <div class="flex justify-between w-full gap-4">
            <div class="w-[50%]">
              <FormDropdown :label="$t('warehouses.operationHours')" :options="accountsOptions"
                :placeholder="$t('8:00 AM – 6:00 PM')" />
            </div>
            <div class="w-[50%]">
              <FormDropdown :label="$t('warehouses.LDC')" :options="accountsOptions"
                :placeholder="$t('LDC-INV-001 – Main Inventory Trading Ledger')" />
            </div>
          </div>

          <div class="flex justify-between w-full gap-4">
            <div class="w-[50%]">
              <FormDropdown :label="$t('warehouses.transferAccount')" :options="accountsOptions"
                :placeholder="$t('1305 – Warehouse Transfer Account')" />
            </div>
            <div class="w-[50%] m-auto">
             <ToggleItem :title="$t('warehouses.warehouseStatus')" label="Active" v-model="isActive" />
            </div>
          </div>

          <div class="flex justify-between gap-4 mb-4 w-full">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'warehouses' }"
              :disabled="isSubmitting" />

            <BaseButton type="submit" :label="editMode ? 'button.save' : 'userGroup.createGroup'" variant="primary"
              block :disabled="isSubmitting" :loading="isSubmitting" />
          </div>
        </form>
      </template>
    </card>
  </div>
</template>

<style scoped></style>