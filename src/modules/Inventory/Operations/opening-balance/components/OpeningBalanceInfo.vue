<script setup lang="ts">
import { useLookups } from "@/composables/useLookups";
import { ref, onMounted } from "vue";
const {
    warehouseLookup,
    getWarehouseLookups
} = useLookups();

const warehouseID = ref<string>("")
const notes = ref<string>("")
const date = ref<string>("")
const quantity = ref<string>("")
const holdType = ref<string>("")
const itemId = ref<string>("")
const isVisible = ref<boolean>(false)
const isVisibleSerial = ref<boolean>(false)

onMounted(() => {
    Promise.all([
        (getWarehouseLookups()),
    ]);
});

</script>

<template>
    <div>
        <div>
            <PageHeader title="OpeningBalance.createOpeningBalance" subtitle="OpeningBalance.createOpeningBalanceInfo"
                :showSearch="false" />
            <div>

                <div class="flex justify-center items-end gap-2 w-full">
                    <FormInput :label="$t('itemHold.item')" v-model="itemId" class="w-9/10" disabled
                        :placeholder="$t('itemHold.itemPlaceholder')" />
                    <a @click="isVisible = true"
                        class="w-1/10 rounded-xl p-3 text-center cursor-pointer border border-primary-500 text-primary-500 bg-white hover:bg-primary-25">
                        {{ $t("LDC.select") }}
                    </a>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-2">
                    <FormDropdown class="w-full mt-5" :label="$t('items.warehouse')" :options="warehouseLookup"
                        v-model="warehouseID" optionValue="value" :placeholder="$t('items.warehousePlaceholder')" />

                    <FormDropdown class="w-full mt-5" :label="$t('OpeningBalance.zone')" :options="[]" v-model="holdType"
                        optionValue="value" :placeholder="$t('OpeningBalance.zone')" />

                    <FormInput :label="$t('OpeningBalance.date')" v-model="date" type="date" class="mt-5" :placeholder="$t('OpeningBalance.date')" />
                    <FormDropdown class="w-full mt-5" :label="$t('OpeningBalance.uom')" :options="[]" v-model="holdType"
                        optionValue="value" :placeholder="$t('OpeningBalance.uom')" />

                    <FormInput :label="$t('OpeningBalance.UnitCost')" v-model="date" class="mt-5" :placeholder="$t('OpeningBalance.UnitCost')" />

                    <div class="flex justify-center items-end gap-2 w-full mt-5">
                        <FormInput :label="$t('itemHold.quantity')" v-model="quantity" class="w-4/5"
                            :placeholder="$t('itemHold.quantityPlaceholder')" />
                        <a @click="isVisibleSerial = true"
                            class="w-1/5 rounded-xl p-3 text-center cursor-pointer border border-primary-500 text-primary-500 bg-white hover:bg-primary-25">
                            {{ $t("itemHold.add") }}
                        </a>
                    </div>
                </div>

                <div class="mt-5">
                    <label class="block font-medium">
                        {{ $t("itemTransaction.notes") }}
                    </label>
                    <Textarea :modelValue="notes" rows="2" class="w-full p-3 border rounded-lg"
                        :placeholder="$t('itemTransaction.notesPlaceholder')" />
                </div>

            </div>
        </div>
        <Dialog v-model:visible="isVisible" modal :style="{ width: '80%' }">
            <div>
                Select Item
                <slot></slot>
            </div>
        </Dialog>

        <Dialog v-model:visible="isVisibleSerial" modal :style="{ width: '80%' }">
            <div>
                Select Serial& Quantity
            </div>
        </Dialog>
    </div>
</template>