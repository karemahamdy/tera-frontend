import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import DynamicTable from './DynamicTable.vue';

const userColumns = [
  { field: 'name',       header: 'Name',       sortable: true  },
  { field: 'email',      header: 'Email',       sortable: true  },
  { field: 'role',       header: 'Role',        sortable: false },
  { field: 'status',     header: 'Status',      sortable: false },
  { field: 'action',     header: 'Actions',     sortable: false },
];

const userData = [
  { id: 1, name: 'Ahmed Al-Rashid',   email: 'ahmed@tera.sa',    role: 'Admin',    status: 'Active'   },
  { id: 2, name: 'Sara Mohammed',     email: 'sara@tera.sa',     role: 'Manager',  status: 'Active'   },
  { id: 3, name: 'Khalid Ibrahim',    email: 'khalid@tera.sa',   role: 'Viewer',   status: 'Inactive' },
  { id: 4, name: 'Fatima Al-Zahra',   email: 'fatima@tera.sa',   role: 'Editor',   status: 'Active'   },
  { id: 5, name: 'Omar Abdullah',     email: 'omar@tera.sa',     role: 'Viewer',   status: 'Inactive' },
  { id: 6, name: 'Noor Al-Deen',      email: 'noor@tera.sa',     role: 'Admin',    status: 'Active'   },
  { id: 7, name: 'Yusuf Hassan',      email: 'yusuf@tera.sa',    role: 'Manager',  status: 'Active'   },
];

const inventoryColumns = [
  { field: 'code',      header: 'Code',      sortable: true  },
  { field: 'name',      header: 'Item Name', sortable: true  },
  { field: 'category',  header: 'Category',  sortable: false },
  { field: 'quantity',  header: 'Quantity',  sortable: true  },
  { field: 'unit',      header: 'Unit',      sortable: false },
  { field: 'status',    header: 'Status',    sortable: false },
  { field: 'action',    header: 'Actions',   sortable: false },
];

const inventoryData = [
  { id: 1, code: 'ITM-001', name: 'Steel Pipe 2"',      category: 'Raw Material', quantity: 450,  unit: 'pcs',  status: 'Active'   },
  { id: 2, code: 'ITM-002', name: 'Copper Wire 4mm',    category: 'Electrical',   quantity: 1200, unit: 'm',    status: 'Active'   },
  { id: 3, code: 'ITM-003', name: 'Cement Bag 50kg',    category: 'Construction', quantity: 80,   unit: 'bags', status: 'Inactive' },
  { id: 4, code: 'ITM-004', name: 'PVC Pipe 1.5"',      category: 'Raw Material', quantity: 320,  unit: 'pcs',  status: 'Active'   },
  { id: 5, code: 'ITM-005', name: 'Hydraulic Oil 20L',  category: 'Lubricants',   quantity: 45,   unit: 'cans', status: 'Active'   },
  { id: 6, code: 'ITM-006', name: 'Safety Helmet',      category: 'PPE',          quantity: 200,  unit: 'pcs',  status: 'Active'   },
  { id: 7, code: 'ITM-007', name: 'Work Gloves L',      category: 'PPE',          quantity: 500,  unit: 'pairs',status: 'Inactive' },
];

const meta: Meta<typeof DynamicTable> = {
  title: 'Design System/DynamicTable',
  component: DynamicTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof DynamicTable>;

export const Default: Story = {
  render: () => ({
    setup() {
      const selected = ref([]);
      return { userColumns, userData, selected };
    },
    template: `
      <div style="padding:16px;background:#fff;">
        <DynamicTable
          :columns="userColumns"
          :data="userData"
          :totalRecords="userData.length"
          v-model:selectedRows="selected"
        />
      </div>
    `,
  }),
};

export const InventoryTable: Story = {
  render: () => ({
    setup() {
      const selected = ref([]);
      return { inventoryColumns, inventoryData, selected };
    },
    template: `
      <div style="padding:16px;background:#fff;">
        <DynamicTable
          :columns="inventoryColumns"
          :data="inventoryData"
          :totalRecords="inventoryData.length"
          v-model:selectedRows="selected"
        />
      </div>
    `,
  }),
};

export const WithSelection: Story = {
  render: () => ({
    setup() {
      const selected = ref([]);
      return { userColumns, userData, selected };
    },
    template: `
      <div style="padding:16px;background:#fff;">
        <div style="margin-bottom:8px;font-size:13px;color:#717680;">
          Selected rows: {{ selected.length }}
        </div>
        <DynamicTable
          :columns="userColumns"
          :data="userData"
          :totalRecords="userData.length"
          :hasSelection="true"
          v-model:selectedRows="selected"
        />
      </div>
    `,
  }),
};

export const Loading: Story = {
  render: () => ({
    setup() {
      return { userColumns };
    },
    template: `
      <div style="padding:16px;background:#fff;">
        <DynamicTable
          :columns="userColumns"
          :data="[]"
          :loading="true"
          :totalRecords="0"
        />
      </div>
    `,
  }),
};

export const EmptyState: Story = {
  render: () => ({
    setup() {
      return { userColumns };
    },
    template: `
      <div style="padding:16px;background:#fff;">
        <DynamicTable
          :columns="userColumns"
          :data="[]"
          :loading="false"
          :totalRecords="0"
        />
      </div>
    `,
  }),
};

export const LazyPagination: Story = {
  render: () => ({
    setup() {
      const page  = ref(1);
      const total = 87;
      const rows  = 10;
      const first = ref((page.value - 1) * rows + 1);
      const last  = ref(Math.min(page.value * rows, total));

      const onPageChange = (p: number) => {
        page.value  = p;
        first.value = (p - 1) * rows + 1;
        last.value  = Math.min(p * rows, total);
      };

      return { inventoryColumns, inventoryData, total, first, last, rows, onPageChange };
    },
    template: `
      <div style="padding:16px;background:#fff;">
        <DynamicTable
          :columns="inventoryColumns"
          :data="inventoryData"
          :lazy="true"
          :totalRecords="total"
          :first="first"
          :last="last"
          :rows="rows"
          @page-change="onPageChange"
        />
      </div>
    `,
  }),
};
