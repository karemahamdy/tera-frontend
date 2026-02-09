<script lang="ts" setup>
import { computed, onMounted } from "vue";
import type { AddWarehouses } from "../types/warehouse";
import { useI18n } from "vue-i18n";
import { useLookups } from "@/composables/useLookups";
const { t } = useI18n();

const props = defineProps<{
    modelValue: Partial<AddWarehouses>;
    errors: Record<string, string | undefined>;
    disabled?: boolean;
      disableCode?: boolean;
}>();

const {
    usersLookups,
    getUsersLookups,
    ledgerDetailCardLookups,
    getLedgerDetailCardLookups,
    accountLookups,
     getAccountsLookups 
} = useLookups();

const emit = defineEmits<{
    (e: "update:modelValue", value: Partial<AddWarehouses>): void;
}>();

const data = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val)
});

onMounted(() => {
    getUsersLookups();
    getLedgerDetailCardLookups();
    getAccountsLookups()
});

const update = (key: keyof AddWarehouses, value: any) => {
    emit("update:modelValue", { ...props.modelValue, [key]: value });
};

const typeOptions = [
    { label: t("button.normal"), value: "Normal" },
    { label: t("button.professional"), value: "Professional" }
];

</script>

<template>
    <div class="space-y-6">
        <div class="flex gap-4">
            <FormInput class="w-1/2" :label="$t('warehouses.code')" :modelValue="data.code"
                @update:modelValue="(v: any) => update('code', v)" :error="errors.code" :invalid="!!errors.code"
                placeholder="WH-MAIN-001" :disabled="disabled || disableCode"/>

            <FormInput class="w-1/2" :label="$t('warehouses.name')" :modelValue="data.nameEn"
                @update:modelValue="(v: any) => update('nameEn', v)" :error="errors.nameEn" :invalid="!!errors.nameEn"
                placeholder="Main Central Warehouse" :disabled="disabled" />
        </div>

        <div class="flex gap-4">
            <FormInput class="w-1/2" :label="$t('itemGroup.itemGroupNameAr')" :modelValue="data.nameAr"
                @update:modelValue="(v: any) => update('nameAr', v)" :error="errors.nameAr" :invalid="!!errors.nameAr"
                placeholder="المستودع الرئيسي" :disabled="disabled" />

            <FormInput class="w-1/2" :label="$t('branch.address')" :modelValue="data.address"
                @update:modelValue="(v: any) => update('address', v)" :error="errors.address" :invalid="!!errors.address"
                placeholder="Industrial Zone, Block 5, Cairo – Egypt" :disabled="disabled" />
        </div>

        <div class="flex gap-4">
            <FormDropdown class="w-1/2" :label="$t('warehouses.manager')" :modelValue="data.managerId"
                @update:modelValue="(v: any) => update('managerId', v)" :options="usersLookups" placeholder="Select Manager" :disabled="disabled" />

            <FormDropdown class="w-1/2" :label="$t('warehouses.warehouseType')" :modelValue="data.type"
                @update:modelValue="(v: any) => update('type', v)" :options="typeOptions" placeholder="Normal" :disabled="disabled" />
        </div>

        <div>
            <label class="block mb-2 font-medium">
                {{ $t("itemGroup.description") }}
            </label>

            <Textarea :modelValue="data.description" @update:modelValue="v => update('description', v)" rows="2"
                class="w-full p-3 border rounded-lg" :class="{ 'border-danger-500': errors.description }"
                :placeholder="$t('warehouses.descriptionPlaceholder')" :disabled="disabled" />

            <small v-if="errors.description" class="text-danger-500">
                {{ $t(errors.description) }}
            </small>
        </div>

        <div class="flex gap-4 items-center">
            <FormDropdown class="w-1/2" :label="$t('warehouses.LDC')" :modelValue="data.defaultLedgerCardId"
                @update:modelValue="(v: any) => update('defaultLedgerCardId', v)" :options="ledgerDetailCardLookups"
                placeholder="LDC-INV-001" :disabled="disabled" />

            <FormDropdown class="w-1/2" :label="$t('warehouses.transferAccount')" :modelValue="data.transferAccountId"
                @update:modelValue="(v: any) => update('transferAccountId', v)" :options="accountLookups"
                placeholder="1305 – Warehouse Transfer Account" :disabled="disabled" />

        </div>

        <div class="flex gap-4">
            <div class="field">
                <label class="block mb-1 font-medium">
                    {{ $t('warehouses.operationHoursFrom') }}
                </label>

                <Calendar :modelValue="data.fromTime" placeholder="8:00 AM – 6:00 PM" timeOnly
                    @update:modelValue="(v: any) => update('fromTime', v)" :disabled="disabled" />
            </div>

            <div class="field">
                <label class="block mb-1 font-medium">
                    {{ $t('warehouses.operationHoursTo') }}
                </label>

                <Calendar :modelValue="data.toTime" placeholder="8:00 AM – 6:00 PM" timeOnly
                 @update:modelValue="(v: any) => update('toTime', v)" :disabled="disabled" />

            </div>

            <div class="w-1/2 flex items-center justify-between ">
                <ToggleItem class="w-1/2" :title="$t('warehouses.warehouseStatus')" label="Active"
                    :modelValue="data.isActive" @update:modelValue="(v: any) => update('isActive', v)" :disabled="disabled" />
            </div>
        </div>


        <div class=" border border-warning-300 bg-warning-50 rounded-xl p-4">
            <label class="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" class="mt-1 w-4 h-4" :checked="data.allowNegativeBalance"
                    @change="update('allowNegativeBalance', ($event.target as HTMLInputElement).checked)" :disabled="disabled" />

                <div>
                    <p class="font-medium text-gray-500">
                        {{ $t('warehouses.allowNegativeStockBalance') }}
                    </p>

                    <p class="text-sm text-gray-400 mt-1">
                        {{ $t('warehouses.allowNegativeBalanceNote') }}
                    </p>
                </div>
            </label>
        </div>
        <div v-if="data.type === 'Professional'" class=" border border-success-300 bg-success-50 rounded-xl p-4">
            <p class="font-medium text-gray-500">
                {{ $t('warehouses.ProfessionalWarehouse') }}
                <span class="text-sm text-gray-400 mt-1">
                    {{ $t('warehouses.ProfessionalNote') }}
                </span>
            </p>

        </div>

    </div>
</template>