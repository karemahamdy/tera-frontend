import{c as o}from"./iframe-DpBRcyro.js";import"./preload-helper-PPVm8Dsz.js";const c={title:"Design System/ScreenHeader",component:o,tags:["autodocs"],parameters:{layout:"padded"},argTypes:{title:{control:"text"},subtitle:{control:"text"},actionName:{control:"text"},crudType:{control:"text"}}},e={args:{title:"inventory"}},t={args:{title:"inventory",subtitle:"masterData"}},a={args:{title:"inventory",subtitle:"masterData",actionName:"button.addNew"}},r={args:{title:"inventory",subtitle:"masterData",actionName:"button.edit",crudType:"button.update"}},n={render:()=>({template:`
      <div style="display:flex;flex-direction:column;gap:24px;padding:16px;background:#fff;">
        <ScreenHeader title="inventory" />
        <ScreenHeader title="inventory" subtitle="masterData" />
        <ScreenHeader title="inventory" subtitle="masterData" actionName="button.addNew" />
        <ScreenHeader title="inventory" subtitle="masterData" actionName="button.edit" crudType="button.update" />
      </div>
    `})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'inventory'
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'inventory',
    subtitle: 'masterData'
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'inventory',
    subtitle: 'masterData',
    actionName: 'button.addNew'
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'inventory',
    subtitle: 'masterData',
    actionName: 'button.edit',
    crudType: 'button.update'
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => ({
    template: \`
      <div style="display:flex;flex-direction:column;gap:24px;padding:16px;background:#fff;">
        <ScreenHeader title="inventory" />
        <ScreenHeader title="inventory" subtitle="masterData" />
        <ScreenHeader title="inventory" subtitle="masterData" actionName="button.addNew" />
        <ScreenHeader title="inventory" subtitle="masterData" actionName="button.edit" crudType="button.update" />
      </div>
    \`
  })
}`,...n.parameters?.docs?.source}}};const d=["TitleOnly","TitleAndSubtitle","WithAction","FullBreadcrumb","AllVariants"];export{n as AllVariants,r as FullBreadcrumb,t as TitleAndSubtitle,e as TitleOnly,a as WithAction,d as __namedExportsOrder,c as default};
