<script lang="ts" setup>
import router from '@/app/router';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useworkCenter } from '../composables/useWorkCenters';
const props = defineProps<{
  mode: "edit" | "create" | "view";
  id?: string;
}>();

const viewMode = props.mode === "view";
const { fetchworkCenterById} = useworkCenter();
const data = ref({
  workCenterCode: '',
  workCenterName: '',
departmentName: '',
  departmentId: null,
    machines: null,
  note: '',
  isActive: null
});
const route = useRoute();
onMounted(async () => {

  if (viewMode && props.id) {
    const result = await fetchworkCenterById(props.id);
    if (result) { 
        data.value = {
        workCenterName: result.workCenterName ?? null,
        workCenterCode: result.workCenterCode ?? null,
        departmentId: result.departmentId ?? null,
        departmentName: result.departmentName ?? null,
        // rowVersion: result.rowVersion,
        machines: result.machines ?? null,
        note: result.note ?? null,
        isActive  : result.isActive   ?? null,
      };
    }
    }
});

const handleEdit = () => {
    router.push(`/work-centers/edit/${route.params.id}`);
};
</script>
<template>
    <div class="p-6 w-full h-full bg-gray-100">
      <ScreenHeader title="production" subtitle="masterData" actionName="workCenter.viewworkCenter" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <template #title>
                <div class="flex justify-between items-start p-4 border-b border-gray-200">
                    <div>
                        <div class="flex items-center gap-6 mb-2">
                            <h1 class="text-2xl font-bold text-[#101828]">{{ data.workCenterCode }}</h1>
                            <span :class="[
                'px-8 py-0.5 rounded-md text-md font-medium',
                data.isActive
                  ? 'bg-[#ECFDF3] text-[#027A48]'   
                  : 'bg-[#FFF4E5] text-[#ED6C02]'   
              ]">
                {{ data.isActive ? $t('button.active') : $t('button.inactive') }}
              </span>
                        </div>
                        <p class="text-[#667085]">{{ data.workCenterName }}</p>
                    </div>
                    <BaseButton :label="$t('button.edit')" variant="primary" icon="Edit" @click="handleEdit()" />
                </div>
            </template>

            <template #content>
                <div class="grid grid-cols-3 gap-16 p-4">
                     <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('workCenter.workCentercode') }}</span>
                        <span class="text-[#101828] text-base font-medium">{{ data.workCenterCode }}</span>
                    </div>
                     <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{$t('workCenter.workCentername') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">{{ data.workCenterName }}</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{$t('workCenter.department') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">{{ data.departmentName }}z</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-16 p-4">
                   
                    <div class="flex flex-col gap-2">
                        <span class="text-lg text-[#A4A7AE]">{{ $t('machines.machines') }}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[#101828] text-base font-medium">{{ data.machines }}</span>
                        </div>
                    </div>
                         
                </div>
                    <div class="flex flex-col gap-2  p-4">
                        <span class="text-lg text-[#A4A7AE]"> {{  $t("workCenter.notes")   }}</span>
                        <span class="text-[#101828] text-base font-medium">{{ data.note }}</span>
                    </div>
                   
            </template>
        </card>
    </div>
</template>
