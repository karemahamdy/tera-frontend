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
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="inventory" subtitle="operation.title" actionName="itemHold.createItemHold" />
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
                        <FormInput :label="$t('itemHold.item')" v-model="itemId" class="w-9/10" disabled
                            :placeholder="$t('itemHold.itemPlaceholder')" />
                        <a
                            @click="isVisible = true"
                            class="w-1/10 rounded-xl p-3 text-center cursor-pointer border border-primary-500 text-primary-500 bg-white hover:bg-primary-25">
                            {{ $t("LDC.select") }}
                        </a>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-2">
                        <FormDropdown class="w-full mt-5" :label="$t('itemHold.holdType')" :options="[]"
                            v-model="holdType" optionValue="value" :placeholder="$t('itemHold.holdTypePlaceholder')" />

                        <div class="flex justify-center items-end gap-2 w-full mt-5">
                            <FormInput :label="$t('itemHold.quantity')" v-model="quantity" class="w-4/5"
                                :placeholder="$t('itemHold.quantityPlaceholder')" />
                            <a
                                @click="isVisibleSerial = true"
                                class="w-1/5 rounded-xl p-3 text-center cursor-pointer border border-primary-500 text-primary-500 bg-white hover:bg-primary-25">
                                {{ $t("itemHold.add") }}
                            </a>
                        </div>


                        <FormDropdown class="w-full mt-5" :label="$t('items.warehouse')" :options="warehouseLookup"
                            v-model="warehouseID" optionValue="value" :placeholder="$t('items.warehousePlaceholder')" />

                        <FormInput :label="$t('itemHold.holdDate')" v-model="date" type="date" class="mt-5"
                            :placeholder="$t('itemHold.holdDatePlaceholder')" />
                    </div>

                    <div class="mt-5">
                        <label class="block font-medium">
                            {{ $t("itemHold.notes") }}
                        </label>
                        <Textarea :modelValue="notes" rows="2" class="w-full p-3 border rounded-lg"
                            :placeholder="$t('itemHold.notesPlaceholder')" />
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