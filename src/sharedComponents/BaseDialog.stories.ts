import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import BaseDialog from './BaseDialog.vue';

const meta: Meta<typeof BaseDialog> = {
  title: 'Design System/BaseDialog',
  component: BaseDialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof BaseDialog>;

const openBtn = (label = 'Open Dialog', color = '#3f5fac') =>
  `<button @click="visible = true" style="padding:12px 28px;background:${color};color:white;border:none;border-radius:8px;cursor:pointer;font-size:15px;font-family:Inter,sans-serif;">${label}</button>`;

export const Default: Story = {
  render: () => ({
    setup() {
      const visible = ref(false);
      return { visible };
    },
    template: `
      <div>
        ${openBtn('Open Dialog')}
        <BaseDialog
          v-model:visible="visible"
          title="Confirm Action"
          subtitle="Are you sure you want to proceed with this action?"
          @cancel="visible = false"
          @confirm="visible = false"
        />
      </div>
    `,
  }),
};

export const WithContent: Story = {
  render: () => ({
    setup() {
      const visible = ref(false);
      const name = ref('');
      const email = ref('');
      return { visible, name, email };
    },
    template: `
      <div>
        ${openBtn('Open Form Dialog')}
        <BaseDialog
          v-model:visible="visible"
          title="Add New User"
          subtitle="Fill in the details to create a new user."
          @cancel="visible = false"
          @confirm="visible = false"
        >
          <div style="display:flex;flex-direction:column;gap:16px;padding:8px 0;">
            <FormInput label="Full Name"     v-model="name"  placeholder="Enter full name"  />
            <FormInput label="Email Address" v-model="email" placeholder="Enter email"       />
          </div>
        </BaseDialog>
      </div>
    `,
  }),
};

export const WideDialog: Story = {
  render: () => ({
    setup() {
      const visible = ref(false);
      return { visible };
    },
    template: `
      <div>
        ${openBtn('Open Wide Dialog')}
        <BaseDialog
          v-model:visible="visible"
          title="Wide Dialog"
          subtitle="This dialog uses a wider width than the default 30rem."
          width="50rem"
          @cancel="visible = false"
          @confirm="visible = false"
        />
      </div>
    `,
  }),
};

export const AllTriggers: Story = {
  render: () => ({
    setup() {
      const showDefault = ref(false);
      const showForm    = ref(false);
      const showWide    = ref(false);
      return { showDefault, showForm, showWide };
    },
    template: `
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <button @click="showDefault = true" style="padding:10px 20px;background:#3f5fac;color:white;border:none;border-radius:8px;cursor:pointer;">Default</button>
        <button @click="showForm    = true" style="padding:10px 20px;background:#3f5fac;color:white;border:none;border-radius:8px;cursor:pointer;">With Form</button>
        <button @click="showWide    = true" style="padding:10px 20px;background:#3f5fac;color:white;border:none;border-radius:8px;cursor:pointer;">Wide</button>

        <BaseDialog v-model:visible="showDefault" title="Default Dialog"   subtitle="Basic confirm/cancel dialog."         @cancel="showDefault = false" @confirm="showDefault = false" />
        <BaseDialog v-model:visible="showForm"    title="Form Dialog"      subtitle="Dialog with form fields inside."      @cancel="showForm    = false" @confirm="showForm    = false">
          <div style="display:flex;flex-direction:column;gap:16px;padding:8px 0;">
            <FormInput label="Name" modelValue="" placeholder="Enter name" @update:modelValue="() => {}" />
          </div>
        </BaseDialog>
        <BaseDialog v-model:visible="showWide"    title="Wide Dialog"      subtitle="This dialog is wider than default."   width="50rem" @cancel="showWide = false" @confirm="showWide = false" />
      </div>
    `,
  }),
};
