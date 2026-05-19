import type { Meta, StoryObj } from '@storybook/vue3';
import ScreenHeader from './ScreenHeader.vue';

const meta: Meta<typeof ScreenHeader> = {
  title: 'Design System/ScreenHeader',
  component: ScreenHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    title:      { control: 'text' },
    subtitle:   { control: 'text' },
    actionName: { control: 'text' },
    crudType:   { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof ScreenHeader>;

export const TitleOnly: Story = {
  args: { title: 'inventory' },
};

export const TitleAndSubtitle: Story = {
  args: {
    title:    'inventory',
    subtitle: 'masterData',
  },
};

export const WithAction: Story = {
  args: {
    title:      'inventory',
    subtitle:   'masterData',
    actionName: 'button.addNew',
  },
};

export const FullBreadcrumb: Story = {
  args: {
    title:      'inventory',
    subtitle:   'masterData',
    actionName: 'button.edit',
    crudType:   'button.update',
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;padding:16px;background:#fff;">
        <ScreenHeader title="inventory" />
        <ScreenHeader title="inventory" subtitle="masterData" />
        <ScreenHeader title="inventory" subtitle="masterData" actionName="button.addNew" />
        <ScreenHeader title="inventory" subtitle="masterData" actionName="button.edit" crudType="button.update" />
      </div>
    `,
  }),
};
