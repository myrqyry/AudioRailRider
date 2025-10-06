import React from 'react';
import { render, screen } from '@testing-library/react';
import RendererWarning from './RendererWarning';

// We can't easily mock WEBGL_debug_renderer_info in jsdom. Ensure the
// component doesn't crash when extensions aren't present and returns null by default.

test('renders nothing in non-webgl environment', () => {
  const { container } = render(<RendererWarning />);
  expect(container.firstChild).toBeNull();
});
