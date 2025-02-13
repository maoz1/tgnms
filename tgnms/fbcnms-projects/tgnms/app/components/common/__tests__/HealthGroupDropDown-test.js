/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow strict-local
 */

import HealthGroupDropDown from '../HealthGroupDropDown';
import React from 'react';
import {TestApp} from '@fbcnms/tg-nms/app/tests/testHelpers';
import {fireEvent, render} from '@testing-library/react';

const defaultProps = {
  executions: [{assetName: 'testLink', results: []}],
  onRowSelect: jest.fn(),
  dropDownText: 'testText',
  health: 0,
};

test('renders', () => {
  const {getByText} = render(
    <TestApp>
      <HealthGroupDropDown {...defaultProps} />
    </TestApp>,
  );
  expect(getByText('testText')).toBeInTheDocument();
});

test('drops down when clicked', () => {
  const {getByTestId} = render(
    <TestApp>
      <HealthGroupDropDown {...defaultProps} />
    </TestApp>,
  );
  expect(getByTestId('drawer-toggle-button')).toBeInTheDocument();
  fireEvent.click(getByTestId('drawer-toggle-button'));
  expect(getByTestId('drop-down-table')).toBeInTheDocument();
});
