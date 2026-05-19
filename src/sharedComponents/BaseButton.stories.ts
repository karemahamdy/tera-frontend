import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import BaseButton from './BaseButton.vue';

const meta: Meta<typeof BaseButton> = {
  title: 'Design System/BaseButton',
  component: BaseButton,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: 'select',
      options: ['primary', 'danger', 'ghost', 'outline-primary'],
    },
    icon:  { control: 'text' },
    block: { control: 'boolean' },
    type:  { control: 'select', options: ['button', 'submit', 'reset'] },
    onClick: { action: 'clicked' },
  },
  args: {
    label:   'button.save',
    variant: 'primary',
    block:   false,
  },
};

export default meta;
type Story = StoryObj<typeof BaseButton>;

// ── Single-variant stories ──────────────────────────────────────────────────
// argTypes.onClick: { action: 'clicked' } means Storybook auto-provides a spy
// function so every click is logged in the "Actions" panel below.

export const Primary: Story = {
  args: { label: 'button.save', variant: 'primary' },
};

export const Danger: Story = {
  args: { label: 'button.delete', variant: 'danger' },
};

export const Ghost: Story = {
  args: { label: 'button.cancel', variant: 'ghost' },
};

export const OutlinePrimary: Story = {
  args: { label: 'button.edit', variant: 'outline-primary' },
};

export const WithIcon: Story = {
  args: { label: 'button.addNew', variant: 'primary', icon: 'Add' },
};

export const FullWidth: Story = {
  args: { label: 'button.save', variant: 'primary', block: true },
  decorators: [() => ({ template: '<div style="width:320px;padding:16px;"><story /></div>' })],
};

// ── Interactive counter ─────────────────────────────────────────────────────
// Shows visible on-screen proof that the click registered.

export const ClickFeedback: Story = {
  render: () => ({
    setup() {
      const count = ref(0);
      return { count };
    },
    template: `
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
    `,
  }),
};

// ── All variants side-by-side ───────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    setup() {
      const counts = ref({ primary: 0, danger: 0, ghost: 0, outline: 0 });
      return { counts };
    },
    template: `
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
    `,
  }),
};

// ── With icon variants ──────────────────────────────────────────────────────

export const IconVariants: Story = {
  render: () => ({
    setup() {
      const last = ref('—');
      return { last };
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:20px;padding:24px;background:#fff;">
        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
          <BaseButton label="button.addNew" variant="primary"         icon="Add"        :onClick="() => last = 'Add New'" />
          <BaseButton label="button.edit"   variant="outline-primary" icon="Edit"       :onClick="() => last = 'Edit'" />
          <BaseButton label="button.delete" variant="danger"          icon="Trash"      :onClick="() => last = 'Delete'" />
          <BaseButton label="button.cancel" variant="ghost"           icon="CloseCircle":onClick="() => last = 'Cancel'" />
        </div>
        <p style="font-size:13px;color:#717680;margin:0;">Last clicked: <strong style="color:#181d27;">{{ last }}</strong></p>
      </div>
    `,
  }),
};
