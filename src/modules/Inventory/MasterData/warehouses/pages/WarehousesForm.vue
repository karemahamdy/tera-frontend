<script setup lang="ts">
import { ref } from "vue";
import WarehouseZones from "../components/WarehouseZones.vue";
import WarehouseInfo from "../components/WarehouseInfo.vue";

const activeTab = ref("basic");
const props = defineProps<{
  mode: "edit" | "create" | "view";
}>();

const isSubmitting = ref(false);
const editMode = props.mode === "edit";
</script>

<template>
  <div>
    <ScreenHeader title="inventory" subtitle="masterData" actionName="warehouses.title" />
    <Card class="p-6 bg-white rounded-[10px]">
      <template #title>
        <div class="flex flex-col px-20">
          <h2 class="heading-title">
            {{ editMode ? $t("warehouses.editWarehouseInfo") : $t("warehouses.addWarehouseInfo") }}
          </h2>
          <p class="subheading-title">
            {{ editMode ? $t("warehouses.editWarehouseInfoDesc") : $t("warehouses.addWarehouseInfoDesc") }}
          </p>
        </div>
      </template>
      <template #content>
        <Tabs v-model:value="activeTab" class="px-20">
          <TabList>
            <Tab value="basic">
              {{ $t("warehouses.basicInfo") }}
            </Tab>
            <Tab value="additional">
              {{ $t("warehouses.zonseInfo") }}
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel value="basic">
           <WarehouseInfo/>
            </TabPanel>
            <TabPanel value="additional">
              <WarehouseZones />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <div class="flex gap-4 px-20 mt-6">
          <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'warehouses' }" />
          <BaseButton type="submit" :label="editMode ? 'button.save' : 'button.create'" variant="primary" block
            :loading="isSubmitting" />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
:deep(.p-tab) {
  padding: 10px 20px;
  font-weight: 500;
  color: #3F5FAC;
  background: transparent;
  transition: all 0.2s ease;
  
}
:deep(.p-tab.p-highlight) {
  background: #ffffff;
  color: #3F5FAC !important;
}
:deep(.p-tablist-active-bar) {
    background: #3F5FAC;
}
</style>