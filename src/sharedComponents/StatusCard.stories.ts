import type { Meta, StoryObj } from '@storybook/vue3';
import StatusCard from './StatusCard.vue';

const meta: Meta<typeof StatusCard> = {
  title: 'Design System/StatusCard',
  component: StatusCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['orange', 'green', 'blue', 'pink'],
      description: 'Color theme of the card',
    },
    icon:  { control: 'text', description: 'Iconsax icon name' },
    title: { control: 'text', description: 'i18n key or plain label' },
    value: { control: 'text', description: 'Metric value displayed prominently' },
  },
  args: {
    variant: 'blue',
    icon:    'Box',
    title:   'inventory',
    value:   '1,248',
  },
};

export default meta;
type Story = StoryObj<typeof StatusCard>;

export const Blue: Story = {
  args: { variant: 'blue', icon: 'Box', title: 'inventory', value: '1,248' },
};

export const Green: Story = {
  args: { variant: 'green', icon: 'TickCircle', title: 'production', value: '342' },
};

export const Orange: Story = {
  args: { variant: 'orange', icon: 'Warning2', title: 'showing', value: '57' },
};

export const Pink: Story = {
  args: { variant: 'pink', icon: 'CloseCircle', title: 'permission', value: '12' },
};

export const Dashboard: Story = {
  render: () => ({
    template: `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:16px;background:#f5f5f5;">
        <StatusCard variant="blue"   icon="Box"         title="inventory"  value="1,248" />
        <StatusCard variant="green"  icon="TickCircle"  title="production" value="342"   />
        <StatusCard variant="orange" icon="Warning2"    title="showing"    value="57"    />
        <StatusCard variant="pink"   icon="CloseCircle" title="permission" value="12"    />
      </div>
    `,
  }),
  parameters: { layout: 'fullscreen' },
};
