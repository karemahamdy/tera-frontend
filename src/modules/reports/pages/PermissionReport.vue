<script setup lang="ts">
import { computed, ref } from "vue";
import PageHeader from "@/sharedComponents/PageHeader.vue";
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import { useFilters } from "@/composables/useFilters";
import ReportFilters from "../components/ReportFilters.vue";
import { useI18n } from "vue-i18n";
// import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import { AccordionPanel } from "primevue";
const { t } = useI18n();
const data = ref([
  {
    id: 1,
    internalID: "JD001",
    userName: "johndoe",
    fullName: "John Doe",
    email: "johndoe@example.com",
    department: "Finance",
    userGroup: "Admin Group",
    isAdmin: "yes",
    status: "Active",
    accessScope: "Global",
    lastLogin: "2025-12-29",
    role: "Manager",
    modules: [
      {
        moduleCode: "Finance",
        permissions: { view: true, create: true, edit: true, delete: false },
        permissionDtos: [
          { name: "Invoices", view: true, create: true, edit: true, delete: false },
          { name: "Payments", view: true, create: false, edit: false, delete: false },
        ],
      },
      {
        moduleCode: "Reports",
        permissions: { view: true, create: false, edit: false, delete: false },
        permissionDtos: [
          { name: "Monthly Report", view: true, create: false, edit: false, delete: false },
          { name: "Annual Report", view: true, create: false, edit: false, delete: false },
        ],
      },
    ],
  },
  {
    id: 2,
    internalID: "AS002",
    userName: "annasmith",
    fullName: "Anna Smith",
    email: "annasmith@example.com",
    department: "HR",
    userGroup: "HR Group",
    isAdmin: "no",
    status: "Active",
    accessScope: "Department",
    lastLogin: "2025-12-28",
    role: "HR Specialist",
    modules: [
      {
        moduleCode: "Recruitment",
        permissions: { view: true, create: true, edit: false, delete: false },
        permissionDtos: [
          { name: "Candidates", view: true, create: true, edit: false, delete: false },
          { name: "Interviews", view: true, create: true, edit: false, delete: false },
        ],
      },
      {
        moduleCode: "Payroll",
        permissions: { view: true, create: false, edit: false, delete: false },
        permissionDtos: [
          { name: "Salary Slips", view: true, create: false, edit: false, delete: false },
        ],
      },
    ],
  },
]);

// const loading = ref(false);
const filtersOperation = [
  {
    placeholder: "reports.allGroups",
    value: null,
    field: "allGroups",
    options: [
      { label: " allDepartments", value: null },
      { label: "Department 1", value: "Department 1" },
    ],
  },
  {
    placeholder: "reports.allRoles",
    value: null,
    field: "allGroups",
    options: [
      { label: " allGroups", value: null },
      { label: "Group 1", value: "Group 1" },
    ],
  },
  {
    placeholder: "reports.allModule",
    value: null,
    field: "allGroups",
    options: [
      { label: " allGroups", value: null },
      { label: "Group 1", value: "Group 1" },
    ],
  },
  {
    placeholder: "reports.allScreens",
    value: null,
    field: "allGroups",
    options: [
      { label: "allGroups", value: null },
      { label: "Group 1", value: "Group 1" },
    ],
  },
  {
    placeholder: "reports.permission",
    value: null,
    field: "allGroups",
    options: [
      { label: " allGroups", value: null },
      { label: "Group 1", value: "Group 1" },
    ],
  },
];

const {
  filters,
  filteredData: filteredByFilters,
  onFilterChange,
} = useFilters(data.value, filtersOperation);

const columns = computed(() => {
  const Columns = [
    { field: 'internalID', header: t('reports.internalID') },
    { field: 'userName', header: t('reports.userName') },
    { field: 'fullName', header: t('reports.fullName') },
    { field: 'email', header: t('reports.email') },
    { field: 'department', header: t('reports.department') },
    { field: 'userGroup', header: t('reports.userGroup') },
    { field: 'isAdmin', header: t('reports.isAdmin') },
    { field: 'status', header: t('reports.status') },
    { field: 'accessScope', header: t('reports.accessScope') },
    { field: 'lastLogin', header: t('reports.lastLogin'), type: "date" },
  ];
  return Columns;
});
</script>
<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="reports.title" subtitle="reports.userReport" />
    
    <card class="bg-white rounded-[10px] w-full overflow-x-auto">
      <template #title>
        <PageHeader title="reports.userReportInfo" :showExport="true" :showSearch="false" />
        <ReportFilters :showExport="true" :showFilter="true" @filter-change="onFilterChange" :filters="filters" />
      </template>

      <template #content>
        <div class="p-5 border border-[#DCDCDC4D] bg-[#FAF9F9] rounded">
          <!-- Table Header -->
          <div class="grid grid-cols-7 font-bold text-gray-700 p-2 border-b border-gray-300">
            <div>{{ $t("usersManagement.userId") }}</div>
            <div>{{ $t("Name/Module/Screen") }}</div>
            <div>{{ $t("userGroup.userGroup") }}</div>
            <div>{{ $t("roles.roles") }}</div>
            <div class="text-center">{{ $t("button.view") }}</div>
            <div class="text-center">{{ $t("button.create") }}</div>
            <div class="text-center">{{ $t("button.edit") }}</div>
            <div class="text-center">{{ $t("button.delete") }}</div>
          </div>

          <!-- Users Accordion -->
          <Accordion multiple>
            <AccordionPanel v-for="(user, uIndex) in filteredByFilters" :key="user.id">
              <AccordionHeader class="bg-[#F0F3FA] hover:bg-[#E5E9F0] cursor-pointer">
                <div class="grid grid-cols-8 p-2">
                  <div>{{ user.userName }}</div>
                  <div>{{ user.fullName }}</div>
                  <div>{{ user.userGroup }}</div>
                  <div>{{ user.role || '—' }}</div>
                  <div class="text-center">—</div>
                  <div class="text-center">—</div>
                  <div class="text-center">—</div>
                  <div class="text-center">—</div>
                </div>
              </AccordionHeader>

              <AccordionContent>
                <div v-for="module in user.modules" :key="module.moduleCode" class="border-t border-gray-200">
                  <!-- Module header -->
                  <Accordion >
                    <AccordionPanel>
                      <AccordionHeader class="bg-[#F9FAFC] hover:bg-[#EEF1F7] cursor-pointer">
                        <div class="grid grid-cols-5 p-2 font-semibold text-gray-600">
                          <div>{{ module.moduleCode }}</div>
                          <div class="text-center">{{ module.permissions.view ? 'true' : 'false' }}</div>
                          <div class="text-center">{{ module.permissions.create ? 'true' : 'false' }}</div>
                          <div class="text-center">{{ module.permissions.edit ? 'true' : 'false' }}</div>
                          <div class="text-center">{{ module.permissions.delete ? 'true' : 'false' }}</div>
                        </div>
                      </AccordionHeader>
                      <AccordionContent>
                      
                      </AccordionContent>
                    </AccordionPanel>
                  </Accordion>
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      </template>
    </card>
  </div>
</template>
