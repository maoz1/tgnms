/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import Button from '@material-ui/core/Button';
import FBCMobileAppConfigView from '@fbcnms/mobileapp/FBCMobileAppConfigView';
import MaterialModal from '@fbcnms/tg-nms/app/components/common/MaterialModal';

type Props = {
  children: React.Node,
};

export default function InstallerAppConfig(props: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button {...props} onClick={() => setIsOpen(true)} />
      <MaterialModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        modalTitle="Mobile App Setup"
        modalContent={
          <FBCMobileAppConfigView endpoint="/mobileapp/clientconfig" />
        }
      />
    </>
  );
}
