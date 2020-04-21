/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow strict-local
 */

import 'jest-dom/extend-expect';
import * as React from 'react';
import ScheduleTime from '../ScheduleTime';
import {MuiPickersWrapper, renderAsync} from '../../../tests/testHelpers';
import {cleanup, fireEvent, render} from '@testing-library/react';

afterEach(cleanup);

const defaultProps = {
  handleCronStringUpdate: jest.fn(),
  handleAdHocChange: jest.fn(),
  adHoc: true,
};

test('renders without crashing', () => {
  const {getByText} = render(<ScheduleTime {...defaultProps} />);
  expect(getByText('Start')).toBeInTheDocument();
  expect(getByText('Frequency')).toBeInTheDocument();
});

test('clicking later adds date and time pickers and calls handleAdHocChange', () => {
  const {getByText} = render(<ScheduleTime {...defaultProps} />);
  expect(getByText('later')).toBeInTheDocument();
  fireEvent.click(getByText('later'));
  expect(defaultProps.handleAdHocChange).toHaveBeenCalled();
});

test('frequency selector changes cron string and call handleCronStringUpdate ', async () => {
  const {getByText} = await renderAsync(
    <MuiPickersWrapper>
      <ScheduleTime {...defaultProps} />
    </MuiPickersWrapper>,
  );
  expect(getByText('Does not repeat')).toBeInTheDocument();
  fireEvent.mouseDown(getByText('Does not repeat'));
  expect(getByText('Once a day')).toBeInTheDocument();
  fireEvent.click(getByText('Once a day'));
  expect(defaultProps.handleCronStringUpdate).toHaveBeenCalled();
});

test('pickers change cron string and call handleCronStringUpdate ', async () => {
  const {getByText} = await renderAsync(
    <MuiPickersWrapper>
      <ScheduleTime {...defaultProps} adHoc={false} />
    </MuiPickersWrapper>,
  );
  expect(getByText('Monday')).toBeInTheDocument();
  fireEvent.mouseDown(getByText('Monday'));
  expect(getByText('Tuesday')).toBeInTheDocument();
  fireEvent.click(getByText('Tuesday'));
  expect(defaultProps.handleCronStringUpdate).toHaveBeenCalled();
});