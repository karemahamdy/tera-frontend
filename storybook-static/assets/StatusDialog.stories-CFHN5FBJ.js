import{S as u,r as t}from"./iframe-DpBRcyro.js";import"./preload-helper-PPVm8Dsz.js";const p={title:"Design System/StatusDialog",component:u,tags:["autodocs"],parameters:{layout:"centered"}},r=(e,l="#3f5fac")=>`<button @click="visible = true" style="padding:12px 28px;background:${l};color:white;border:none;border-radius:8px;cursor:pointer;font-size:15px;font-family:Inter,sans-serif;">${e}</button>`,s={render:()=>({setup(){return{visible:t(!1)}},template:`
      <div>
        ${r("Open Confirm Dialog","#f04438")}
        <StatusDialog
          v-model:visible="visible"
          title="Delete Record"
          description="Are you sure you want to delete this record? This action cannot be undone."
          :buttons="[
            { label: 'button.cancel',  variant: 'ghost',   action: 'cancel'  },
            { label: 'button.confirm', variant: 'danger',  action: 'confirm' }
          ]"
          @cancel="visible = false"
          @confirm="visible = false"
        />
      </div>
    `})},i={render:()=>({setup(){return{visible:t(!1)}},template:`
      <div>
        ${r("Open Success Dialog","#12b76a")}
        <StatusDialog
          v-model:visible="visible"
          title="Saved Successfully"
          description="Your changes have been saved and are now live."
          :buttons="[{ label: 'button.close', variant: 'primary', action: 'cancel' }]"
          @cancel="visible = false"
        />
      </div>
    `})},o={render:()=>({setup(){return{visible:t(!1)}},template:`
      <div>
        ${r("Open Processing Dialog")}
        <StatusDialog
          v-model:visible="visible"
          title="Processing..."
          description="Please wait while we process your request."
          :showSpinner="true"
          :closable="false"
        />
      </div>
    `})},n={render:()=>({setup(){return{visible:t(!1)}},template:`
      <div>
        ${r("Open Timer Dialog","#f79009")}
        <StatusDialog
          v-model:visible="visible"
          title="Session Expiring"
          description="Your session will expire in"
          timer="04:59"
          :buttons="[
            { label: 'button.cancel',  variant: 'ghost',   action: 'cancel'  },
            { label: 'button.confirm', variant: 'primary', action: 'confirm' }
          ]"
          @cancel="visible = false"
          @confirm="visible = false"
        />
      </div>
    `})},a={render:()=>({setup(){const e=t(!1),l=t(!1),c=t(!1);return{showDelete:e,showSuccess:l,showLoading:c}},template:`
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <button @click="showDelete  = true" style="padding:10px 20px;background:#f04438;color:white;border:none;border-radius:8px;cursor:pointer;">Delete Confirm</button>
        <button @click="showSuccess = true" style="padding:10px 20px;background:#12b76a;color:white;border:none;border-radius:8px;cursor:pointer;">Success</button>
        <button @click="showLoading = true" style="padding:10px 20px;background:#3f5fac;color:white;border:none;border-radius:8px;cursor:pointer;">Processing</button>

        <StatusDialog
          v-model:visible="showDelete"
          title="Delete Record"
          description="This action cannot be undone."
          :buttons="[{ label:'button.cancel', variant:'ghost', action:'cancel' }, { label:'button.confirm', variant:'danger', action:'confirm' }]"
          @cancel="showDelete = false"
          @confirm="showDelete = false"
        />
        <StatusDialog
          v-model:visible="showSuccess"
          title="Saved Successfully"
          description="Your changes are now live."
          :buttons="[{ label:'button.close', variant:'primary', action:'cancel' }]"
          @cancel="showSuccess = false"
        />
        <StatusDialog
          v-model:visible="showLoading"
          title="Processing..."
          description="Please wait."
          :showSpinner="true"
          :closable="false"
        />
      </div>
    `})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const visible = ref(false);
      return {
        visible
      };
    },
    template: \`
      <div>
        \${btn('Open Confirm Dialog', '#f04438')}
        <StatusDialog
          v-model:visible="visible"
          title="Delete Record"
          description="Are you sure you want to delete this record? This action cannot be undone."
          :buttons="[
            { label: 'button.cancel',  variant: 'ghost',   action: 'cancel'  },
            { label: 'button.confirm', variant: 'danger',  action: 'confirm' }
          ]"
          @cancel="visible = false"
          @confirm="visible = false"
        />
      </div>
    \`
  })
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const visible = ref(false);
      return {
        visible
      };
    },
    template: \`
      <div>
        \${btn('Open Success Dialog', '#12b76a')}
        <StatusDialog
          v-model:visible="visible"
          title="Saved Successfully"
          description="Your changes have been saved and are now live."
          :buttons="[{ label: 'button.close', variant: 'primary', action: 'cancel' }]"
          @cancel="visible = false"
        />
      </div>
    \`
  })
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const visible = ref(false);
      return {
        visible
      };
    },
    template: \`
      <div>
        \${btn('Open Processing Dialog')}
        <StatusDialog
          v-model:visible="visible"
          title="Processing..."
          description="Please wait while we process your request."
          :showSpinner="true"
          :closable="false"
        />
      </div>
    \`
  })
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const visible = ref(false);
      return {
        visible
      };
    },
    template: \`
      <div>
        \${btn('Open Timer Dialog', '#f79009')}
        <StatusDialog
          v-model:visible="visible"
          title="Session Expiring"
          description="Your session will expire in"
          timer="04:59"
          :buttons="[
            { label: 'button.cancel',  variant: 'ghost',   action: 'cancel'  },
            { label: 'button.confirm', variant: 'primary', action: 'confirm' }
          ]"
          @cancel="visible = false"
          @confirm="visible = false"
        />
      </div>
    \`
  })
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const showDelete = ref(false);
      const showSuccess = ref(false);
      const showLoading = ref(false);
      return {
        showDelete,
        showSuccess,
        showLoading
      };
    },
    template: \`
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <button @click="showDelete  = true" style="padding:10px 20px;background:#f04438;color:white;border:none;border-radius:8px;cursor:pointer;">Delete Confirm</button>
        <button @click="showSuccess = true" style="padding:10px 20px;background:#12b76a;color:white;border:none;border-radius:8px;cursor:pointer;">Success</button>
        <button @click="showLoading = true" style="padding:10px 20px;background:#3f5fac;color:white;border:none;border-radius:8px;cursor:pointer;">Processing</button>

        <StatusDialog
          v-model:visible="showDelete"
          title="Delete Record"
          description="This action cannot be undone."
          :buttons="[{ label:'button.cancel', variant:'ghost', action:'cancel' }, { label:'button.confirm', variant:'danger', action:'confirm' }]"
          @cancel="showDelete = false"
          @confirm="showDelete = false"
        />
        <StatusDialog
          v-model:visible="showSuccess"
          title="Saved Successfully"
          description="Your changes are now live."
          :buttons="[{ label:'button.close', variant:'primary', action:'cancel' }]"
          @cancel="showSuccess = false"
        />
        <StatusDialog
          v-model:visible="showLoading"
          title="Processing..."
          description="Please wait."
          :showSpinner="true"
          :closable="false"
        />
      </div>
    \`
  })
}`,...a.parameters?.docs?.source}}};const v=["ConfirmDelete","SuccessMessage","WithSpinner","WithTimer","AllVariants"];export{a as AllVariants,s as ConfirmDelete,i as SuccessMessage,o as WithSpinner,n as WithTimer,v as __namedExportsOrder,p as default};
