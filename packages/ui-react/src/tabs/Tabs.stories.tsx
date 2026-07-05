import type { Meta, StoryObj } from '@storybook/react';
import { TabBar, TabContent, TabItem, TabPanel, Tabs } from './Tabs';

const meta = {
  title: 'Design System/Molecules/Tabs',
  component: Tabs,
  tags: ['autodocs', 'new'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An accessible tab component built on HeadlessUI. Uses ARIA `tablist`, `tab`, and `tabpanel` roles automatically. Keyboard navigable with Arrow keys, Home, End. Two visual variants: `underline` (border-bottom indicator) and `pill` (filled background).',
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const TABS = ['Overview', 'Settings', 'Activity'];

export const Underline: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`variant="underline"` — the default style with a coloured bottom border on the active tab. Suits page-level navigation and content sections.',
      },
    },
  },
  args: {},
  render: () => (
    <div className='w-96'>
      <Tabs variant='underline'>
        <TabBar variant='underline'>
          {TABS.map(t => (
            <TabItem key={t} variant='underline'>
              {t}
            </TabItem>
          ))}
        </TabBar>
        <TabContent>
          {TABS.map(t => (
            <TabPanel key={t}>
              <p className='text-sm text-foreground-muted'>
                Content for <strong>{t}</strong>
              </p>
            </TabPanel>
          ))}
        </TabContent>
      </Tabs>
    </div>
  ),
};

export const Pill: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`variant="pill"` — selected tab gets a filled background pill. Suits filter bars, segmented controls, and compact UIs.',
      },
    },
  },
  args: {},
  render: () => (
    <div className='w-96'>
      <Tabs variant='pill'>
        <TabBar variant='pill'>
          {TABS.map(t => (
            <TabItem key={t} variant='pill'>
              {t}
            </TabItem>
          ))}
        </TabBar>
        <TabContent>
          {TABS.map(t => (
            <TabPanel key={t}>
              <p className='text-sm text-foreground-muted'>
                Content for <strong>{t}</strong>
              </p>
            </TabPanel>
          ))}
        </TabContent>
      </Tabs>
    </div>
  ),
};
