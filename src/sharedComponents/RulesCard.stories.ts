import type { Meta, StoryObj } from '@storybook/vue3';
import RulesCard from './RulesCard.vue';

const sampleItems = [
  'Name must be at least 3 characters',
  'Cannot contain special characters',
  'Must be unique across all records',
  'Maximum 100 characters allowed',
];

const meta: Meta<typeof RulesCard> = {
  title: 'Design System/RulesCard',
  component: RulesCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    title: { control: 'text' },
    color: {
      control: 'select',
      options: ['warning', 'success', 'primary', 'danger', 'neutral'],
    },
    items: { control: 'object' },
  },
  args: {
    title: 'Validation Rules',
    color: 'warning',
    items: sampleItems,
  },
};

export default meta;
type Story = StoryObj<typeof RulesCard>;

export const Warning: Story = {
  args: { title: 'Warning Rules', color: 'warning', items: sampleItems },
};

export const Success: Story = {
  args: { title: 'Guidelines', color: 'success', items: sampleItems },
};

export const Primary: Story = {
  args: { title: 'Information', color: 'primary', items: sampleItems },
};

export const Danger: Story = {
  args: { title: 'Restrictions', color: 'danger', items: sampleItems },
};

export const Neutral: Story = {
  args: { title: 'Notes', color: 'neutral', items: sampleItems },
};

export const AllVariants: Story = {
  render: () => ({
    setup() {
      const items = [
        'Name must be at least 3 characters',
        'Cannot contain special characters',
        'Must be unique across all records',
      ];
      return { items };
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;padding:16px;max-width:480px;background:#fff;">
        <RulesCard title="Warning Rules"  color="warning" :items="items" />
        <RulesCard title="Guidelines"     color="success" :items="items" />
        <RulesCard title="Information"    color="primary" :items="items" />
        <RulesCard title="Restrictions"   color="danger"  :items="items" />
        <RulesCard title="Notes"          color="neutral" :items="items" />
      </div>
    `,
  }),
};
