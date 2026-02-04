<script lang="ts" setup>
import { computed } from "vue";
import type { AddWarehouses } from "../types/warehouse";

const props = defineProps<{
    modelValue: Partial<AddWarehouses>;
    errors: Record<string, string | undefined>;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: Partial<AddWarehouses>): void;
}>();

const data = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val)
});

// Helper to update shallow properties
const update = (key: keyof AddWarehouses, value: any) => {
    emit("update:modelValue", { ...props.modelValue, [key]: value });
};

const accountsOptions = [
    { label: "Account 1", value: "acc-1" },
    { label: "Account 2", value: "acc-2" }
];

const managersOptions = [
    { label: "Ahmed Hassan", value: "" }, // Example UUID
    { label: "Manager 2", value: "" }
];

const typeOptions = [
    { label: "Normal", value: "Normal" },
    
    { label: "Professional", value: "Professional" }
];

const ldcOptions = [
    { label: "LDC-INV-001", value: "" },
];
</script>

<template>
    <div class="space-y-6">
        <div class="flex gap-4">
            <FormInput class="w-1/2" :label="$t('warehouses.code')" 
                :modelValue="data.code" 
                @update:modelValue="v => update('code', v)"
                :error="errors.code"
                :invalid="!!errors.code" placeholder="WH-MAIN-001" />

            <FormInput class="w-1/2" :label="$t('warehouses.name')" 
                :modelValue="data.nameEn" 
                @update:modelValue="v => update('nameEn', v)"
                :error="errors.nameEn" 
                :invalid="!!errors.nameEn"
                placeholder="Main Central Warehouse" />
        </div>

        <div class="flex gap-4">
            <FormInput class="w-1/2" :label="$t('itemGroup.itemGroupNameAr')" 
                :modelValue="data.nameAr" 
                @update:modelValue="v => update('nameAr', v)"
                :error="errors.nameAr" 
                :invalid="!!errors.nameAr" placeholder="المستودع الرئيسي" />

            <FormInput class="w-1/2" :label="$t('branch.address')" 
                :modelValue="data.address" 
                @update:modelValue="v => update('address', v)"
                :error="errors.address"
                :invalid="!!errors.address" placeholder="Industrial Zone, Block 5, Cairo – Egypt" />
        </div>

        <div class="flex gap-4">
            <FormDropdown class="w-1/2" :label="$t('warehouses.manager')" 
                :modelValue="data.managerId" 
                @update:modelValue="v => update('managerId', v)"
                :options="managersOptions"
                placeholder="Select Manager" />

            <FormDropdown class="w-1/2" :label="$t('warehouses.warehouseType')" 
                :modelValue="data.type" 
                @update:modelValue="v => update('type', v)"
                :options="typeOptions"
                placeholder="Normal" />
        </div>

        <div>
            <label class="block mb-2 font-medium">
                {{ $t("itemGroup.description") }}
            </label>

            <Textarea :modelValue="data.description" 
                @update:modelValue="v => update('description', v)"
                rows="2" class="w-full p-3 border rounded-lg"
                :class="{ 'border-danger-500': errors.description }" :placeholder="$t('warehouses.descriptionPlaceholder')" />

            <small v-if="errors.description" class="text-danger-500">
                {{ $t(errors.description) }}
            </small>
        </div>

        <div class="flex gap-4">
            <FormDropdown class="w-1/2" :label="$t('warehouses.operationHours')" 
                :modelValue="data.operationalHours" 
                @update:modelValue="v => update('operationalHours', v)"
                :options="accountsOptions"
                placeholder="8:00 AM – 6:00 PM" />

            <FormDropdown class="w-1/2" :label="$t('warehouses.LDC')" 
                :modelValue="data.defaultLedgerCardId" 
                @update:modelValue="v => update('defaultLedgerCardId', v)"
                :options="ldcOptions"
                placeholder="LDC-INV-001" />
        </div>

        <div class="flex gap-4 items-center">
            <FormDropdown class="w-1/2" :label="$t('warehouses.transferAccount')"
                :modelValue="data.transferAccountId" 
                @update:modelValue="v => update('transferAccountId', v)"
                :options="accountsOptions"
                placeholder="1305 – Warehouse Transfer Account" />

            <div class="w-1/2 flex items-center justify-between ">
                 <ToggleItem class="w-1/2" :title="$t('warehouses.warehouseStatus')" label="Active" 
                :modelValue="data.isActive" 
                @update:modelValue="v => update('isActive', v)" />

                 <ToggleItem class="w-1/2" :title="$t('warehouses.allowNegativeBalance')" label="Allow" 
                :modelValue="data.allowNegativeBalance" 
                @update:modelValue="v => update('allowNegativeBalance', v)" />
            </div>
           
        </div>
    </div>
</template>