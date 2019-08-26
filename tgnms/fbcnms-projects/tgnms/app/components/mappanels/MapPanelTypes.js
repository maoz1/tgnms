/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow
 */

import type {LocationType, NodeType} from '../../../shared/types/Topology';

export type TopologyScanInfo = {
  bestSnr: number,
  responderInfo: {
    pos: LocationType,
    addr: string,
  },
};

export type Routes = {|
  node: ?NodeType,
  links: {[string]: number},
  nodes: Set<NodeType>,
  onUpdateRoutes: ($Shape<Routes>) => any,
  routes: {
    node: string,
  },
|};

/*
 * Parameters passed to AddNodePanel. Used for creating/editing nodes.
 */
export type EditNodeParams = {
  ...$Shape<NodeType>,
  txGolayIdx?: ?number,
  rxGolayIdx?: ?number,
  wlan_mac_addrs?: ?string,
};

export type NearbyNodes = {
  [string]: Array<TopologyScanInfo>,
};

export type PlannedSite = {
  name: string,
  ...$Shape<LocationType>,
};