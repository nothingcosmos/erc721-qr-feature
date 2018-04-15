// @flow
import React from 'react';
import Snackbar from 'material-ui/Snackbar';

type Props = {
  open: boolean,
  message: string,
  close: () => void,
};

export default (props: Props) => (
  <Snackbar
    open={props.open}
    message={props.message}
    action="Close"
    autoHideDuration={4000}
    onActionClick={props.close}
    onRequestClose={props.close}
  />
);
