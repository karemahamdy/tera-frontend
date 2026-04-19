<script lang="ts" setup>
import router from '@/app/router';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDowntime } from '../composables/useDowntime';

const props = defineProps<{
  mode: "view";
  id?: string;
}>();
const viewMode = props.mode === "view";

const route = useRoute();
const {fetchDowntimeById } = useDowntime()

const data = ref({
  date: '',
  time: '',
  workOrderNumber: null,
  downtimeType: null,
  machineName: '',
  duration: null,
  notes: '',
});

onMounted(async () => {
  if (viewMode && props.id) {
    const result = await fetchDowntimeById(props.id);
    if (result) {
      data.value = {
        date: result.date ?? '',
        time: result.time ?? '',
        workOrderNumber: result.workOrderNumber ?? null,
        downtimeType: result.downtimeType ?? null,
        machineName: result.machineName ?? '',
        duration: result.duration ?? null,
        notes: result.notes?? null 
      };
    }
  }
});
const handleEdit = () => {
    router.push(`/downtime/edit/${route.params.id}`);
};
</script>
<template>
    <div class="p-6 w-full h-full bg-gray-100">
   <ScreenHeader title="production" subtitle="operation.transactions" actionName="downtime.viewDowntime" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <template #title>
                <div class="flex justify-between items-start p-4 border-b border-gray-200">
                    <div>
                        <div class="flex items-center gap-6 mb-2">
                            <h1 class="text-2xl font-bold text-[#101828]">{{ data.downtimeType }}</h1>  
                        </div>
                        <!-- <p class="text-[#667085]">OPR-CUT</p> -->
                    </div>
                    <BaseButton :label="$t('button.edit')" variant="primary" icon="Edit" @click="handleEdit()" />
                </div>
            </template>

            <template #content>
                <div class="grid grid-cols-3 gap-16 p-4">
                     <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t("downtime.date") }}</span>
                        <span class="text-[#101828] text-base font-medium">{{ data.date }}</span>
                    </div>
                     <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{$t('downtime.time') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">{{ data.time }} </span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('downtime.machine') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">{{ data.machineName }}</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-16 p-4">
                   
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('downtime.DowntimeType') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">{{ data.downtimeType }}</span>
                        </div>
                    </div>
                     <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('downtime.WorkOrder') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">{{ data.workOrderNumber }}</span>
                        </div>
                    </div>   
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('downtime.duration') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">{{ data.duration }}</span>
                        </div>
                    </div>      
                </div>
                    <div class="flex flex-col gap-2  p-4">
                        <span class="text-lg text-[#A4A7AE]"> {{  $t("downtime.notes")  }}</span>
                        <span class="text-[#101828] text-base font-medium">{{ data.notes }}</span>
                    </div>
                   
            </template>
        </card>
    </div>
</template>
