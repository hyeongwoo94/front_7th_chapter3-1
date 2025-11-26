import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';
// design-tokens.css는 globals.css에서 이미 import됨
// import '../src/styles/design-tokens.css';
// components.css는 주석 처리됨
// import '../src/styles/components.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

