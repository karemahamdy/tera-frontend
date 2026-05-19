import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import FormInput from './FormInput.vue';

const meta: Meta<typeof FormInput> = {
  title: 'Design System/FormInput',
  component: FormInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    modelValue: { control: 'text' },
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'date'] },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    error: { control: 'text', description: 'Error message (i18n key or plain text)' },
  },
  args: {
    label: 'Full Name',
    modelValue: '',
    type: 'text',
    placeholder: 'Enter full name',
    disabled: false,
    invalid: false,
  },
};

export default meta;
type Story = StoryObj<typeof FormInput>;

export const Default: Story = {
  args: { label: 'Full Name', placeholder: 'Enter full name' },
};

export const WithValue: Story = {
  args: { label: 'Username', modelValue: 'john.doe', placeholder: 'Enter username' },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    modelValue: 'not-an-email',
    invalid: true,
    error: 'Please enter a valid email address',
    placeholder: 'Enter email',
  },
};

export const Disabled: Story = {
  args: { label: 'Read-only Field', modelValue: 'Cannot edit this', disabled: true },
};

export const DatePicker: Story = {
  args: { label: 'Date', type: 'date', placeholder: 'Select a date' },
};

export const AllStates: Story = {
  render: () => ({
    setup() {
      const value1 = ref('');
      const value2 = ref('prefilled value');
      const value3 = ref('');
      return { value1, value2, value3 };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; padding: 16px; max-width: 400px;">
        <FormInput label="Empty" v-model="value1" placeholder="Type something..." />
        <FormInput label="With Value" v-model="value2" />
        <FormInput label="Disabled" v-model="value2" :disabled="true" />
        <FormInput label="Invalid" v-model="value3" :invalid="true" error="This field is required" placeholder="Required field" />
      </div>
    `,
  }),
};
