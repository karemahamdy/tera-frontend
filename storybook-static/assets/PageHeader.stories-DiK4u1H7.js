import{a as d,r as t,b as u}from"./iframe-DpBRcyro.js";import"./preload-helper-PPVm8Dsz.js";const f={title:"Design System/PageHeader",component:d,tags:["autodocs"],parameters:{layout:"padded"}},r={render:()=>({setup(){return{lastSearch:t("")}},template:`
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
    `})},a={render:()=>({setup(){return{count:t(0)}},template:`
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
    `})},l={render:()=>({setup(){return{log:t("—")}},template:`
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
    `})},o={render:()=>({setup(){return{log:t("—")}},template:`
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
    `})},s={render:()=>({setup(){const e=u([{value:null,isSingle:!0,options:[{label:"Active",value:"active"},{label:"Inactive",value:"inactive"}],placeholder:"Status",optionLabel:"label",optionValue:"value",showClear:!0},{value:null,isSingle:!0,options:[{label:"Category A",value:"a"},{label:"Category B",value:"b"},{label:"Category C",value:"c"}],placeholder:"Category",optionLabel:"label",optionValue:"value",showClear:!0}]),p=t("—");return{filters:e,lastFilter:p}},template:`
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
    `})},n={render:()=>({setup(){return{filters:u([{value:null,isSingle:!0,options:[{label:"Active",value:"active"},{label:"Inactive",value:"inactive"}],placeholder:"Status",optionLabel:"label",optionValue:"value",showClear:!0},{value:[],isSingle:!1,options:[{label:"Warehouse A",value:"wh_a"},{label:"Warehouse B",value:"wh_b"},{label:"Warehouse C",value:"wh_c"},{label:"Warehouse D",value:"wh_d"}],placeholder:"Warehouse",optionLabel:"label",optionValue:"value",showClear:!0}])}},template:`
      <div style="background:#fff;padding:24px;border-radius:12px;">
        <PageHeader
          title="inventory"
          subtitle="masterData"
          :showMultiFilter="true"
          :filters="filters"
        />
      </div>
    `})},i={render:()=>({setup(){const e=t("—"),p=t(""),c=u([{value:null,isSingle:!0,options:[{label:"Active",value:"active"},{label:"Inactive",value:"inactive"}],placeholder:"Status",optionLabel:"label",optionValue:"value",showClear:!0}]);return{log:e,search:p,filters:c}},template:`
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
    `})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const lastSearch = ref('');
      return {
        lastSearch
      };
    },
    template: \`
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
    \`
  })
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const count = ref(0);
      return {
        count
      };
    },
    template: \`
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
    \`
  })
}`,...a.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const log = ref('—');
      return {
        log
      };
    },
    template: \`
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
    \`
  })
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const log = ref('—');
      return {
        log
      };
    },
    template: \`
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
    \`
  })
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const filters = reactive([{
        value: null,
        isSingle: true,
        options: [{
          label: 'Active',
          value: 'active'
        }, {
          label: 'Inactive',
          value: 'inactive'
        }],
        placeholder: 'Status',
        optionLabel: 'label',
        optionValue: 'value',
        showClear: true
      }, {
        value: null,
        isSingle: true,
        options: [{
          label: 'Category A',
          value: 'a'
        }, {
          label: 'Category B',
          value: 'b'
        }, {
          label: 'Category C',
          value: 'c'
        }],
        placeholder: 'Category',
        optionLabel: 'label',
        optionValue: 'value',
        showClear: true
      }]);
      const lastFilter = ref('—');
      return {
        filters,
        lastFilter
      };
    },
    template: \`
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
    \`
  })
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const filters = reactive([{
        value: null,
        isSingle: true,
        options: [{
          label: 'Active',
          value: 'active'
        }, {
          label: 'Inactive',
          value: 'inactive'
        }],
        placeholder: 'Status',
        optionLabel: 'label',
        optionValue: 'value',
        showClear: true
      }, {
        value: [],
        isSingle: false,
        options: [{
          label: 'Warehouse A',
          value: 'wh_a'
        }, {
          label: 'Warehouse B',
          value: 'wh_b'
        }, {
          label: 'Warehouse C',
          value: 'wh_c'
        }, {
          label: 'Warehouse D',
          value: 'wh_d'
        }],
        placeholder: 'Warehouse',
        optionLabel: 'label',
        optionValue: 'value',
        showClear: true
      }]);
      return {
        filters
      };
    },
    template: \`
      <div style="background:#fff;padding:24px;border-radius:12px;">
        <PageHeader
          title="inventory"
          subtitle="masterData"
          :showMultiFilter="true"
          :filters="filters"
        />
      </div>
    \`
  })
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const log = ref('—');
      const search = ref('');
      const filters = reactive([{
        value: null,
        isSingle: true,
        options: [{
          label: 'Active',
          value: 'active'
        }, {
          label: 'Inactive',
          value: 'inactive'
        }],
        placeholder: 'Status',
        optionLabel: 'label',
        optionValue: 'value',
        showClear: true
      }]);
      return {
        log,
        search,
        filters
      };
    },
    template: \`
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
    \`
  })
}`,...i.parameters?.docs?.source}}};const b=["SearchOnly","WithMainButton","WithImportExport","ExportWithMenu","WithFilters","WithMultiFilters","FullFeatured"];export{o as ExportWithMenu,i as FullFeatured,r as SearchOnly,s as WithFilters,l as WithImportExport,a as WithMainButton,n as WithMultiFilters,b as __namedExportsOrder,f as default};
