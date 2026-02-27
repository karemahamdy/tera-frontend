<script setup lang="ts">
import { useLookups } from "@/composables/useLookups";
import ItemSelectionDialog from "@/modules/Inventory/shared/components/ItemSelectionDialog.vue";
import { ref, onMounted, computed } from "vue";
import type { SelectedItem, ItemHoldPayload } from "../types/ItemHold";
import { useInventoryLookups } from '@/composables/useInventoryLookups';
const { getItemsLookups, itemsLookups, getItemSerialsLookups, ItemsSerialsLookups } = useInventoryLookups();
import { ItemHoldSchema } from "../validation/ItemHoldSchema";
import { useItemHold } from "../composables/useItemHold";
const { createItemHold } = useItemHold();
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const {
    warehouseLookup,
    getWarehouseLookups
} = useLookups();

import { useForm } from "vee-validate";
import SerialSelectionDialog from "@/modules/Inventory/shared/components/SerialSelectionDialog.vue";

const { handleSubmit, errors, defineField } = useForm<ItemHoldPayload>({
    validationSchema: ItemHoldSchema,
    initialValues: {
        holdQuantity: 0,
    },
});

const [warehouseID] = defineField("warehouseId");
const [notes] = defineField("reason");
const [date] = defineField("holdDate");
const [quantity] = defineField("holdQuantity");
const [holdType] = defineField("itemHoldStatus");
const [itemId] = defineField("itemId");
const [serialsForBlocking] = defineField("serialsForBlocking");
const itemName = ref<string>("");
const isSerial = ref<boolean>(false);

const hasSerial = computed(() => {
    if (itemId.value && warehouseID.value && isSerial.value) {
        getItemSerialsLookups({
            itemId: itemId.value,
            warehouseId: warehouseID.value
        })
    } else {
        serialsForBlocking.value = [];
    }

    return isSerial.value && itemId.value && warehouseID.value
});

const onSubmit = handleSubmit(
    async (values: ItemHoldPayload) => {
        createItemHold(values);
    },
);

const isVisible = ref<boolean>(false)
const isVisibleSerial = ref<boolean>(false)

const availableItems = computed(() => itemsLookups.value.map(item => ({ ...item, label: item.name, value: item.id })));
const holdTypes = computed(() => [
    { label: t("operation.reservation"), value: "Reservations" },
    { label: t("itemHold.qcHold"), value: "QCHold" },
    { label: t("itemHold.DamageHold"), value: "DamageHold" },
    { label: t("itemHold.Investigation"), value: "Investigation" },
]);

onMounted(() => {
    Promise.all([
        getItemsLookups(),
        getWarehouseLookups(),
    ]);
});

const handleSelectItem = (item: SelectedItem) => {
    itemId.value = item.id;
    itemName.value = item.name;
    isSerial.value = item.trackingType === "Serial";
};

const handleSelectSerials = (serials: any[]) => {
    quantity.value = serials.reduce((total, serial) => total + serial.availableQuantity, 0);
    serialsForBlocking.value = serials.map(serial => serial.mainSerial);
};

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="inventory" subtitle="operation.title" actionName="itemHold.createItemHold" />
        <form @submit.prevent="onSubmit">
            <card class="bg-white rounded-[10px]">
                <!-- PageHeader component -->
                <template #title>
                    <PageHeader title="itemHold.createItemHold" subtitle="itemHold.createItemHoldDescription"
                        :showSearch="false" />
                </template>
                <!-- DynamicTable component -->
                <template #content>
                    <div>
                        <div class="flex justify-center items-end gap-2 w-full">
                            <FormInput :label="$t('itemHold.item')" v-model="itemName" class="w-9/10" disabled
                                :placeholder="$t('itemHold.itemPlaceholder')" :error="errors.itemId" />
                            <a @click="isVisible = true"
                                class="w-1/10 rounded-xl p-3 text-center cursor-pointer border border-primary-500 text-primary-500 bg-white hover:bg-primary-25">
                                {{ $t("LDC.select") }}
                            </a>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-2">

                            <FormDropdown class="w-full mt-5" :label="$t('items.warehouse')" :options="warehouseLookup"
                                v-model="warehouseID" :error="errors.warehouseId" optionValue="value"
                                :placeholder="$t('items.warehousePlaceholder')" />

                            <div class="flex justify-center items-end gap-2 w-full mt-5">
                                <FormInput :label="$t('itemHold.quantity')" v-model="quantity" class="w-4/5"
                                    type="number" :error="errors.holdQuantity" :disabled="isSerial" :key="hasSerial"
                                    :placeholder="$t('itemHold.quantityPlaceholder')" />
                                <a @click="hasSerial && (isVisibleSerial = true)"
                                    class="w-1/5 rounded-xl p-3 text-center border border-primary-500 text-primary-500"
                                    :class="{ 'cursor-not-allowed bg-gray-50': !hasSerial, 'cursor-pointer bg-white hover:bg-primary-25': hasSerial }"
                                    :disabled="!hasSerial">
                                    {{ $t("itemHold.add") }}
                                </a>
                            </div>

                            <FormDropdown class="w-full mt-5" :label="$t('itemHold.holdType')" :options="holdTypes"
                                v-model="holdType" optionValue="value" :error="errors.itemHoldStatus"
                                :placeholder="$t('itemHold.holdTypePlaceholder')" />

                            <FormInput :label="$t('itemHold.holdDate')" v-model="date" type="date" class="mt-5"
                                :error="errors.holdDate" :placeholder="$t('itemHold.holdDatePlaceholder')" />
                        </div>

                        <div class="mt-5">
                            <label class="block font-medium">
                                {{ $t("itemHold.notes") }}
                            </label>
                            <Textarea v-model="notes" rows="2" class="w-full p-3 border rounded-lg"
                                :placeholder="$t('itemHold.notesPlaceholder')" />
                            <small v-if="errors.reason" class="text-danger-500">{{ $t(errors.reason) }}</small>
                        </div>

                    </div>

                    <div class="w-full mt-5">
                        <div class="p-5 bg-primary-50 border border-primary-400 rounded-xl">
                            <p><strong>{{ $t("itemHold.holdProcess") }}</strong></p>
                            <div class="px-5 text-sm mt-2">
                                <p>{{ $t("itemHold.holdProcess1") }}</p>
                                <p>{{ $t("itemHold.holdProcess2") }}</p>
                                <p>{{ $t("itemHold.holdProcess3") }}</p>
                                <p>{{ $t("itemHold.holdProcess4") }}</p>
                            </div>
                        </div>
                    </div>
                </template>
            </card>
            <div class="w-full flex justify-end">
                <div class="flex gap-4 mt-5 w-1/2">
                    <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'ItemHold' }" />
                    <BaseButton type="submit" label="itemHold.holdItem" variant="primary" block />
                </div>
            </div>
        </form>
        <ItemSelectionDialog v-model:visible="isVisible" :items="availableItems" @select="handleSelectItem" />
        <SerialSelectionDialog v-model:visible="isVisibleSerial" :serials="ItemsSerialsLookups"
            @select="handleSelectSerials" />

    </div>
</template>