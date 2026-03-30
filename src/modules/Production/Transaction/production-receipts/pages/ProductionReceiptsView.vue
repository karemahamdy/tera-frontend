<script lang="ts" setup>
import router from '@/app/router';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import OperationsView from '../components/OperationsView.vue';
import MaterialsView from '../components/MaterialsView.vue';

const activeTab = ref("BOMMaterials");
const route = useRoute();
const handleEdit = () => {
    router.push(`/work-orders/edit/${route.params.id}`);
};

</script>
<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="production" subtitle="masterData" actionName="workOrder.viewworkOrder" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <template #title>
                <div class="flex justify-between items-start p-4 border-b border-gray-200">
                    <div>
                        <div class="flex items-center gap-6 mb-2">
                            <h1 class="text-2xl font-bold text-[#101828]">Cutting</h1>
                            <span
                                :class="['px-8 py-0.5 rounded-md  text-md font-medium', 'bg-[#ECFDF3] text-[#027A48]']">
                                Active
                            </span>
                        </div>
                        <p class="text-[#667085]">OPR-CUT</p>
                    </div>
                    <BaseButton :label="$t('button.editItem')" variant="primary" icon="Edit" @click="handleEdit()" />
                </div>
            </template>

            <template #content>
                <div class="grid grid-cols-3 gap-16 p-4">
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('workOrder.workOrderNumber') }}</span>
                        <span class="text-[#101828] text-base font-medium">MC-CNC-001</span>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('workOrder.item') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">CNC Milling </span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('workOrder.UOM') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">5454</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-16 p-4">
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('workOrder.salesOrder') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">WC-002</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('workOrder.WarehouseIn') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">WC-002</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('workOrder.quantity') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">WC-002</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-16 p-4">
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('workOrder.WarehouseOut') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">WC-002</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('workOrder.RelatedWorkOrder') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">WC-002</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('workOrder.Plannedstart') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">WC-002</span>
                        </div>
                    </div>
                </div>
            </template>

            <template #footer>
                <Tabs v-model:value="activeTab">
                    <div class="mx-4">
                        <TabList>
                            <Tab value="BOMMaterials">
                                {{ $t("workOrder.BOMMaterials") }}
                            </Tab>
                            <Tab value="Operations">
                                {{ $t("workOrder.Operations") }}
                            </Tab>
                        </TabList>
                    </div>
                    <TabPanels>
                        <TabPanel value="BOMMaterials">
                            <MaterialsView />
                        </TabPanel>
                        <TabPanel value="Operations">
                            <OperationsView />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </template>
        </card>
    </div>
</template>
<style scoped>
:deep(.p-tablist) {
    background: #FAFAFA;
    border-radius: 12px;
    /* padding-bottom: 10px; */
    padding: 4px;
    display: flex;
    gap: 4px;
}

:deep(.p-tablist-tab-list) {
    padding: 4px;
    display: flex;
    gap: 4px;
    border-width: 0px;

}

:deep(.p-tab) {
    flex: 1;
    text-align: center;
    gap: 10px;
    padding: 12px 0;
    border-radius: 10px;
    font-weight: 500;
    color: #9CA3AF;
    /* background: rgb(236, 235, 235); */
    border-width: 0px;
    transition: all 0.25s ease;
}

:deep(.p-tab.p-highlight) {
    background: #FAFAFA;
    color: var(--color-primary-400) !important;
}

:deep(.p-tablist-active-bar) {
    background: var(--color-primary-400);
    color: var(--color-primary-400) !important;
}

:deep(.p-tab.p-tab-active) {
    color: var(--color-primary-400) !important;
    background: #ffffff;
    border: 1px solid transparent;

}

:deep(.p-tablist-active-bar) {
    display: none !important;
}
</style>