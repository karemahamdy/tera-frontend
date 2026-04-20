<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useInventoryLookups } from '@/composables/useInventoryLookups';
import { OpeningBalanceService } from "../services/OpeningBalance.service";
const { getItemsLookups, itemsLookups, getWarehouseHierarchyLookups, WarehouseHierarchyLookups } = useInventoryLookups();
import type { SelectedItem } from "../types/OpeningBalance";
import ItemSelectionDialog from "@/modules/Inventory/shared/components/ItemSelectionDialog.vue";
import StorageLocationPicker from "@/modules/Inventory/shared/components/StorageLocationPicker.vue";
import QuantitySerialDialog from "@/modules/Inventory/shared/components/QuantitySerialDialog.vue";
import { useOpeningBalance } from "../composables/useOpeningBalance";
import { useRoute } from "vue-router";
const route = useRoute();
const id = route.params.id as string;

const {
    errors,
    itemId,
    warehouseId,
    warehouseName,
    locationName,
    locationId,
    date,
    uomId,
    code,
    unitCost,
    quantity,
    notes,
    serials,
    itemName,
    isSerial,
    fetchOpeningBalanceById,
    exportTemplate
} = useOpeningBalance();

defineProps({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    }
})

const isVisible = ref<boolean>(false)
const isVisibleSerial = ref<boolean>(false)
const showLocationPicker = ref<boolean>(false)
const WarehouseOptions = ref<{ label: string, value: string }[]>([]);
const initialSerials = ref<any[]>([]);

const currentItem = computed(() => {
    return itemsLookups.value.find(item => item.id === itemId.value) || null;
});

const units = computed(() => {
    if (!currentItem.value) return [];
    return currentItem.value.units.map((uom: any) => ({ label: `${uom.unitName} (${uom.unitCode})`, value: uom.unitId }));
});
const availableItems = computed(() => itemsLookups.value.map(item => ({ ...item, label: item.name, value: item.id })));

const currentLocations = computed(() => {
    locationName.value = null;
    if (!warehouseId.value) return [];
    const wh = WarehouseHierarchyLookups.value.find(w => w.warehouseId === warehouseId.value);
    warehouseName.value = wh?.warehouseName || null;
    return wh?.locations || [];
});



const handleSelectItem = (item: SelectedItem) => {
    itemId.value = item.id;
    itemName.value = item.name;
    isSerial.value = item.trackingType === "Serial";
};

const handleSelectLocation = (location: any) => {
    locationId.value = location.id;
    locationName.value = `${location.zoneName} - ${location.locationCode}`;
};

const handleSaveSerials = (selectedSerials: { serials: any[], totalQty: number }) => {
    serials.value = selectedSerials.serials.map(serial => ({
        "serial": serial.mainSerial,
        "quantity": serial.qty,
        "batchNumber": serial.batchNumber,
        "expireDate": serial.expireDate,
        "serialNumber2": serial.serialNumber2,
        "serialNumber3": serial.serialNumber3,
        "comment": serial.comment
    }));
    quantity.value = selectedSerials.totalQty;
    initialSerials.value = [...selectedSerials.serials];
};

const setSelectedValues = () => {
    if (itemId.value) {
        handleSelectItem(itemsLookups.value.find(item => item.id === itemId.value) as SelectedItem);
    }
    if (locationId.value && warehouseId.value) {
        const wh = WarehouseHierarchyLookups.value.find(w => w.warehouseId === warehouseId.value);
        const location = wh?.locations.find((loc: any) => loc.id === locationId.value);
        if (location) {
            handleSelectLocation(location);
        }
    }
    if (serials.value && serials.value.length > 0) {
        initialSerials.value = serials.value.map((s: any) => ({
            mainSerial: s.serial,
            qty: s.quantity,
            batchNumber: s.batchNumber,
            expireDate: s.expireDate
                ? s.expireDate.split("T")[0]
                : null,
            serialNumber2: s.serialNumber2,
            serialNumber3: s.serialNumber3,
            comment: s.comment
        }));
        // initialSerials.value = serials.value.map((s: any) => ({
        //     serial: s.serial,
        //     qty: s.quantity,
        //     batch: s.batchNumber,
        //     expire: s.expireDate,
        //     serialNumber2: s.serialNumber2,
        //     serialNumber3: s.serialNumber3,
        //     comment: s.comment
        // }));
    }
}

