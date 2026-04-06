<script lang="ts" setup>
import router from '@/app/router';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useMachines } from '../composables/useMachines';

const route = useRoute();
const props = defineProps<{
    mode: "edit" | "create" | "view";
    id?: string;
}>();

const viewMode = props.mode === "view";
const { fetchMachinesById } = useMachines();
const data = ref({
    machineCode: '',
    machineName: '',
    machineModel: '',
    machineCapacity: null,
    costPerHour: null,
    efficiencyPercentage: null,
    overheadPercentage: null,
    workCenterName: null,
    setupTime: null,
    setupCostPerHour: null,
    isActive: null,
    note: null
});

onMounted(async () => {

    if (viewMode && props.id) {
        const result = await fetchMachinesById(props.id);
        console.log(result);
        
        if (result) {
            data.value = {
                machineCode: result.machineCode ?? null,
                machineName: result.machineName ?? null,
                machineModel: result.machineModel ?? null,
                workCenterName: result.workCenterName ?? null,
                machineCapacity: result.machineCapacity ?? null,
                costPerHour: result.costPerHour ?? null,
                efficiencyPercentage: result.efficiencyPercentage ?? null,
                overheadPercentage: result.overheadPercentage ?? null,
                setupTime: result.setupTime ?? null,
                setupCostPerHour: result.setupCostPerHour ?? null,
                isActive: result.isActive ?? null,
                note: result.note ?? null
            };
        }
    }
});

const handleEdit = () => {
    router.push(`/machines/edit/${route.params.id}`);
};
</script>
<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="production" subtitle="masterData" actionName="machines.Viewmachines" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <template #title>
                <div class="flex justify-between items-start p-4 border-b border-gray-200">
                    <div>
                        <div class="flex items-center gap-6 mb-2">
                            <h1 class="text-2xl font-bold text-[#101828]">{{ data.machineName }}</h1>
                            <span :class="[
                'px-8 py-0.5 rounded-md text-md font-medium',
                data.isActive
                  ? 'bg-[#ECFDF3] text-[#027A48]'   
                  : 'bg-[#FFF4E5] text-[#ED6C02]'   
              ]">
                {{ data.isActive ? $t('button.active') : $t('button.inactive') }}
              </span>
                        </div>
                        <p class="text-[#667085]">{{ data.machineCode }}</p>
                    </div>
                    <BaseButton :label="$t('button.edit')" variant="primary" icon="Edit" @click="handleEdit()" />
                </div>
            </template>

            <template #content>
                <div class="grid grid-cols-3 gap-16 p-4">
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('machines.MachineCode') }}</span>
                        <span class="text-[#101828] text-base font-medium">{{ data.machineCode }}</span>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('machines.MachineName') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">{{ data.machineName }}</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('machines.MachineCapacity') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">{{ data.machineCapacity }}</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-16 p-4">

                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('machines.workCenter') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">{{ data.workCenterName }}</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('machines.CostPerHour') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">{{ data.costPerHour }}</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('machines.Overhead') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">{{ data.overheadPercentage }}</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-16 p-4">
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('machines.SetupTime') }}</span>
                        <span class="text-[#101828] text-base font-medium">{{ data.setupTime }}</span>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('machines.SetupCostPerHour') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">{{ data.setupCostPerHour }}</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('machines.Efficiency') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">{{ data.efficiencyPercentage }}</span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-2 p-4">
                    <span class="text-lg text-[#A4A7AE]"> {{ $t("machines.notes") }}</span>
                    <span class="text-[#101828] text-base font-medium">{{ data.note }}</span>
                </div>
            </template>
        </card>
    </div>
</template>
