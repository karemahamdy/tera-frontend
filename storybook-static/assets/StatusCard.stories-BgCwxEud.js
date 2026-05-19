import{S as i}from"./StatusCard-Bzb3hLw2.js";import"./iframe-DpBRcyro.js";import"./preload-helper-PPVm8Dsz.js";const l={title:"Design System/StatusCard",component:i,tags:["autodocs"],parameters:{layout:"padded"},argTypes:{variant:{control:"select",options:["orange","green","blue","pink"],description:"Color theme of the card"},icon:{control:"text",description:"Iconsax icon name"},title:{control:"text",description:"i18n key or plain label"},value:{control:"text",description:"Metric value displayed prominently"}},args:{variant:"blue",icon:"Box",title:"inventory",value:"1,248"}},e={args:{variant:"blue",icon:"Box",title:"inventory",value:"1,248"}},a={args:{variant:"green",icon:"TickCircle",title:"production",value:"342"}},r={args:{variant:"orange",icon:"Warning2",title:"showing",value:"57"}},n={args:{variant:"pink",icon:"CloseCircle",title:"permission",value:"12"}},t={render:()=>({template:`
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:16px;background:#f5f5f5;">
        <StatusCard variant="blue"   icon="Box"         title="inventory"  value="1,248" />
        <StatusCard variant="green"  icon="TickCircle"  title="production" value="342"   />
        <StatusCard variant="orange" icon="Warning2"    title="showing"    value="57"    />
        <StatusCard variant="pink"   icon="CloseCircle" title="permission" value="12"    />
      </div>
    `}),parameters:{layout:"fullscreen"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'blue',
    icon: 'Box',
    title: 'inventory',
    value: '1,248'
  }
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'green',
    icon: 'TickCircle',
    title: 'production',
    value: '342'
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'orange',
    icon: 'Warning2',
    title: 'showing',
    value: '57'
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'pink',
    icon: 'CloseCircle',
    title: 'permission',
    value: '12'
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => ({
    template: \`
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:16px;background:#f5f5f5;">
        <StatusCard variant="blue"   icon="Box"         title="inventory"  value="1,248" />
        <StatusCard variant="green"  icon="TickCircle"  title="production" value="342"   />
        <StatusCard variant="orange" icon="Warning2"    title="showing"    value="57"    />
        <StatusCard variant="pink"   icon="CloseCircle" title="permission" value="12"    />
      </div>
    \`
  }),
  parameters: {
    layout: 'fullscreen'
  }
}`,...t.parameters?.docs?.source}}};const p=["Blue","Green","Orange","Pink","Dashboard"];export{e as Blue,t as Dashboard,a as Green,r as Orange,n as Pink,p as __namedExportsOrder,l as default};
