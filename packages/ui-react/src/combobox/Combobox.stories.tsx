import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Combobox, type ComboboxItem } from './Combobox';

type StringCombobox = typeof Combobox<string>;

const FRUITS: ComboboxItem<string>[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'peach', label: 'Peach' },
  { value: 'strawberry', label: 'Strawberry' },
];

const meta = {
  title: 'Design System/Atoms/Combobox',
  component: Combobox,
  tags: ['autodocs', 'new'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A searchable select built on HeadlessUI. Filters options as the user types (internally managed query state, overridable via `query`/`onQueryChange` for async use cases). Follows the same `label`/`description`/`errorMessage` API as `Input`. The selected option is marked with a checkmark and announced to screen readers.',
      },
    },
  },
  args: {
    label: 'Favourite fruit',
    options: FRUITS,
    value: null,
    onChange: () => {},
    placeholder: 'Search fruits...',
  },
} satisfies Meta<StringCombobox>;

export default meta;
type Story = StoryObj<typeof meta>;

function ComboboxDemo(props: { description?: string; errorMessage?: string; disabled?: boolean }) {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className='w-72'>
      <Combobox
        label='Favourite fruit'
        options={FRUITS}
        value={value}
        onChange={setValue}
        placeholder='Search fruits...'
        {...props}
      />
    </div>
  );
}

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Type to filter options. Click or press Enter to select.' } },
  },
  render: () => <ComboboxDemo />,
};

export const WithDescription: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`description` renders above the input and is wired to `aria-describedby` automatically.',
      },
    },
  },
  render: () => <ComboboxDemo description='Pick your all-time favourite.' />,
};

export const WithError: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When `errorMessage` is set, the input gets error styling and the message is announced via `role="alert"`. `aria-invalid` is also set.',
      },
    },
  },
  render: () => <ComboboxDemo errorMessage='Please select a valid option.' />,
};

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Disabled state — not interactive, reduced opacity.' } },
  },
  render: () => <ComboboxDemo disabled />,
};
