<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    columns: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] },
    paginator: { type: Boolean, default: true },
    rows: { type: Number, default: 10 },
    loading: { type: Boolean, default: false },
    rowsPerPageOptions: { type: Array, default: () => [5, 10, 20, 50] },
    menuItems: { type: Array, default: () => [] },
    getStatusBadge: { type: Function, default: null },
    getStatusText: { type: Function, default: null },
});

const emit = defineEmits(["action-menu-click"]);

const menu = ref(null);

const toggleMenu = (event, row) => {
    emit('action-menu-click', { event, data: row });
    if (menu.value && menu.value.toggle) menu.value.toggle(event);
};

const filteredData = computed(() => props.data || []);

const getStatusBadge = (status) => {
    return status === "Active" ? "status-active" : "status-inactive";
}

const getStatusText = (status) => {
    return status === "Active" ? "status-text-active" : "status-text-inactive";
}

</script>

<template>
    <DataTable :value="filteredData" :paginator="true" :rows="rows" :rowsPerPageOptions="[5, 10, 20, 50]"
        :loading="loading"
        paginatorTemplate="paginatorstart FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink paginatorend"
        currentPageReportTemplate="Showing {first}-{last} of {totalRecords} Records"
        class="border-2 border-[#E7E6E8] rounded-md" responsiveLayout="scroll">
        <template #paginatorstart>
            <div class="text-gray-600 font-medium">
                Showing {{ first }}–{{ last }} of {{ totalRecords }} Records
            </div>
        </template>
        <template #paginatorend>
        </template>
        
        <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" :sortable="col.sortable"
            :style="col.style">

            <template #body="slotProps">
                <slot :name="'col-' + col.field" v-bind="slotProps">
                    <!-- Avatar -->
                    <div v-if="col.type === 'avatar'" class="user-cell">
                        <Avatar :image="slotProps.data.avatar"
                            :label="!slotProps.data.avatar ? slotProps.data.name.charAt(0) : ''" shape="circle"
                            class="w-[40px] h-[40px] bg-gray-800" />
                        <div class="flex flex-col">
                            <div class="text-base text-gray-700">{{ slotProps.data.name }}</div>
                            <div class="text-sm text-gray-500">{{ slotProps.data.email }}</div>
                        </div>
                    </div>

                    <!-- Tag -->
                    <Tag v-else-if="col.type === 'tag'" :value="slotProps.data[col.field]" :class="col.Class" />
                    <!-- badge -->
                    <Badge v-else-if="col.type === 'badge'" :value="slotProps.data[col.field]" :class="col.Class" />
                    <!-- Status Column -->
                    <div v-else-if="col.field === 'status'" class="flex  align-items-center gap-2">
                        <Badge :class="getStatusBadge(slotProps.data.status)"
                            style="border: 1px solid white;  align-items:center; margin-top:8px"></Badge>
                        <span :class="getStatusText(slotProps.data.status)">
                            {{ slotProps.data.status }}
                        </span>
                    </div>

                    <!-- Permission Icon -->
                    <Button v-else-if="col.field === 'permission'" icon="pi pi-shield" text rounded
                        @click="toggleMenu($event, slotProps.data)" class="permission-btn" />

                    <!-- Action Column -->
                    <Button v-else-if="col.field === 'action'" icon="pi pi-ellipsis-v" text rounded
                        @click="toggleMenu($event, slotProps.data)" />

                    <!-- Default Text -->
                    <span v-else>{{ slotProps.data[col.field] }}</span>
                </slot>
            </template>
        </Column>
    </DataTable>
    <!-- Action Menu -->
    <Menu ref="menu" :model="menuItems" popup />
</template>


<style scoped>
.user-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
}

.custom-tag {
    background: var(--color-primary-25);
    color: var(--color-gray-700);
    padding: 4px 12px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 300;
}

.custom-badge {
    background: var(--color-gray-200);
    color: var(--color-gray-700);
    padding: 16px 12px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
}

/* status */
.status-active {
    background: var(--color-success-500);
    outline: 1px solid var(--color-success-500);
}

.status-inactive {
    background: var(--color-warning-500);
    outline: 1px solid var(--color-warning-500);
}

.status-text-active {
    color: var(--color-success-500);
}

.status-text-inactive {
    color: var(--color-warning-500);
}

/* table  */
:deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 16px;
    color: var(--color-gray-500);
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background: #FAF9F9;
    font-weight: 600;
    color: var(--color-gray-700);
    font-size: 13px;
    padding: 20px 16px;
}

.permission-btn {
    color: var(--color-primary-500);
}

.permission-btn:hover {
    color: var(--color-primary-500) !important;
    background-color: var(--color-primary-25) !important;
}

/* paginator */
::v-deep .p-paginator {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

::v-deep .p-paginator .p-paginator-current {
  color: var(--color-gray-600) !important; 
  font-size: 14px;
}

::v-deep .p-paginator .p-paginator-page {
  border: 1px solid #e5e7eb ;
  border-radius: 8px;
  padding: 6px 10px;
  margin: 0 2px;
  min-width: 36px;
  text-align: center;
  
}
::v-deep .p-paginator .p-paginator-page:hover {
  color: #ffffff !important;
}

::v-deep .p-paginator .p-paginator-page.p-paginator-page-selected {
  background-color: var(--color-primary-500) !important;
  color: #ffffff !important;
  border-color: #3b56e5 !important;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

::v-deep .p-paginator .p-paginator-prev,
::v-deep .p-paginator .p-paginator-next,
::v-deep .p-paginator .p-paginator-first,
::v-deep .p-paginator .p-paginator-last {
  border: 1px solid #e5e7eb  !important;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* hover */
::v-deep .p-paginator .p-paginator-page:hover,
::v-deep .p-paginator .p-paginator-prev:hover,
::v-deep .p-paginator .p-paginator-next:hover {
  background: #4d70b6 !important;
}

</style>