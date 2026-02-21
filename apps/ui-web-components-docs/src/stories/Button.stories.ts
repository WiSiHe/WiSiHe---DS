import type { Meta, StoryObj } from '@storybook/web-components-vite';

type ButtonArgs = {
  label: string;
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading: boolean;
  disabled: boolean;
  fullWidth: boolean;
  type: 'button' | 'submit' | 'reset';
};

const meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  args: {
    label: 'Button',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
    type: 'button',
  },
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    type: {
      control: { type: 'radio' },
      options: ['button', 'submit', 'reset'],
    },
  },
  render: (args: ButtonArgs) => {
    const wrapper = document.createElement('div');
    wrapper.style.width = args.fullWidth ? '260px' : 'auto';

    const element = document.createElement('wisihe-button');
    element.textContent = args.label;
    element.setAttribute('variant', args.variant);
    element.setAttribute('size', args.size);
    element.setAttribute('type', args.type);

    if (args.loading) {
      element.setAttribute('loading', '');
    } else {
      element.removeAttribute('loading');
    }

    if (args.disabled) {
      element.setAttribute('disabled', '');
    } else {
      element.removeAttribute('disabled');
    }

    if (args.fullWidth) {
      element.setAttribute('full-width', '');
    } else {
      element.removeAttribute('full-width');
    }

    wrapper.appendChild(element);
    return wrapper;
  },
} satisfies Meta<ButtonArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const DangerLoading: Story = {
  args: {
    label: 'Deleting...',
    variant: 'danger',
    loading: true,
  },
};
