import{_ as d,r as c}from"./iframe-DpBRcyro.js";import"./preload-helper-PPVm8Dsz.js";const m={title:"Design System/BaseButton",component:d,tags:["autodocs"],argTypes:{label:{control:"text"},variant:{control:"select",options:["primary","danger","ghost","outline-primary"]},icon:{control:"text"},block:{control:"boolean"},type:{control:"select",options:["button","submit","reset"]},onClick:{action:"clicked"}},args:{label:"button.save",variant:"primary",block:!1}},t={args:{label:"button.save",variant:"primary"}},a={args:{label:"button.delete",variant:"danger"}},e={args:{label:"button.cancel",variant:"ghost"}},n={args:{label:"button.edit",variant:"outline-primary"}},r={args:{label:"button.addNew",variant:"primary",icon:"Add"}},o={args:{label:"button.save",variant:"primary",block:!0},decorators:[()=>({template:'<div style="width:320px;padding:16px;"><story /></div>'})]},s={render:()=>({setup(){return{count:c(0)}},template:`
      <div style="display:flex;flex-direction:column;align-items:flex-start;gap:16px;padding:24px;background:#fff;">
        <BaseButton
          label="button.save"
          variant="primary"
          icon="TickCircle"
          :onClick="() => count++"
        />
        <p style="font-size:14px;color:#414651;margin:0;">
          Clicked <strong>{{ count }}</strong> {{ count === 1 ? 'time' : 'times' }}
        </p>
      </div>
    `})},l={render:()=>({setup(){return{counts:c({primary:0,danger:0,ghost:0,outline:0})}},template:`
      <div style="display:flex;flex-direction:column;gap:24px;padding:24px;background:#fff;">

        <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center;">
          <BaseButton label="button.save"   variant="primary"         :onClick="() => counts.primary++" />
          <BaseButton label="button.delete" variant="danger"          :onClick="() => counts.danger++"  />
          <BaseButton label="button.cancel" variant="ghost"           :onClick="() => counts.ghost++"   />
          <BaseButton label="button.edit"   variant="outline-primary" :onClick="() => counts.outline++" />
        </div>

        <div style="display:flex;gap:24px;font-size:13px;color:#717680;flex-wrap:wrap;">
          <span>Primary: <strong style="color:#3f5fac;">{{ counts.primary }}</strong></span>
          <span>Danger:  <strong style="color:#f04438;">{{ counts.danger }}</strong></span>
          <span>Ghost:   <strong style="color:#717680;">{{ counts.ghost }}</strong></span>
          <span>Outline: <strong style="color:#3f5fac;">{{ counts.outline }}</strong></span>
        </div>

      </div>
    `})},i={render:()=>({setup(){return{last:c("—")}},template:`
      <div style="display:flex;flex-direction:column;gap:20px;padding:24px;background:#fff;">
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
          <BaseButton label="button.addNew" variant="primary"         icon="Add"        :onClick="() => last = 'Add New'" />
          <BaseButton label="button.edit"   variant="outline-primary" icon="Edit"       :onClick="() => last = 'Edit'" />
          <BaseButton label="button.delete" variant="danger"          icon="Trash"      :onClick="() => last = 'Delete'" />
          <BaseButton label="button.cancel" variant="ghost"           icon="CloseCircle":onClick="() => last = 'Cancel'" />
        </div>
        <p style="font-size:13px;color:#717680;margin:0;">Last clicked: <strong style="color:#181d27;">{{ last }}</strong></p>
      </div>
    `})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'button.save',
    variant: 'primary'
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'button.delete',
    variant: 'danger'
  }
}`,...a.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'button.cancel',
    variant: 'ghost'
  }
}`,...e.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'button.edit',
    variant: 'outline-primary'
  }
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'button.addNew',
    variant: 'primary',
    icon: 'Add'
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'button.save',
    variant: 'primary',
    block: true
  },
  decorators: [() => ({
    template: '<div style="width:320px;padding:16px;"><story /></div>'
  })]
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const count = ref(0);
      return {
        count
      };
    },
    template: \`
      <div style="display:flex;flex-direction:column;align-items:flex-start;gap:16px;padding:24px;background:#fff;">
        <BaseButton
          label="button.save"
          variant="primary"
          icon="TickCircle"
          :onClick="() => count++"
        />
        <p style="font-size:14px;color:#414651;margin:0;">
          Clicked <strong>{{ count }}</strong> {{ count === 1 ? 'time' : 'times' }}
        </p>
      </div>
    \`
  })
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const counts = ref({
        primary: 0,
        danger: 0,
        ghost: 0,
        outline: 0
      });
      return {
        counts
      };
    },
    template: \`
      <div style="display:flex;flex-direction:column;gap:24px;padding:24px;background:#fff;">

        <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center;">
          <BaseButton label="button.save"   variant="primary"         :onClick="() => counts.primary++" />
          <BaseButton label="button.delete" variant="danger"          :onClick="() => counts.danger++"  />
          <BaseButton label="button.cancel" variant="ghost"           :onClick="() => counts.ghost++"   />
          <BaseButton label="button.edit"   variant="outline-primary" :onClick="() => counts.outline++" />
        </div>

        <div style="display:flex;gap:24px;font-size:13px;color:#717680;flex-wrap:wrap;">
          <span>Primary: <strong style="color:#3f5fac;">{{ counts.primary }}</strong></span>
          <span>Danger:  <strong style="color:#f04438;">{{ counts.danger }}</strong></span>
          <span>Ghost:   <strong style="color:#717680;">{{ counts.ghost }}</strong></span>
          <span>Outline: <strong style="color:#3f5fac;">{{ counts.outline }}</strong></span>
        </div>

      </div>
    \`
  })
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const last = ref('—');
      return {
        last
      };
    },
    template: \`
      <div style="display:flex;flex-direction:column;gap:20px;padding:24px;background:#fff;">
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
          <BaseButton label="button.addNew" variant="primary"         icon="Add"        :onClick="() => last = 'Add New'" />
          <BaseButton label="button.edit"   variant="outline-primary" icon="Edit"       :onClick="() => last = 'Edit'" />
          <BaseButton label="button.delete" variant="danger"          icon="Trash"      :onClick="() => last = 'Delete'" />
          <BaseButton label="button.cancel" variant="ghost"           icon="CloseCircle":onClick="() => last = 'Cancel'" />
        </div>
        <p style="font-size:13px;color:#717680;margin:0;">Last clicked: <strong style="color:#181d27;">{{ last }}</strong></p>
      </div>
    \`
  })
}`,...i.parameters?.docs?.source}}};const b=["Primary","Danger","Ghost","OutlinePrimary","WithIcon","FullWidth","ClickFeedback","AllVariants","IconVariants"];export{l as AllVariants,s as ClickFeedback,a as Danger,o as FullWidth,e as Ghost,i as IconVariants,n as OutlinePrimary,t as Primary,r as WithIcon,b as __namedExportsOrder,m as default};
