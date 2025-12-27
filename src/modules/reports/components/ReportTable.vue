<script setup>
import { ref, computed } from "vue";
import {
  formatDateTimeLang,
  formatDateTimeDetailedLang,
  formatDistanceLang,
} from "@/app/utils/dates";

const props = defineProps({
  columns: { type: Array, default: () => [] },
  data: { type: Array, default: () => [] },
  paginator: { type: Boolean, default: false },
  rows: { type: Number, default: 10 },
  loading: { type: Boolean, default: false },
  rowsPerPageOptions: { type: Array, default: () => [5, 10, 20, 50] },
  menuItems: { type: Array, default: () => [] },
  customItems: { type: Array, default: () => [] },
  permissionItems: { type: Array, default: () => [] },
  getStatusBadge: { type: Function, default: null },
  getStatusText: { type: Function, default: null },
  first: { type: Number, default: 1 },
  last: { type: Number, default: 1 },
  totalRecords: { type: Number, default: 1 },
  lazy: { type: Boolean, default: false },
});

const emit = defineEmits(["action-menu-click", "page-change", "order-change"]);
const menu = ref(null);
const permissionMenu = ref(null);
const permissionRow = ref(null);

const permissionItems = computed(() => {
  return props.permissionItems.map((item) => ({
    ...item,
    command: () => item.command(permissionRow.value),
  }));
});

const togglePermissionMenu = (event, row) => {
  permissionRow.value = row;
  if (permissionMenu.value) permissionMenu.value.toggle(event);
};

const toggleMenu = (event, row) => {
  if (menu.value && menu.value.toggle) {
    menu.value.toggle(event, row);
  }
};

const filteredData = computed(() => props.data || []);

const getStatusBadge = (status) => {
  return status === "Active" ? "status-active" : "status-inactive";
};

const getStatusText = (status) => {
  return status === "Active" ? "status-text-active" : "status-text-inactive";
};

const onPage = (event) => {
  let pageNo = event.page + 1;
  emit("page-change", pageNo);
};

const onSort = (event) => {
  let orderData = {
    orderBy: event.sortField,
    direction: event.sortOrder === 1 ? "asc" : "desc",
  };
  emit("order-change", orderData);
};
</script>

<template>
  <DataTable
    :value="filteredData"
    :paginator="paginator"
    :rows="rows"
    :rowsPerPageOptions="[5, 10, 20, 50]"
    :loading="loading"
    :lazy="lazy"
    :totalRecords="totalRecords"
    @page="onPage"
    @sort="onSort"
    paginatorTemplate="paginatorstart FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink paginatorend"
    currentPageReportTemplate="Showing {first}-{last} of {totalRecords} Records"
    class="border-2 border-[#E7E6E8] rounded-md"
    responsiveLayout="scroll"
  >
    <Column
      v-for="col in columns"
      :key="col.field"
      :field="col.field"
      :header="col.header"
      :sortable="col.sortable"
      :style="col.style"
    >
      <template #body="slotProps">
        <slot :name="'col-' + col.field" v-bind="slotProps">
          <div v-if="col.type == 'date'" class="whitespace-nowrap">
            {{ formatDateTimeLang(slotProps.data[col.field], false) }}
          </div>
          <div v-else-if="col.type == 'dateTime'">
            {{ formatDateTimeLang(slotProps.data[col.field]) }}
          </div>
          <div v-else-if="col.type == 'dateDetailed'">
            {{ formatDateTimeDetailedLang(slotProps.data[col.field], false) }}
          </div>
          <div v-else-if="col.type == 'dateTimeDetailed'">
            {{ formatDateTimeDetailedLang(slotProps.data[col.field]) }}
          </div>
          <div v-else-if="col.type == 'relativeTime'">
            {{ formatDistanceLang(slotProps.data[col.field]) }}
          </div>
          <!-- Default Text -->
          <span v-else>{{ slotProps.data[col.field] }}</span>
        </slot>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped></style>
