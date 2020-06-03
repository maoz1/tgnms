/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow
 */

import * as React from 'react';
import Collapse from '@material-ui/core/Collapse';
import CustomTable from '../../components/common/CustomTable';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import HealthIndicator from '../../views/network_test/HealthIndicator';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import classNames from 'classnames';
import {HEALTH_CODES} from '../../constants/HealthConstants';
import {makeStyles} from '@material-ui/styles';

import type {LinkHealthType, LinkTestResultType} from './NetworkTestTypes';

const rowHeight = 50;

type Props = {
  executions: Array<LinkTestResultType>,
  onRowSelect: ({link_name: string}) => void,
  dropDownText: string,
  health: $Values<typeof HEALTH_CODES>,
};

const useStyles = makeStyles(theme => ({
  healthIndicator: {
    margin: theme.spacing(0.5),
    width: theme.spacing(0.5),
    height: theme.spacing(3),
  },
  customTableWrapper: {
    marginTop: -theme.spacing(2),
    height: theme.spacing(36),
  },
  healthCell: {
    marginLeft: -theme.spacing(4),
  },
  healthDropDown: {
    zIndex: 10,
    marginBottom: theme.spacing(0.5),
  },
  rotateIcon: {
    transform: 'rotate(90deg)',
  },
  transition: {
    transition: 'all 0.3s',
  },
  linkDirectionHealth: {},
}));

export default function HealthGroupDropDown(props: Props) {
  const classes = useStyles();
  const {executions, dropDownText, health, onRowSelect} = props;
  const [showDropDown, setShowDropDown] = React.useState(false);

  const tableProps = React.useMemo(() => {
    const tableDimensions = {
      rowHeight,
      headerHeight: 40,
      overscanRowCount: 10,
    };

    const rows = executions
      ? executions.map(linkResult => ({
          link_name: linkResult.linkName,
          health: linkResult.results.map(result => ({
            id: result.id,
            health: HEALTH_CODES[result.health],
          })),
        }))
      : [];

    const columns = [
      {
        label: '',
        key: 'link_name',
        width: 225,
        filter: true,
      },
      {
        key: 'health',
        label: '',
        width: 40,
        render: (linkHealth: Array<LinkHealthType>) =>
          linkHealth && (
            <div className={classes.healthCell}>
              {linkHealth.map(result => (
                <HealthIndicator
                  className={classes.linkDirectionHealth}
                  key={result.id}
                  health={
                    typeof result.health === 'number'
                      ? result.health
                      : HEALTH_CODES.MISSING
                  }
                />
              ))}
            </div>
          ),
      },
    ];

    return {
      ...tableDimensions,
      columns,
      data: rows,
    };
  }, [executions, classes]);

  const toggleDropDown = React.useCallback(
    () => setShowDropDown(curr => !curr),
    [setShowDropDown],
  );

  return (
    <>
      <FormControlLabel
        className={classes.healthDropDown}
        control={
          <IconButton
            size="small"
            onClick={toggleDropDown}
            data-testid="drawer-toggle-button">
            <PlayArrowIcon
              color="secondary"
              className={classNames(
                showDropDown ? classes.rotateIcon : '',
                classes.transition,
              )}
            />
          </IconButton>
        }
        label={
          <>
            <HealthIndicator
              health={health}
              className={classes.healthIndicator}
            />
            {dropDownText}
          </>
        }
      />
      <Collapse in={showDropDown}>
        <div
          className={classes.customTableWrapper}
          data-testid="drop-down-table">
          <CustomTable {...tableProps} onRowSelect={onRowSelect} />
        </div>
      </Collapse>
    </>
  );
}