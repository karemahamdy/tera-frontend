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
const viewMode = props.mode === "view";
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
    allowNegativeBalance: false,
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
  const [hoursRaw, minutesRaw] = timeStr.split(':');
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  const date = new Date();
  date.setHours(Number.isNaN(hours) ? 0 : hours, Number.isNaN(minutes) ? 0 : minutes, 0, 0);
  return date;
};

onMounted(async () => {
    if ((editMode || viewMode) && warehouseId) {
        try {
            const data = await fetchWarehouseById(warehouseId);
            if (!data) return;
      
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
                nameEn: (data as any).namenameEn || "", 
                nameAr: (data as any).namenameAr || "", 
                description: data.description || "",
                address: data.address || "",
                managerId: (data as any).manager?.id ?? data.managerId ?? (data as any).manager ?? null,  
                type: data.type || "Normal",
                defaultLedgerCardId: (data as any).transferLedger?.id ?? data.defaultLedgerCardId ?? (data as any).transferLedger ?? null,   
                transferAccountId: (data as any).transferAccount?.id ?? data.transferAccountId ?? (data as any).transferAccount ?? null,        
                allowNegativeBalance: data.allowNegativeBalance ?? true,
                isActive: data.isActive ?? true,
      
                zones: (data.zones || []).map((z: any) => {
                    return {
                        id: z.id,
                        code: z.code,
                        name: z.name,
                        rows: z.rows,
                        columns: z.columns,
                        racks: z.racks,
                        isExpanded: false, 
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
                    :disabled="viewMode"
                    @update:modelValue="updateForm" 
                 />
                </TabPanel>
                <TabPanel v-if="values.type === 'Professional'" value="additional">
                  <WarehouseZones 
                    :modelValue="values.zones" 
                    :disabled="viewMode"
                    @update:modelValue="v => setFieldValue('zones', v)"
                  />
                </TabPanel>
            </TabPanels>
            </Tabs>
            <div v-if="!viewMode" class="flex gap-4 px-20 mt-6">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'Warehouses' }" />
            <BaseButton type="submit" :label="editMode ? 'button.save' : 'button.create'" variant="primary" block
                :loading="isSubmitting" />
            </div>
            <div v-else class="flex gap-4 px-20 mt-6">
            <BaseButton label="button.back" variant="ghost" block :to="{ name: 'Warehouses' }" />
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