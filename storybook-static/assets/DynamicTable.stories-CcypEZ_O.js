import{D as y,r as a}from"./iframe-DpBRcyro.js";import"./preload-helper-PPVm8Dsz.js";const i=[{field:"name",header:"Name",sortable:!0},{field:"email",header:"Email",sortable:!0},{field:"role",header:"Role",sortable:!1},{field:"status",header:"Status",sortable:!1},{field:"action",header:"Actions",sortable:!1}],g=[{id:1,name:"Ahmed Al-Rashid",email:"ahmed@tera.sa",role:"Admin",status:"Active"},{id:2,name:"Sara Mohammed",email:"sara@tera.sa",role:"Manager",status:"Active"},{id:3,name:"Khalid Ibrahim",email:"khalid@tera.sa",role:"Viewer",status:"Inactive"},{id:4,name:"Fatima Al-Zahra",email:"fatima@tera.sa",role:"Editor",status:"Active"},{id:5,name:"Omar Abdullah",email:"omar@tera.sa",role:"Viewer",status:"Inactive"},{id:6,name:"Noor Al-Deen",email:"noor@tera.sa",role:"Admin",status:"Active"},{id:7,name:"Yusuf Hassan",email:"yusuf@tera.sa",role:"Manager",status:"Active"}],f=[{field:"code",header:"Code",sortable:!0},{field:"name",header:"Item Name",sortable:!0},{field:"category",header:"Category",sortable:!1},{field:"quantity",header:"Quantity",sortable:!0},{field:"unit",header:"Unit",sortable:!1},{field:"status",header:"Status",sortable:!1},{field:"action",header:"Actions",sortable:!1}],v=[{id:1,code:"ITM-001",name:'Steel Pipe 2"',category:"Raw Material",quantity:450,unit:"pcs",status:"Active"},{id:2,code:"ITM-002",name:"Copper Wire 4mm",category:"Electrical",quantity:1200,unit:"m",status:"Active"},{id:3,code:"ITM-003",name:"Cement Bag 50kg",category:"Construction",quantity:80,unit:"bags",status:"Inactive"},{id:4,code:"ITM-004",name:'PVC Pipe 1.5"',category:"Raw Material",quantity:320,unit:"pcs",status:"Active"},{id:5,code:"ITM-005",name:"Hydraulic Oil 20L",category:"Lubricants",quantity:45,unit:"cans",status:"Active"},{id:6,code:"ITM-006",name:"Safety Helmet",category:"PPE",quantity:200,unit:"pcs",status:"Active"},{id:7,code:"ITM-007",name:"Work Gloves L",category:"PPE",quantity:500,unit:"pairs",status:"Inactive"}],C={title:"Design System/DynamicTable",component:y,tags:["autodocs"],parameters:{layout:"padded"}},n={render:()=>({setup(){const e=a([]);return{userColumns:i,userData:g,selected:e}},template:`
      <div style="padding:16px;background:#fff;">
        <DynamicTable
          :columns="userColumns"
          :data="userData"
          :totalRecords="userData.length"
          v-model:selectedRows="selected"
        />
      </div>
    `})},s={render:()=>({setup(){const e=a([]);return{inventoryColumns:f,inventoryData:v,selected:e}},template:`
      <div style="padding:16px;background:#fff;">
        <DynamicTable
          :columns="inventoryColumns"
          :data="inventoryData"
          :totalRecords="inventoryData.length"
          v-model:selectedRows="selected"
        />
      </div>
    `})},r={render:()=>({setup(){const e=a([]);return{userColumns:i,userData:g,selected:e}},template:`
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
    `})},o={render:()=>({setup(){return{userColumns:i}},template:`
      <div style="padding:16px;background:#fff;">
        <DynamicTable
          :columns="userColumns"
          :data="[]"
          :loading="true"
          :totalRecords="0"
        />
      </div>
    `})},l={render:()=>({setup(){return{userColumns:i}},template:`
      <div style="padding:16px;background:#fff;">
        <DynamicTable
          :columns="userColumns"
          :data="[]"
          :loading="false"
          :totalRecords="0"
        />
      </div>
    `})},d={render:()=>({setup(){const e=a(1),c=87,t=10,m=a((e.value-1)*t+1),p=a(Math.min(e.value*t,c));return{inventoryColumns:f,inventoryData:v,total:c,first:m,last:p,rows:t,onPageChange:u=>{e.value=u,m.value=(u-1)*t+1,p.value=Math.min(u*t,c)}}},template:`
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
    `})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const selected = ref([]);
      return {
        userColumns,
        userData,
        selected
      };
    },
    template: \`
      <div style="padding:16px;background:#fff;">
        <DynamicTable
          :columns="userColumns"
          :data="userData"
          :totalRecords="userData.length"
          v-model:selectedRows="selected"
        />
      </div>
    \`
  })
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const selected = ref([]);
      return {
        inventoryColumns,
        inventoryData,
        selected
      };
    },
    template: \`
      <div style="padding:16px;background:#fff;">
        <DynamicTable
          :columns="inventoryColumns"
          :data="inventoryData"
          :totalRecords="inventoryData.length"
          v-model:selectedRows="selected"
        />
      </div>
    \`
  })
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const selected = ref([]);
      return {
        userColumns,
        userData,
        selected
      };
    },
    template: \`
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
    \`
  })
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      return {
        userColumns
      };
    },
    template: \`
      <div style="padding:16px;background:#fff;">
        <DynamicTable
          :columns="userColumns"
          :data="[]"
          :loading="true"
          :totalRecords="0"
        />
      </div>
    \`
  })
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      return {
        userColumns
      };
    },
    template: \`
      <div style="padding:16px;background:#fff;">
        <DynamicTable
          :columns="userColumns"
          :data="[]"
          :loading="false"
          :totalRecords="0"
        />
      </div>
    \`
  })
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const page = ref(1);
      const total = 87;
      const rows = 10;
      const first = ref((page.value - 1) * rows + 1);
      const last = ref(Math.min(page.value * rows, total));
      const onPageChange = (p: number) => {
        page.value = p;
        first.value = (p - 1) * rows + 1;
        last.value = Math.min(p * rows, total);
      };
      return {
        inventoryColumns,
        inventoryData,
        total,
        first,
        last,
        rows,
        onPageChange
      };
    },
    template: \`
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
    \`
  })
}`,...d.parameters?.docs?.source}}};const w=["Default","InventoryTable","WithSelection","Loading","EmptyState","LazyPagination"];export{n as Default,l as EmptyState,s as InventoryTable,d as LazyPagination,o as Loading,r as WithSelection,w as __namedExportsOrder,C as default};
