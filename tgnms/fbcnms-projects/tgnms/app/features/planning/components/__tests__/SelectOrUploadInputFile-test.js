/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow
 */

import * as React from 'react';
import * as apiMock from '@fbcnms/tg-nms/app/apiutils/NetworkPlanningAPIUtil';
import SelectOrUploadInputFile from '../SelectOrUploadInputFile';
import {FILE_ROLE} from '@fbcnms/tg-nms/shared/dto/ANP';
import {act, fireEvent} from '@testing-library/react';
import {renderAsync} from '@fbcnms/tg-nms/app/tests/testHelpers';
import {waitFor} from '@testing-library/dom';
jest.mock('@fbcnms/tg-nms/app/apiutils/NetworkPlanningAPIUtil');
const commonProps = {
  id: 'test',
  label: 'Select Test File',
  role: FILE_ROLE.DSM_GEOTIFF,
  fileTypes: '.tiff',
  onChange: jest.fn(),
};
beforeEach(() => {
  jest.resetAllMocks();
});

describe('Modal', () => {
  test('modal opens when user clicks browse,closes when user clicks cancel', async () => {
    jest.spyOn(apiMock, 'getPartnerFiles').mockResolvedValue({data: null});
    const {getByText, queryByTestId} = await renderAsync(
      <SelectOrUploadInputFile {...commonProps} />,
    );
    const getModal = () => queryByTestId('select-or-upload-anpfile');
    expect(getModal()).not.toBeInTheDocument();
    await act(async () => {
      fireEvent.click(getByText(/browse/i));
    });
    const modal = getModal();
    expect(modal).toBeInTheDocument();
    if (!modal) {
      throw new Error('Modal is null');
    }
    await act(async () => {
      fireEvent.click(getByText(/cancel/i));
    });
    await waitFor(() => {
      expect(getModal()).not.toBeInTheDocument();
    });
  });
});
describe('Upload new file', () => {
  test.todo('');
});
describe('Select existing file', () => {
  test.todo('');
});
