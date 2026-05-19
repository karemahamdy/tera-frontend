import{_ as n}from"./RulesCard-BldnKTZc.js";import"./iframe-DpBRcyro.js";import"./preload-helper-PPVm8Dsz.js";const e=["Name must be at least 3 characters","Cannot contain special characters","Must be unique across all records","Maximum 100 characters allowed"],d={title:"Design System/RulesCard",component:n,tags:["autodocs"],parameters:{layout:"padded"},argTypes:{title:{control:"text"},color:{control:"select",options:["warning","success","primary","danger","neutral"]},items:{control:"object"}},args:{title:"Validation Rules",color:"warning",items:e}},s={args:{title:"Warning Rules",color:"warning",items:e}},r={args:{title:"Guidelines",color:"success",items:e}},t={args:{title:"Information",color:"primary",items:e}},a={args:{title:"Restrictions",color:"danger",items:e}},o={args:{title:"Notes",color:"neutral",items:e}},i={render:()=>({setup(){return{items:["Name must be at least 3 characters","Cannot contain special characters","Must be unique across all records"]}},template:`
      <div style="display:flex;flex-direction:column;gap:16px;padding:16px;max-width:480px;background:#fff;">
        <RulesCard title="Warning Rules"  color="warning" :items="items" />
        <RulesCard title="Guidelines"     color="success" :items="items" />
        <RulesCard title="Information"    color="primary" :items="items" />
        <RulesCard title="Restrictions"   color="danger"  :items="items" />
        <RulesCard title="Notes"          color="neutral" :items="items" />
      </div>
    `})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Warning Rules',
    color: 'warning',
    items: sampleItems
  }
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Guidelines',
    color: 'success',
    items: sampleItems
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Information',
    color: 'primary',
    items: sampleItems
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Restrictions',
    color: 'danger',
    items: sampleItems
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Notes',
    color: 'neutral',
    items: sampleItems
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const items = ['Name must be at least 3 characters', 'Cannot contain special characters', 'Must be unique across all records'];
      return {
        items
      };
    },
    template: \`
      <div style="display:flex;flex-direction:column;gap:16px;padding:16px;max-width:480px;background:#fff;">
        <RulesCard title="Warning Rules"  color="warning" :items="items" />
        <RulesCard title="Guidelines"     color="success" :items="items" />
        <RulesCard title="Information"    color="primary" :items="items" />
        <RulesCard title="Restrictions"   color="danger"  :items="items" />
        <RulesCard title="Notes"          color="neutral" :items="items" />
      </div>
    \`
  })
}`,...i.parameters?.docs?.source}}};const p=["Warning","Success","Primary","Danger","Neutral","AllVariants"];export{i as AllVariants,a as Danger,o as Neutral,t as Primary,r as Success,s as Warning,p as __namedExportsOrder,d as default};
