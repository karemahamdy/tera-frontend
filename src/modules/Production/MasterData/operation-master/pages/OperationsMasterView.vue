<script lang="ts" setup>
import router from '@/app/router';
import { useRoute } from 'vue-router';

const route = useRoute();

const handleEdit = () => {
    router.push(`/operation-master/edit/${route.params.id}`);
};
</script>
<template>
    <div class="p-6 w-full h-full bg-gray-100">
               <ScreenHeader title="production" subtitle="masterData" actionName="OperationsMaster.viewOperationsMaster" />

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
                    <BaseButton :label="$t('button.edit')" variant="primary" icon="Edit" @click="handleEdit()" />
                </div>
            </template>

            <template #content>
                <div class="grid grid-cols-3 gap-16 p-4">
                     <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('OperationsMaster.code') }}</span>
                        <span class="text-[#101828] text-base font-medium">MC-CNC-001</span>
                    </div>
                     <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{$t('OperationsMaster.name') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">CNC Milling </span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('OperationsMaster.laborCost') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">5454</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-16 p-4">
                   
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('OperationsMaster.Overhead') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">WC-002</span>
                        </div>
                    </div>
       
                </div>
                    <div class="flex flex-col gap-2  p-4">
                        <span class="text-lg text-[#A4A7AE]"> {{  $t("OperationsMaster.description")  }}</span>
                        <span class="text-[#101828] text-base font-medium">Main CNC machine for aluminum parts production.</span>
                    </div>
                   
            </template>
        </card>
    </div>
</template>
