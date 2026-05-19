import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import FormDropdown from './FormDropdown.vue';

const sampleOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
  { label: 'Option D', value: 'd' },
];

const meta: Meta<typeof FormDropdown> = {
  title: 'Design System/FormDropdown',
  component: FormDropdown,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    error: { control: 'text' },
    optionValue: { control: 'text' },
  },
  args: {
    label: 'Category',
    modelValue: null,
    options: sampleOptions,
    placeholder: 'Select an option',
    disabled: false,
    invalid: false,
    optionValue: 'value',
  },
};

export default meta;
type Story = StoryObj<typeof FormDropdown>;

export const Default: Story = {
  args: { label: 'Category', placeholder: 'Select a category' },
};

export const WithSelection: Story = {
  args: { label: 'Status', modelValue: 'b', options: sampleOptions },
};

export const WithError: Story = {
  args: {
    label: 'Department',
    modelValue: null,
    invalid: true,
    error: 'Please select a department',
    placeholder: 'Select department',
  },
};

export const Disabled: Story = {
  args: { label: 'Locked Field', modelValue: 'a', disabled: true },
};

export const WithManyOptions: Story = {
  args: {
    label: 'Country',
    placeholder: 'Search and select...',
    options: [
      { label: 'Saudi Arabia', value: 'sa' },
      { label: 'United Arab Emirates', value: 'ae' },
      { label: 'Egypt', value: 'eg' },
      { label: 'Kuwait', value: 'kw' },
      { label: 'Qatar', value: 'qa' },
      { label: 'Bahrain', value: 'bh' },
      { label: 'Oman', value: 'om' },
      { label: 'Jordan', value: 'jo' },
    ],
  },
};

export const AllStates: Story = {
  render: () => ({
    setup() {
      const val1 = ref(null);
      const val2 = ref('b');
      return { val1, val2, sampleOptions };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; padding: 16px; max-width: 400px;">
        <FormDropdown label="Empty" v-model="val1" :options="sampleOptions" placeholder="Select..." />
        <FormDropdown label="With Selection" v-model="val2" :options="sampleOptions" />
        <FormDropdown label="Disabled" v-model="val2" :options="sampleOptions" :disabled="true" />
        <FormDropdown label="Invalid" v-model="val1" :options="sampleOptions" :invalid="true" error="This field is required" placeholder="Required" />
      </div>
    `,
  }),
};
