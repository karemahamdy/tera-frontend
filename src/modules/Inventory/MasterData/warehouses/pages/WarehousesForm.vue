<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
import WarehouseZones from "../components/WarehouseZones.vue";
import WarehouseInfo from "../components/WarehouseInfo.vue";
import { warehousesSchema } from "../validation/warehousesSchema";
import { warehousesService } from "../services/warehouse.service";
import type { AddWarehouses } from "../types/warehouse";

const props = defineProps<{
  mode: "edit" | "create" | "view";
}>();

const router = useRouter();
const isSubmitting = ref(false);
const activeTab = ref("basic");
const editMode = props.mode === "edit";

const { handleSubmit, errors, values, setFieldValue } = useForm<AddWarehouses>({
  validationSchema: warehousesSchema,
  initialValues: {
    code: "",
    nameEn: "",
    nameAr: "",
    description: "",
    address: "",
    managerId: "", // Should be handled or defaulted
    type: "Normal",
    operationalHours: "",
    allowNegativeBalance: true,
    defaultLedgerCardId: "",
    transferAccountId: "",
    isActive: true,
    zones: []
  }
});

// Update helper for WarehouseInfo
const updateForm = (val: Partial<AddWarehouses>) => {
    Object.entries(val).forEach(([key, value]) => {
        setFieldValue(key as keyof AddWarehouses, value);
    });
};

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  try {
    const payload = { ...values };
    
    // Conditional logic: Only send zones if type is Professional (or not Normal)
    // Adjust logic based on exact requirement. User said: 
    // "if i take a professional and it must send zone , and if i take a normal it mustnot send zone"
    if (payload.type === 'Normal') {
        payload.zones = [];
    }

    if (editMode) {
        // ID handling would be needed here for update
       // await warehousesService.update(id, payload);
    } else {
       await warehousesService.create(payload);
    }
    router.push({ name: "warehouses" });
  } catch (error) {
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div>
    <ScreenHeader title="inventory" subtitle="masterData" actionName="warehouses.title" crudType="warehouses.add" />
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
        <form @submit="onSubmit">
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
                 <WarehouseInfo 
                    :modelValue="values" 
                    :errors="errors"
                    @update:modelValue="updateForm" 
                 />
                </TabPanel>
                <TabPanel value="additional">
                   <!-- Bind zones manually to setFieldValue -->
                  <WarehouseZones 
                    :modelValue="values.zones" 
                    @update:modelValue="v => setFieldValue('zones', v)"
                  />
                </TabPanel>
            </TabPanels>
            </Tabs>
            <div class="flex gap-4 px-20 mt-6">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'warehouses' }" />
            <BaseButton type="submit" :label="editMode ? 'button.save' : 'button.create'" variant="primary" block
                :loading="isSubmitting" />
            </div>
        </form>
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