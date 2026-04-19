<script setup lang="ts">
import BaseButton from '@/sharedComponents/BaseButton.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/app/router';
import HeaderInfo from '../components/HeaderInfo.vue';
import Costing from '../components/Costing.vue';
import Versions from '../components/Versions.vue';
import BOMItems from '../components/BOMItems.vue';
import Operations from '../components/Operations.vue';
import { useBOM } from '../composables/useBom';

const route = useRoute();
const props = defineProps<{
  mode: "edit" | "create" | "view";
  id?: string;
}>();

const viewMode = props.mode === "view";
const activeTab = ref("headerInfo");
const bomData = ref<any>(null);

const { fetchBOMById } = useBOM();

onMounted(async () => {
  if (viewMode && props.id) {
    const result = await fetchBOMById(props.id);
    if (result) {
      bomData.value = result;
    }
  }
});

const handleEdit = () => {
  router.push(`/bom/edit/${route.params.id}`);
};
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="production" subtitle="masterData" actionName="BOM.BOM" />
    <card class="bg-[#ffffff] rounded-[10px]">
      <template #title>
        <div class="flex justify-between items-start p-4">
          <div>
            <div class="flex items-center gap-3 mb-3">
              <h1 class="text-2xl font-bold text-[#101828]">{{ bomData?.bomName ?? '—' }}</h1>
              <span :class="['px-8 py-0.5 rounded-lg text-md font-medium',
                bomData?.isActive ? 'bg-[#D1FADF] text-[#027A48]' : 'bg-[#FFF3E0] text-[#F59E0B]']">
                {{ bomData?.isActive ? $t('button.active') : $t('button.inactive') }}
              </span>
              <span class="px-8 py-0.5 rounded-lg text-md font-medium bg-[#D6E0FF] text-[#638EFF]">
                V{{ bomData?.version }}
              </span>
            </div>
            <p class="text-[#667085]">{{ bomData?.parentItemName }} ({{ bomData?.parentItemCode }})</p>
          </div>
          <BaseButton :label="$t('button.edit')" variant="primary" icon="Edit" @click="handleEdit()" />
        </div>
      </template>
      <template #content>
        <Tabs v-model:value="activeTab">
          <div class="mx-4">
            <TabList>
              <Tab value="headerInfo">{{ $t("BOM.headerInfo") }}</Tab>
              <Tab value="bomItems">{{ $t("BOM.BomItems") }}</Tab>
              <Tab value="operations">{{ $t("BOM.operations") }}</Tab>
              <Tab value="costing">{{ $t("BOM.costing") }}</Tab>
              <Tab value="versions">{{ $t("BOM.versions") }}</Tab>
            </TabList>
          </div>
          <TabPanels>
            <TabPanel value="headerInfo">
              <HeaderInfo :data="bomData" />
            </TabPanel>
            <TabPanel value="bomItems">
              <BOMItems :materials="bomData?.materials ?? []" />
            </TabPanel>
            <TabPanel value="operations">
              <Operations :routings="bomData?.routings ?? []" />
            </TabPanel>
            <TabPanel value="costing">
              <Costing :costing-summary="bomData?.costingSummary" />
            </TabPanel>
            <TabPanel value="versions">
              <Versions :versions="bomData?.versions ?? []" />
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
  padding-bottom: 10px;
  padding-top: 10px;
  padding-left: 15px;
}

:deep(.p-tab) {
  padding: 10px 20px;
  font-weight: 500;
  color: var(--color-gray-400);
  /* background: #EDF2F666; */
  transition: all 0.2s ease;
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

}
</style>