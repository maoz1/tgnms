/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import ConfigContentError from '../ConfigContentError';
import {
  CONFIG_PARAM_MODE,
  FORM_CONFIG_MODES,
} from '@fbcnms/tg-nms/app/constants/ConfigConstants';
import {TestApp} from '@fbcnms/tg-nms/app/tests/testHelpers';
import {mockConfigTaskContextValue} from '@fbcnms/tg-nms/app/tests/data/NetworkConfig';
import {render} from '@testing-library/react';

jest
  .spyOn(
    require('@fbcnms/tg-nms/app/contexts/ConfigTaskContext'),
    'useConfigTaskContext',
  )
  .mockReturnValue(mockConfigTaskContextValue());

test('renders specific mode error', async () => {
  const {getByText} = render(
    <TestApp>
      <ConfigContentError />
    </TestApp>,
  );
  expect(
    getByText(
      `Error when loading ${
        CONFIG_PARAM_MODE[FORM_CONFIG_MODES.NETWORK]
      }. This configuration data is unreachable.`,
    ),
  ).toBeInTheDocument();
});
