// import { withThemeByClassName } from '@storybook/addon-themes';
import '../styles/style.css';

// import { DocsTemplate } from '../components/DocsTemplate';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    docs: {
      toc: {
        // title: 'Table of Contents',
        // contentsSelector: '.sbdocs-content',
        ignoreSelector: '#primary',
        disable: false,
        headingSelector: 'h1, h2, h3, h4',
      },
      //   page: DocsTemplate,
    },
    options: {
      storySort: {
        order: ['Welcome', 'Colors', 'Typography', 'Changelog', 'Components'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [],
};

export default preview;
