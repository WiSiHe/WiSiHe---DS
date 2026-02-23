import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/web-components-vite';
import { registerWisiheWebComponents } from '@wisihe/ui-web-components';
import '../src/styles.css';

registerWisiheWebComponents();

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
