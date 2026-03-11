/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import ProfessionalsPage from '../src/components/Professionals/ProfessionalsPage';
import { NavigationProvider } from '../src/context/NavigationContext';

test('ProfessionalsPage renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(
      <NavigationProvider>
        <ProfessionalsPage />
      </NavigationProvider>,
    );
  });
});
