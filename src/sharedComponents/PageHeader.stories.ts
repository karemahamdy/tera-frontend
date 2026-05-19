import type { Meta, StoryObj } from '@storybook/vue3';
import { reactive, ref } from 'vue';
import PageHeader from './PageHeader.vue';

const meta: Meta<typeof PageHeader> = {
  title: 'Design System/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

// ── 1. Search only (default) ─────────────────────────────────────────────────
export const SearchOnly: Story = {
  render: () => ({
    setup() {
      const lastSearch = ref('');
      return { lastSearch };
    },
    template: `
      <div style="background:#fff;padding:24px;border-radius:12px;">
        <PageHeader
          title="inventory"
          subtitle="masterData"
          @search="v => lastSearch = v"
        />
        <p style="margin-top:16px;font-size:13px;color:#717680;">
          Search value: <strong style="color:#181d27;">{{ lastSearch || '—' }}</strong>
        </p>
      </div>
    `,
  }),
};

// ── 2. With main action button ───────────────────────────────────────────────
export const WithMainButton: Story = {
  render: () => ({
    setup() {
      const count = ref(0);
      return { count };
    },
    template: `
      <div style="background:#fff;padding:24px;border-radius:12px;">
        <PageHeader
          title="inventory"
          subtitle="masterData"
          mainBtnText="button.addNew"
          :mainBtn="true"
          :onMainBtnClick="() => count++"
        />
        <p style="margin-top:16px;font-size:13px;color:#717680;">
          Add New clicked: <strong style="color:#3f5fac;">{{ count }}</strong>
        </p>
      </div>
    `,
  }),
};

// ── 3. With import & export ──────────────────────────────────────────────────
export const WithImportExport: Story = {
  render: () => ({
    setup() {
      const log = ref('—');
      return { log };
    },
    template: `
      <div style="background:#fff;padding:24px;border-radius:12px;">
        <PageHeader
          title="inventory"
          subtitle="masterData"
          :showImport="true"
          :showExport="true"
          :onExport="() => log = 'Export clicked'"
        />
        <p style="margin-top:16px;font-size:13px;color:#717680;">
          Last action: <strong style="color:#3f5fac;">{{ log }}</strong>
        </p>
      </div>
    `,
  }),
};

// ── 4. Export with dropdown menu (template / data) ───────────────────────────
export const ExportWithMenu: Story = {
  render: () => ({
    setup() {
      const log = ref('—');
      return { log };
    },
    template: `
      <div style="background:#fff;padding:24px;border-radius:12px;">
        <PageHeader
          title="inventory"
          subtitle="masterData"
          :showExport="true"
          :hasMenu="true"
          :onExportTemplate="() => log = 'Template export'"
          :onExportData="   () => log = 'Data export'"
        />
        <p style="margin-top:16px;font-size:13px;color:#717680;">
          Last action: <strong style="color:#3f5fac;">{{ log }}</strong>
        </p>
      </div>
    `,
  }),
};

// ── 5. With single dropdown filters ─────────────────────────────────────────
export const WithFilters: Story = {
  render: () => ({
    setup() {
      const filters = reactive([
        {
          value: null,
          isSingle: true,
          options: [
            { label: 'Active',   value: 'active'   },
            { label: 'Inactive', value: 'inactive' },
          ],
          placeholder: 'Status',
          optionLabel: 'label',
          optionValue: 'value',
          showClear: true,
        },
        {
          value: null,
          isSingle: true,
          options: [
            { label: 'Category A', value: 'a' },
            { label: 'Category B', value: 'b' },
            { label: 'Category C', value: 'c' },
          ],
          placeholder: 'Category',
          optionLabel: 'label',
          optionValue: 'value',
          showClear: true,
        },
      ]);

      const lastFilter = ref('—');
      return { filters, lastFilter };
    },
    template: `
      <div style="background:#fff;padding:24px;border-radius:12px;">
        <PageHeader
          title="inventory"
          subtitle="masterData"
          :showFilter="true"
          :filters="filters"
          @filter-change="({ filter, value }) => lastFilter = value || '—'"
        />
        <p style="margin-top:16px;font-size:13px;color:#717680;">
          Last filter: <strong style="color:#3f5fac;">{{ lastFilter }}</strong>
        </p>
      </div>
    `,
  }),
};

// ── 6. With multi-select filters ─────────────────────────────────────────────
export const WithMultiFilters: Story = {
  render: () => ({
    setup() {
      const filters = reactive([
        {
          value: null,
          isSingle: true,
          options: [
            { label: 'Active',   value: 'active'   },
            { label: 'Inactive', value: 'inactive' },
          ],
          placeholder: 'Status',
          optionLabel: 'label',
          optionValue: 'value',
          showClear: true,
        },
        {
          value: [],
          isSingle: false,
          options: [
            { label: 'Warehouse A', value: 'wh_a' },
            { label: 'Warehouse B', value: 'wh_b' },
            { label: 'Warehouse C', value: 'wh_c' },
            { label: 'Warehouse D', value: 'wh_d' },
          ],
          placeholder: 'Warehouse',
          optionLabel: 'label',
          optionValue: 'value',
          showClear: true,
        },
      ]);

      return { filters };
    },
    template: `
      <div style="background:#fff;padding:24px;border-radius:12px;">
        <PageHeader
          title="inventory"
          subtitle="masterData"
          :showMultiFilter="true"
          :filters="filters"
        />
      </div>
    `,
  }),
};

// ── 7. Full featured ──────────────────────────────────────────────────────────
export const FullFeatured: Story = {
  render: () => ({
    setup() {
      const log     = ref('—');
      const search  = ref('');
      const filters = reactive([
        {
          value: null,
          isSingle: true,
          options: [
            { label: 'Active',   value: 'active'   },
            { label: 'Inactive', value: 'inactive' },
          ],
          placeholder: 'Status',
          optionLabel: 'label',
          optionValue: 'value',
          showClear: true,
        },
      ]);
      return { log, search, filters };
    },
    template: `
      <div style="background:#fff;padding:24px;border-radius:12px;">
        <PageHeader
          title="inventory"
          subtitle="masterData"
          mainBtnText="button.addNew"
          :mainBtn="true"
          :showImport="true"
          :showExport="true"
          :showFilter="true"
          :filters="filters"
          :onMainBtnClick="() => log = 'Add New clicked'"
          :onExport="() => log = 'Export clicked'"
          @search="v => search = v"
          @filter-change="({ value }) => log = 'Filter: ' + (value || 'cleared')"
        />
        <div style="margin-top:16px;font-size:13px;color:#717680;display:flex;gap:24px;flex-wrap:wrap;">
          <span>Search: <strong style="color:#181d27;">{{ search || '—' }}</strong></span>
          <span>Action: <strong style="color:#3f5fac;">{{ log }}</strong></span>
        </div>
      </div>
    `,
  }),
};