onMounted(async () => {
    let lookupsToFetch = [getItemsLookups(), getWarehouseHierarchyLookups()];
    if (id) {
        lookupsToFetch.push(fetchOpeningBalanceById(id) as Promise<any>);
    }
    await Promise.all(lookupsToFetch);
    WarehouseOptions.value = WarehouseHierarchyLookups.value.map(wh => ({ label: wh.warehouseName, value: wh.warehouseId }));
    setSelectedValues();
});

</script>

<template>
    <div>
        <div>
            <PageHeader :title="title" :subtitle="subtitle" :showSearch="false" />
            <div>


                <div class="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-2">
                    <FormInput :label="$t('itemGroup.code')" v-model="code" class="mt-5" :error="errors.code"
                        placeholder="Ex: OB-001" />
                    <div class="flex justify-center items-end gap-2 w-full mt-5">
                        <FormInput :label="$t('itemHold.item')" v-model="itemName" class="w-9/10" disabled
                            :error="errors.itemId" :placeholder="$t('itemHold.itemPlaceholder')" />
                        <a @click="isVisible = true"
                            class="w-1/5 rounded-xl p-3 text-center cursor-pointer border border-primary-500 text-primary-500 bg-white hover:bg-primary-25">
                            {{ $t("LDC.select") }}
                        </a>
                    </div>
                    <FormDropdown class="w-full mt-5" :label="$t('items.warehouse')" :options="WarehouseOptions"
                        v-model="warehouseId" :error="errors.warehouseId" optionValue="value"
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
                        <small v-if="errors.locationId" class="text-danger-500">{{ $t(errors.locationId) }}</small>
                    </div>


                    <FormInput :label="$t('OpeningBalance.date')" v-model="date" type="date" class="mt-5"
                        :error="errors.date" :placeholder="$t('OpeningBalance.date')" />
                    <FormDropdown class="w-full mt-5" :label="$t('OpeningBalance.uom')" :options="units" v-model="uomId"
                        :error="errors.uomId" optionValue="value" :placeholder="$t('OpeningBalance.uom')" />

                    <FormInput :label="$t('OpeningBalance.UnitCost')" v-model="unitCost" class="mt-5"
                        :error="errors.unitCost" type="number" :placeholder="$t('OpeningBalance.UnitCost')" />

                    <div class="flex justify-center items-end gap-2 w-full mt-5">
                        <FormInput :label="$t('itemHold.quantity')" v-model="quantity" class="w-4/5"
                            :disabled="isSerial" :key="isSerial" :error="errors.quantity" type="number"
                            :placeholder="$t('itemHold.quantityPlaceholder')" />

                        <a @click="isSerial && (isVisibleSerial = true)"
                            class="w-1/5 rounded-xl p-3 text-center border border-primary-500 text-primary-500"
                            :class="{ 'cursor-not-allowed bg-gray-50': !isSerial, 'cursor-pointer bg-white hover:bg-primary-25': isSerial }"
                            :disabled="!isSerial">
                            {{ $t("itemHold.add") }}
                        </a>
                    </div>
                </div>

                <div class="mt-5">
                    <label class="block font-bold">
                        {{ $t("itemTransaction.notes") }}
                    </label>
                    <Textarea v-model="notes" rows="2" class="w-full p-3 border rounded-lg"
                        :placeholder="$t('itemTransaction.notesPlaceholder')"></Textarea>
                    <small v-if="errors.notes" class="text-danger-500">{{ $t(errors.notes) }}</small>
                </div>

            </div>
        </div>

        <ItemSelectionDialog v-model:visible="isVisible" :items="availableItems" @select="handleSelectItem" />

        <StorageLocationPicker v-model:visible="showLocationPicker" @select="handleSelectLocation"
            :locations="currentLocations" :selectedLocationId="locationId" />

        <QuantitySerialDialog v-if="isVisibleSerial && currentItem" v-model:visible="isVisibleSerial"
            :item="currentItem" :initialSerials="initialSerials" :exportTemplateFunc="() => exportTemplate()"
            :parseSerialsFunc="OpeningBalanceService.parseSerials"
            @save="handleSaveSerials" />
    </div>
</template>