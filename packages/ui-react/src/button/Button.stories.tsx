import type { Meta, StoryObj } from '@storybook/react';
import { IconArrowRight, IconCircleCheck } from '@tabler/icons-react';

import { Button } from './Button';

/** Storybook tag badges: https://storybook.js.org/addons/storybook-addon-tag-badges */
const meta = {
  title: 'Design System/Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'destructive', 'success', 'accent'],
      description: 'Visual style / emphasis',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'icon'],
      description:
        'Text sizes: small · medium · large. Use size `icon` with `Icon` (and no text) for square icon-only buttons — there is no separate `iconOnly` variant.',
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
    },
    isLoading: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    children: { control: 'text' },
    as: {
      control: false,
      description: 'Polymorphic root (e.g. Next.js `Link`, or `"a"` for anchors)',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ['primary', 'secondary', 'tertiary', 'destructive', 'success', 'accent'] as const;

const TEXT_SIZES = ['small', 'medium', 'large'] as const;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Primary button',
  },
};

/**
 * Full matrix: every **variant** × **text sizes** (small / medium / large), plus **icon-only** (`size="icon"` + `Icon`).
 * Icon-only does not use a separate `variant` — it reuses the same variants with `size="icon"`.
 */
export const AllVariantsAndSizes: Story = {
  name: 'All variants & sizes',
  render: () => (
    <div className='flex max-w-5xl flex-col gap-10'>
      <div className='flex flex-col gap-2 text-sm text-foreground-subtle'>
        <p>
          Icon-only actions use{' '}
          <code className='rounded bg-surface-hover px-1.5 py-0.5 font-mono text-foreground'>
            size=&quot;icon&quot;
          </code>{' '}
          with an{' '}
          <code className='rounded bg-surface-hover px-1.5 py-0.5 font-mono text-foreground'>
            Icon
          </code>
          {', optional '}
          <code className='font-mono'>aria-label</code>
          {', and usually no '}
          <code className='font-mono'>children</code>.
        </p>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full min-w-xl border-collapse text-left text-sm'>
          <thead>
            <tr className='border-b border-border'>
              <th className='p-3 pr-6 font-medium text-foreground-subtle'>Variant</th>
              {TEXT_SIZES.map(size => (
                <th key={size} className='p-3 font-medium capitalize text-foreground-subtle'>
                  {size}
                </th>
              ))}
              <th className='p-3 font-medium text-foreground-subtle'>Icon only</th>
            </tr>
          </thead>
          <tbody>
            {VARIANTS.map(variant => (
              <tr key={variant} className='border-b border-border/80'>
                <td className='p-3 pr-6 font-mono text-xs capitalize text-foreground-subtle'>
                  {variant}
                </td>
                {TEXT_SIZES.map(size => (
                  <td key={size} className='p-3 align-middle'>
                    <Button variant={variant} size={size}>
                      Label
                    </Button>
                  </td>
                ))}
                <td className='p-3 align-middle'>
                  <Button
                    variant={variant}
                    size='icon'
                    Icon={IconCircleCheck}
                    aria-label={`${variant}: confirm`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className='mb-3 text-xs font-semibold uppercase tracking-wide text-foreground-subtle'>
          States (primary, medium)
        </h3>
        <div className='flex flex-wrap items-center gap-3'>
          <Button variant='primary' size='medium'>
            Default
          </Button>
          <Button variant='primary' size='medium' isLoading>
            Loading
          </Button>
          <Button variant='primary' size='medium' isDisabled>
            Disabled
          </Button>
          <Button variant='primary' size='medium' Icon={IconCircleCheck} iconPosition='left'>
            With icon
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    isLoading: true,
    children: 'Loading…',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    isDisabled: true,
    children: 'Disabled',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    Icon: IconCircleCheck,
    iconPosition: 'left',
    children: 'Save',
  },
};

export const IconRight: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    Icon: IconArrowRight,
    iconPosition: 'right',
    children: 'Continue',
  },
};

/** Square icon-only control: `size="icon"` + `Icon` + `aria-label` (no separate variant). */
export const IconOnly: Story = {
  name: 'Icon only (size: icon)',
  render: () => (
    <div className='flex flex-wrap items-center gap-3'>
      {VARIANTS.map(variant => (
        <Button
          key={variant}
          variant={variant}
          size='icon'
          Icon={IconCircleCheck}
          aria-label={`${variant} action`}
        />
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/** Same styles on a native anchor (`href` from `ComponentPropsWithRef<"a">`). */
export const AsAnchor: Story = {
  name: 'As anchor',
  args: {
    variant: 'primary',
    size: 'medium',
    as: 'a',
    href: '#',
    children: 'Link as button',
  },
};
