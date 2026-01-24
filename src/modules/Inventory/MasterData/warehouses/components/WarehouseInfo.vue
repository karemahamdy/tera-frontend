<script lang="ts" setup>
import { ref } from "vue";
import { useForm } from "vee-validate";
import { warehousesSchema } from "../validation/warehousesSchema";

const { errors, defineField } = useForm({
  validationSchema: warehousesSchema,
  initialValues: {
    warehousesNameAr: "",
    warehousesNameEn: "",
    code: "",
    description: "",
    address: "",
    isActive: false,
    
  }
});

const [warehousesNameAr] = defineField("warehousesNameAr");
const [warehousesNameEn] = defineField("warehousesNameEn");
const [code] = defineField("code");
const [address] = defineField("address");
const [description] = defineField("description");
const [isActive] = defineField("isActive");

const accountsOptions = ref([
    { label: "Account 1", value: 1 },
    { label: "Account 2", value: 2 }
]);
</script>

<template>
    <form class="space-y-6">
        <div class="flex gap-4">
            <FormInput class="w-1/2" :label="$t('warehouses.code')" v-model="code" :error="errors.code"
                :invalid="!!errors.code" placeholder="WH-MAIN-001" />

            <FormInput class="w-1/2" :label="$t('warehouses.name')" v-model="warehousesNameEn"
                :error="errors.warehousesNameEn" :invalid="!!errors.warehousesNameEn"
                placeholder="Main Central Warehouse" />
        </div>

        <div class="flex gap-4">
            <FormInput class="w-1/2" :label="$t('itemGroup.itemGroupNameAr')" v-model="warehousesNameAr"
                :error="errors.warehousesNameAr" :invalid="!!errors.warehousesNameAr" placeholder="المستودع الرئيسي" />

            <FormInput class="w-1/2" :label="$t('branch.address')" v-model="address" :error="errors.address"
                :invalid="!!errors.address" placeholder="Industrial Zone, Block 5, Cairo – Egypt" />
        </div>

        <div class="flex gap-4">
            <FormDropdown class="w-1/2" :label="$t('warehouses.manager')" :options="accountsOptions"
                placeholder="Ahmed Hassan" />

            <FormDropdown class="w-1/2" :label="$t('warehouses.warehouseType')" :options="accountsOptions"
                placeholder="Normal" />
        </div>

        <div>
            <label class="block mb-2 font-medium">
                {{ $t("itemGroup.description") }}
            </label>

            <Textarea v-model="description" rows="2" class="w-full p-3 border rounded-lg"
                :class="{ 'border-danger-500': errors.description }" :placeholder="$t('warehouses.descriptionPlaceholder')" />

            <small v-if="errors.description" class="text-danger-500">
                {{ $t(errors.description) }}
            </small>
        </div>

        <div class="flex gap-4">
            <FormDropdown class="w-1/2" :label="$t('warehouses.operationHours')" :options="accountsOptions"
                placeholder="8:00 AM – 6:00 PM" />

            <FormDropdown class="w-1/2" :label="$t('warehouses.LDC')" :options="accountsOptions"
                placeholder="LDC-INV-001" />
        </div>

        <div class="flex gap-4 items-center">
            <FormDropdown class="w-1/2" :label="$t('warehouses.transferAccount')" :options="accountsOptions"
                placeholder="1305 – Warehouse Transfer Account" />

            <ToggleItem class="w-1/2" :title="$t('warehouses.warehouseStatus')" label="Active" v-model="isActive" />
        </div>
    </form>
</template>