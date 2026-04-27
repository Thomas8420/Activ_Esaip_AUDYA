/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import ProfessionalsPage from '../src/components/Professionals/ProfessionalsPage';
import { renderWithProviders } from './test-utils';

test('ProfessionalsPage renders correctly', async () => {
  await ReactTestRenderer.act(async () => {
    renderWithProviders(<ProfessionalsPage />);
  });
});
