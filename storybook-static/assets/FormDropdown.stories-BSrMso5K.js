import{d as p,r as s}from"./iframe-DpBRcyro.js";import"./preload-helper-PPVm8Dsz.js";const t=[{label:"Option A",value:"a"},{label:"Option B",value:"b"},{label:"Option C",value:"c"},{label:"Option D",value:"d"}],u={title:"Design System/FormDropdown",component:p,tags:["autodocs"],argTypes:{label:{control:"text"},placeholder:{control:"text"},disabled:{control:"boolean"},invalid:{control:"boolean"},error:{control:"text"},optionValue:{control:"text"}},args:{label:"Category",modelValue:null,options:t,placeholder:"Select an option",disabled:!1,invalid:!1,optionValue:"value"}},e={args:{label:"Category",placeholder:"Select a category"}},a={args:{label:"Status",modelValue:"b",options:t}},l={args:{label:"Department",modelValue:null,invalid:!0,error:"Please select a department",placeholder:"Select department"}},o={args:{label:"Locked Field",modelValue:"a",disabled:!0}},r={args:{label:"Country",placeholder:"Search and select...",options:[{label:"Saudi Arabia",value:"sa"},{label:"United Arab Emirates",value:"ae"},{label:"Egypt",value:"eg"},{label:"Kuwait",value:"kw"},{label:"Qatar",value:"qa"},{label:"Bahrain",value:"bh"},{label:"Oman",value:"om"},{label:"Jordan",value:"jo"}]}},n={render:()=>({setup(){const i=s(null),d=s("b");return{val1:i,val2:d,sampleOptions:t}},template:`
      <div style="display: flex; flex-direction: column; gap: 24px; padding: 16px; max-width: 400px;">
        <FormDropdown label="Empty" v-model="val1" :options="sampleOptions" placeholder="Select..." />
        <FormDropdown label="With Selection" v-model="val2" :options="sampleOptions" />
        <FormDropdown label="Disabled" v-model="val2" :options="sampleOptions" :disabled="true" />
        <FormDropdown label="Invalid" v-model="val1" :options="sampleOptions" :invalid="true" error="This field is required" placeholder="Required" />
      </div>
    `})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Category',
    placeholder: 'Select a category'
  }
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Status',
    modelValue: 'b',
    options: sampleOptions
  }
}`,...a.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Department',
    modelValue: null,
    invalid: true,
    error: 'Please select a department',
    placeholder: 'Select department'
  }
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Locked Field',
    modelValue: 'a',
    disabled: true
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Country',
    placeholder: 'Search and select...',
    options: [{
      label: 'Saudi Arabia',
      value: 'sa'
    }, {
      label: 'United Arab Emirates',
      value: 'ae'
    }, {
      label: 'Egypt',
      value: 'eg'
    }, {
      label: 'Kuwait',
      value: 'kw'
    }, {
      label: 'Qatar',
      value: 'qa'
    }, {
      label: 'Bahrain',
      value: 'bh'
    }, {
      label: 'Oman',
      value: 'om'
    }, {
      label: 'Jordan',
      value: 'jo'
    }]
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => ({
    setup() {
      const val1 = ref(null);
      const val2 = ref('b');
      return {
        val1,
        val2,
        sampleOptions
      };
    },
    template: \`
      <div style="display: flex; flex-direction: column; gap: 24px; padding: 16px; max-width: 400px;">
        <FormDropdown label="Empty" v-model="val1" :options="sampleOptions" placeholder="Select..." />
        <FormDropdown label="With Selection" v-model="val2" :options="sampleOptions" />
        <FormDropdown label="Disabled" v-model="val2" :options="sampleOptions" :disabled="true" />
        <FormDropdown label="Invalid" v-model="val1" :options="sampleOptions" :invalid="true" error="This field is required" placeholder="Required" />
      </div>
    \`
  })
}`,...n.parameters?.docs?.source}}};const b=["Default","WithSelection","WithError","Disabled","WithManyOptions","AllStates"];export{n as AllStates,e as Default,o as Disabled,l as WithError,r as WithManyOptions,a as WithSelection,b as __namedExportsOrder,u as default};
