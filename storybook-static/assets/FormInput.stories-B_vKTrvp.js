import{F as u,r as s}from"./iframe-DpBRcyro.js";import"./preload-helper-PPVm8Dsz.js";const c={title:"Design System/FormInput",component:u,tags:["autodocs"],argTypes:{label:{control:"text"},modelValue:{control:"text"},type:{control:"select",options:["text","email","password","number","date"]},placeholder:{control:"text"},disabled:{control:"boolean"},invalid:{control:"boolean"},error:{control:"text",description:"Error message (i18n key or plain text)"}},args:{label:"Full Name",modelValue:"",type:"text",placeholder:"Enter full name",disabled:!1,invalid:!1}},e={args:{label:"Full Name",placeholder:"Enter full name"}},a={args:{label:"Username",modelValue:"john.doe",placeholder:"Enter username"}},l={args:{label:"Email",modelValue:"not-an-email",invalid:!0,error:"Please enter a valid email address",placeholder:"Enter email"}},r={args:{label:"Read-only Field",modelValue:"Cannot edit this",disabled:!0}},t={args:{label:"Date",type:"date",placeholder:"Select a date"}},o={render:()=>({setup(){const n=s(""),d=s("prefilled value"),i=s("");return{value1:n,value2:d,value3:i}},template:`
      <div style="display: flex; flex-direction: column; gap: 24px; padding: 16px; max-width: 400px;">
        <FormInput label="Empty" v-model="value1" placeholder="Type something..." />
        <FormInput label="With Value" v-model="value2" />
        <FormInput label="Disabled" v-model="value2" :disabled="true" />
        <FormInput label="Invalid" v-model="value3" :invalid="true" error="This field is required" placeholder="Required field" />
      </div>
    `})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Full Name',
    placeholder: 'Enter full name'
  }
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Username',
    modelValue: 'john.doe',
    placeholder: 'Enter username'
  }
}`,...a.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    modelValue: 'not-an-email',
    invalid: true,
    error: 'Please enter a valid email address',
    placeholder: 'Enter email'
  }
}`,...l.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Read-only Field',
    modelValue: 'Cannot edit this',
    disabled: true
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Date',
    type: 'date',
    placeholder: 'Select a date'
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const value1 = ref('');
      const value2 = ref('prefilled value');
      const value3 = ref('');
      return {
        value1,
        value2,
        value3
      };
    },
    template: \`
      <div style="display: flex; flex-direction: column; gap: 24px; padding: 16px; max-width: 400px;">
        <FormInput label="Empty" v-model="value1" placeholder="Type something..." />
        <FormInput label="With Value" v-model="value2" />
        <FormInput label="Disabled" v-model="value2" :disabled="true" />
        <FormInput label="Invalid" v-model="value3" :invalid="true" error="This field is required" placeholder="Required field" />
      </div>
    \`
  })
}`,...o.parameters?.docs?.source}}};const v=["Default","WithValue","WithError","Disabled","DatePicker","AllStates"];export{o as AllStates,t as DatePicker,e as Default,r as Disabled,l as WithError,a as WithValue,v as __namedExportsOrder,c as default};
