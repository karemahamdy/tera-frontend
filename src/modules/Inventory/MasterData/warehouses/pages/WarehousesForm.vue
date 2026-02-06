<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useForm } from "vee-validate";
import { useRoute, useRouter } from "vue-router";
import WarehouseZones from "../components/WarehouseZones.vue";
import WarehouseInfo from "../components/WarehouseInfo.vue";
import { warehousesSchema } from "../validation/warehousesSchema";
import { useWarehouse } from "../composables/usewarehouse";
import type { AddWarehouses } from "../types/warehouse";

const { fetchWarehouseById, createWarehouse, updateWarehouse, loading } = useWarehouse();

const props = defineProps<{
  mode: "edit" | "create" | "view";
}>();

const router = useRouter();
const route = useRoute();
const isSubmitting = ref(false);
const activeTab = ref("basic");
const editMode = props.mode === "edit";
const warehouseId = route.params.id as string;

const { handleSubmit, errors, values, setFieldValue, setValues } = useForm<AddWarehouses>({
  validationSchema: warehousesSchema,
  initialValues: {
    code: "",
    nameEn: "",
    nameAr: "",
    description: "",
    address: "",
    managerId: null,
    type: "Normal",
    fromTime: null,
    toTime: null,
    allowNegativeBalance: true,
    defaultLedgerCardId: null,
    transferAccountId: null,
    isActive: true,
    zones: []
  }
});

const updateForm = (val: Partial<AddWarehouses>) => {
    Object.entries(val).forEach(([key, value]) => {
        setFieldValue(key as keyof AddWarehouses, value);
    });
};

const formatTime = (date: Date | null | undefined) => {
  if (!date) return "";
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
};

const parseTime = (timeStr: string) => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

onMounted(async () => {
    if (editMode && warehouseId) {
        try {
            const data = await fetchWarehouseById(warehouseId);
            if (!data) return;
            
            console.log("Fetched Warehouse Data:", data);

            // Parse operationalHours
            let fromTime = null;
            let toTime = null;
            const opHours = data.operationalHours || (data as any).OperationalHours;
            if (opHours) {
                const parts = opHours.split(' - ');
                if (parts.length === 2) {
                    fromTime = parseTime(parts[0]);
                    toTime = parseTime(parts[1]);
                }
            }

            setValues({
                code: data.code || "",
                nameEn: (data as any).name || "", // Map 'name' to nameEn
                nameAr: (data as any).name || "", // Map 'name' to nameAr as fallback
                description: data.description || "",
                address: data.address || "",
                
                // Handle potential object or ID for these fields based on common patterns
                managerId: (data as any).manager?.id ?? data.managerId ?? (data as any).manager ?? null,
                
                type: data.type || "Normal",
                
                // Map transferLedger -> defaultLedgerCardId
                defaultLedgerCardId: (data as any).transferLedger?.id ?? data.defaultLedgerCardId ?? (data as any).transferLedger ?? null,
                
                // Map transferAccount -> transferAccountId
                transferAccountId: (data as any).transferAccount?.id ?? data.transferAccountId ?? (data as any).transferAccount ?? null,
                
                allowNegativeBalance: data.allowNegativeBalance ?? true,
                isActive: data.isActive ?? true,
                
                // Transform Zones: locations -> locationRequest, locationCode -> code
                zones: (data.zones || []).map((z: any) => {
                    return {
                        id: z.id,
                        code: z.code,
                        name: z.name,
                        rows: z.rows,
                        columns: z.columns,
                        racks: z.racks,
                        isExpanded: false, // Start collapsed for better UX
                        locationRequest: (z.locations || []).map((l: any) => ({
                            code: l.locationCode,
                            row: l.row,
                            column: l.column,
                            rack: l.rack
                        }))
                    };
                }),
                
                fromTime,
                toTime
            });
        } catch (error) {
            console.error("Failed to fetch warehouse details", error);
        }
    }
});

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  try {
    const payload = {
      ...values,
      operationalHours: `${formatTime(values.fromTime)} - ${formatTime(values.toTime)}`
    };
    
    if (payload.type === 'Normal') {
        payload.zones = [];
    }

    if (editMode) {
       await updateWarehouse(warehouseId, payload);
    } else {
       await createWarehouse(payload);
    }
    router.push({ name: "Warehouses" });
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
                <Tab  v-if="values.type === 'Professional'" value="additional">
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
                <TabPanel v-if="values.type === 'Professional'" value="additional">
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