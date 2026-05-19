import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import StatusDialog from './StatusDialog.vue';

const meta: Meta<typeof StatusDialog> = {
  title: 'Design System/StatusDialog',
  component: StatusDialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof StatusDialog>;

const btn = (label: string, color = '#3f5fac') =>
  `<button @click="visible = true" style="padding:12px 28px;background:${color};color:white;border:none;border-radius:8px;cursor:pointer;font-size:15px;font-family:Inter,sans-serif;">${label}</button>`;

export const ConfirmDelete: Story = {
  render: () => ({
    setup() {
      const visible = ref(false);
      return { visible };
    },
    template: `
      <div>
        ${btn('Open Confirm Dialog', '#f04438')}
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
    `,
  }),
};

export const SuccessMessage: Story = {
  render: () => ({
    setup() {
      const visible = ref(false);
      return { visible };
    },
    template: `
      <div>
        ${btn('Open Success Dialog', '#12b76a')}
        <StatusDialog
          v-model:visible="visible"
          title="Saved Successfully"
          description="Your changes have been saved and are now live."
          :buttons="[{ label: 'button.close', variant: 'primary', action: 'cancel' }]"
          @cancel="visible = false"
        />
      </div>
    `,
  }),
};

export const WithSpinner: Story = {
  render: () => ({
    setup() {
      const visible = ref(false);
      return { visible };
    },
    template: `
      <div>
        ${btn('Open Processing Dialog')}
        <StatusDialog
          v-model:visible="visible"
          title="Processing..."
          description="Please wait while we process your request."
          :showSpinner="true"
          :closable="false"
        />
      </div>
    `,
  }),
};

export const WithTimer: Story = {
  render: () => ({
    setup() {
      const visible = ref(false);
      return { visible };
    },
    template: `
      <div>
        ${btn('Open Timer Dialog', '#f79009')}
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
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    setup() {
      const showDelete  = ref(false);
      const showSuccess = ref(false);
      const showLoading = ref(false);
      return { showDelete, showSuccess, showLoading };
    },
    template: `
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
    `,
  }),
};
