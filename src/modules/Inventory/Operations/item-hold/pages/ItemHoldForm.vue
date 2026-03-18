<script setup lang="ts">
import ItemSelectionDialog from "@/modules/Inventory/shared/components/ItemSelectionDialog.vue";
import { ref, onMounted, computed } from "vue";
import type { SelectedItem, ItemHoldPayload } from "../types/ItemHold";
import { useInventoryLookups } from '@/composables/useInventoryLookups';
const { getItemsLookups, itemsLookups, getItemSerialsLookups, ItemsSerialsLookups, getWarehouseHierarchyLookups, WarehouseHierarchyLookups } = useInventoryLookups();
import { ItemHoldSchema } from "../validation/ItemHoldSchema";
import { useItemHold } from "../composables/useItemHold";
const { createItemHold } = useItemHold();
import { useI18n } from "vue-i18n";
const { t } = useI18n();
// import { useLookups } from "@/composables/useLookups";
// const {
//     warehouseLookup,
//     getWarehouseLookups
// } = useLookups();

import { useForm } from "vee-validate";
import SerialSelectionDialog from "@/modules/Inventory/shared/components/SerialSelectionDialog.vue";
import StorageLocationPicker from "@/modules/Inventory/shared/components/StorageLocationPicker.vue";

const { handleSubmit, errors, defineField } = useForm<ItemHoldPayload>({
    validationSchema: ItemHoldSchema,
    initialValues: {
        holdQuantity: 0,
    },
});

const [warehouseID] = defineField("warehouseId");
const [zoneId] = defineField("zoneId");
const [locationId] = defineField("locationId");
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
            warehouseId: warehouseID.value,
            zoneId: zoneId.value as string,
            locationId: locationId.value as string
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
const showLocationPicker = ref<boolean>(false)
const locationName = ref<string | null>(null)
const WarehouseOptions = ref<{ label: string, value: string }[]>([]);

const availableItems = computed(() => itemsLookups.value.map(item => ({ ...item, label: item.name, value: item.id })));
const holdTypes = computed(() => [
    { label: t("operation.reservation"), value: "Reservations" },
    { label: t("itemHold.qcHold"), value: "QCHold" },
    { label: t("itemHold.DamageHold"), value: "DamageHold" },
    { label: t("itemHold.Investigation"), value: "Investigation" },
]);

const currentLocations = computed(() => {
    locationName.value = null;
    locationId.value = null;
    zoneId.value = null;
    if (!warehouseID.value) return [];
    const wh = WarehouseHierarchyLookups.value.find(w => w.warehouseId === warehouseID.value);
    return wh?.locations || [];
});

onMounted(async () => {
    await Promise.all([
        getItemsLookups(),
        // getWarehouseLookups(),
        getWarehouseHierarchyLookups()
    ]);
    WarehouseOptions.value = WarehouseHierarchyLookups.value.map(wh => ({ label: wh.warehouseName, value: wh.warehouseId }));

});

const handleSelectItem = (item: SelectedItem) => {
    itemId.value = item.id;
    itemName.value = item.name;
    isSerial.value = item.trackingType === "Serial";
};

const handleSelectLocation = (location: any) => {
    locationId.value = location.id;
    zoneId.value = location.zoneId;
    locationName.value = `${location.zoneName} - ${location.locationCode}`;
};

const handleSelectSerials = (serials: any[]) => {
    quantity.value = serials.reduce((total, serial) => total + serial.availableQuantity, 0);
    serialsForBlocking.value = serials.map(serial => {
        return {
            mainSerial: serial.mainSerial,
            holdQuantity: serial.availableQuantity
        }
    });
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
                        <div class="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-2">
                            <FormInput :label="$t('itemHold.holdDate')" v-model="date" type="date" class="mt-5"
                                :error="errors.holdDate" :placeholder="$t('itemHold.holdDatePlaceholder')" />
                            <div class="flex justify-center items-end gap-2 w-full mt-5">
                                <FormInput :label="$t('itemHold.item')" v-model="itemName" class="w-4/5" disabled
                                    :placeholder="$t('itemHold.itemPlaceholder')" :error="errors.itemId" />
                                <a @click="isVisible = true"
                                    class="w-1/5 rounded-xl p-3 text-center cursor-pointer border border-primary-500 text-primary-500 bg-white hover:bg-primary-25">
                                    {{ $t("LDC.select") }}
                                </a>
                            </div>
                            <FormDropdown class="w-full mt-5" :label="$t('itemHold.holdType')" :options="holdTypes"
                                v-model="holdType" optionValue="value" :error="errors.itemHoldStatus"
                                :placeholder="$t('itemHold.holdTypePlaceholder')" />
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
                            <FormDropdown class="w-full mt-5" :label="$t('items.warehouse')" :options="WarehouseOptions"
                                v-model="warehouseID" :error="errors.warehouseId" optionValue="value"
                                :placeholder="$t('items.warehousePlaceholder')" />
                            <div class="w-full mt-5">
                                <label class="block font-bold">
                                    {{ $t('OpeningBalance.zone') }}
                                </label>
                                <div @click="showLocationPicker = true"
                                    class="w-full rounded-xl p-3 cursor-pointer border border-gray-300 bg-gray-50 text-gray-500 ">
                                    <span class="text-black" v-if="locationName">{{ locationName }}</span>
                                    <span v-else>{{ $t("SalesReturn.ZonePlaceholder") }}</span>
                                </div>
                                <small v-if="errors.locationId" class="text-danger-500">{{ $t(errors.locationId)
                                    }}</small>
                            </div>
                        </div>

                        <div class="mt-5">
                            <label class="block font-bold">
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

        <StorageLocationPicker v-model:visible="showLocationPicker" @select="handleSelectLocation"
            :locations="currentLocations" :selectedLocationId="locationId" />

    </div>
</template>