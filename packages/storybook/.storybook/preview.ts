import type { Preview } from "@storybook/react";

// Import design tokens so all stories have access to CSS custom properties
import "@ds/tokens/css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      config: {},
    },
  },
};

export default preview;
