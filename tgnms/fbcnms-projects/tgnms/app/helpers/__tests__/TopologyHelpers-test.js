/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow
 */

import * as TopologyHelpers from '../TopologyHelpers';
import * as serviceApiUtil from '@fbcnms/tg-nms/app/apiutils/ServiceAPIUtil';
import {FIG0, mockFig0} from '@fbcnms/tg-nms/app/tests/data/NetworkConfig';
import {buildTopologyMaps} from '@fbcnms/tg-nms/app/helpers/TopologyHelpers';

const apiRequestSuccessMock = jest.fn(() => Promise.resolve({}));

jest
  .spyOn(serviceApiUtil, 'apiRequest')
  .mockImplementation(apiRequestSuccessMock);

const {nodeMap, linkMap} = buildTopologyMaps(mockFig0());

const defaultProps = {
  nodeMap,
  link: linkMap[FIG0.LINK1],
  networkName: 'testNetwork',
  azimuthManager: {
    addLink: jest.fn(),
    deleteLink: jest.fn(),
    moveSite: jest.fn(),
  },
};

test('calling useDelete returns initial loading', async () => {
  const result = await TopologyHelpers.deleteLinkRequest(defaultProps);
  expect(apiRequestSuccessMock).toHaveBeenCalled();
  expect(result.success).toBe(true);
});