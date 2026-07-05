import type { Meta, StoryObj } from '@storybook/react-vite';
import { RecipeMetaBadges } from './RecipeMetaBadges';

const meta = {
  title: 'Design System/Molecules/RecipeMetaBadges',
  component: RecipeMetaBadges,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Icon meta badges for recipes (prep/cook/total time, servings, difficulty, calories). Framework-agnostic; the app resolves calories from nutrition macros before passing `caloriesPerServing`.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RecipeMetaBadges>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Card: Story = {
  args: {
    prepTime: 15,
    cookingTime: 30,
    totalTime: 45,
    servings: 4,
    difficulty: 'medium',
    caloriesPerServing: 520,
    variant: 'card',
  },
};

export const Hero: Story = {
  args: {
    ...Card.args,
    variant: 'hero',
  },
  decorators: [
    Story => (
      <div className='rounded-2xl bg-neutral-900 p-8'>
        <Story />
      </div>
    ),
  ],
};

export const Minimal: Story = {
  args: {
    totalTime: 20,
    servings: 2,
  },
};
