<script setup lang="ts">
import BaseButton from '@/sharedComponents/BaseButton.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useItem } from '@/modules/Inventory/MasterData/item-list/composables/useItem';
import type { ItemOverview } from '../types/itemList';
import Stock from '../components/Stock.vue';
import ItemTransactions from '../components/ItemTransactions.vue';
import Pricing from '../components/Pricing.vue';
import Cards from '../components/Cards.vue';
import Overview from '../components/Overview.vue';
import router from '@/app/router';

const route = useRoute();
const { fetchItemOverview } = useItem();
const activeTab = ref("overview");
const itemOverview = ref<ItemOverview | null>(null);

onMounted(async () => {
  const id = route.params.id as string;
  if (id) {
    itemOverview.value = await fetchItemOverview(id);
  }
});
const handleEdit = () => {
    router.push(`/item-management/edit/${route.params.id}`);
};
</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="inventory" subtitle="masterData" actionName="itemList.itemList" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <template #title>
                  <div class="flex justify-between items-start p-4" v-if="itemOverview">
                <div>
                    <div class="flex items-center gap-3 mb-1">
                        <h1 class="text-2xl font-bold text-[#101828]">{{ itemOverview.itemInformation.code }}</h1>
                        <span :class="['px-2.5 py-0.5 rounded-full text-md font-medium', itemOverview.itemInformation.itemType ? 'bg-[#ecfdf3] text-[#027a48]' : 'bg-gray-100 text-gray-800']">
                             {{ itemOverview.itemInformation.accessScope }}
                        </span>
                    </div>
                    <p class="text-[#667085]">{{ itemOverview.itemInformation.nameEn }}</p>
                </div>
            <BaseButton  :label="$t('button.editItem')" variant="primary" icon="Edit" @click="handleEdit()" />
            </div>
            </template>

              <template #subtitle>
           <Cards/>
            </template>

         <template #content>
        <Tabs v-model:value="activeTab" >

          <TabList>
            <Tab value="overview">
              {{ $t("itemList.overview.overview") }}
            </Tab>
            <Tab value="transactions">
              {{ $t("itemList.transactions") }}
            </Tab>
            <Tab value="stock">
                {{ $t("itemList.stock") }}
            </Tab>
            <Tab value="pricing">
            {{ $t("itemList.pricing") }}
          </Tab>
        </TabList>

          <TabPanels>
             <TabPanel value="overview">
           <Overview :data="itemOverview" v-if="itemOverview" />
            </TabPanel>


            <TabPanel value="transactions">
           <ItemTransactions/>
            </TabPanel>

            <TabPanel value="stock">
              <Stock/>
            </TabPanel>

             <TabPanel value="pricing">
              <Pricing/>
            </TabPanel>

          </TabPanels>
        </Tabs>
        </template>
        </card>
    </div>
</template>

<style scoped>
:deep(.p-tablist) {
  background: #EDF2F666;
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
  background: #EDF2F666;
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