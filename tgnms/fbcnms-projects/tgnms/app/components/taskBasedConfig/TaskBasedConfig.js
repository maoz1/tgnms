/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow
 */

import * as React from 'react';
import CnConfig from './configTasks/CnConfig';
import ConfigTaskForm from './ConfigTaskForm';
import Grid from '@material-ui/core/Grid';
import KafkaParams from './configTasks/KafkaParams';
import NetworkEnvParams from './configTasks/NetworkEnvParams';
import NetworkRouting from './configTasks/NetworkRouting';
import NetworkSnmp from './configTasks/NetworkSnmp';
import NodeSelector from './NodeSelector';
import Paper from '@material-ui/core/Paper';
import PopKvstoreParams from './configTasks/PopKvstoreParams';
import PopRouting from './configTasks/PopRouting';
import RadioParams from './configTasks/RadioParams';
import SysParams from './configTasks/SysParams';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import {
  configModeDescription,
  configModes,
} from '../../constants/ConfigConstants';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  viewContainer: {
    padding: theme.spacing(3),
    overflow: 'auto',
    height: `calc(100vh - ${theme.spacing(25)}px)`,
  },
  tabsContainer: {
    marginTop: theme.spacing(3),
    borderRight: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.secondary,
    width: theme.spacing(30),
  },
}));

export default function TaskBasedConfig() {
  const classes = useStyles();
  const [configMode, setConfigMode] = React.useState('Network');
  const [nodeName, setNodeName] = React.useState(null);

  const handleSelectNode = React.useCallback(newNodeName => {
    setNodeName(newNodeName);
  }, []);

  const handleConfigChange = React.useCallback(
    (event, newMode) => {
      setConfigMode(newMode);
      setNodeName(null);
    },

    [setConfigMode],
  );

  const configGroups = {
    Network: (
      <>
        <SysParams />
        <NetworkRouting />
        <NetworkEnvParams />
        <NetworkSnmp />
        <KafkaParams />
        <RadioParams />
      </>
    ),
    POP: (
      <>
        <PopRouting />
        <PopKvstoreParams />
      </>
    ),
    CN: <CnConfig />,
    Node: (
      <>
        <SysParams />
        <RadioParams />
      </>
    ),
  };

  return (
    <Paper className={classes.root} elevation={1}>
      <Grid container spacing={0}>
        <Grid
          xs={3}
          container
          item
          justify="space-between"
          className={classes.tabsContainer}
          direction="column">
          <Tabs
            value={configMode}
            onChange={handleConfigChange}
            orientation="vertical">
            {Object.keys(configModes).map(key => (
              <Tab key={key} label={key} value={key} />
            ))}
          </Tabs>
          {configMode !== 'Network' && (
            <NodeSelector
              onSelectNode={handleSelectNode}
              selectedNodeName={nodeName}
              mode={configMode}
            />
          )}
        </Grid>
        <Grid item xs={9}>
          <Paper className={classes.viewContainer} elevation={0}>
            <ConfigTaskForm
              mode={configMode}
              title={configModes[configMode]}
              description={configModeDescription[configMode]}
              nodeName={nodeName}>
              {configGroups[configMode]}
            </ConfigTaskForm>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}