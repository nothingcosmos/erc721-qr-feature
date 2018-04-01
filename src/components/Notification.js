// @flow
import React from 'react';

import Snackbar from 'material-ui/Snackbar';

type NotificationProps = {
  message: string,
  timestamp: number,
};

type NotificationState = {
  open: boolean,
};

class Notification extends React.Component<
  NotificationProps,
  NotificationState
> {
  state = {
    open: false,
  };

  componentWillReceiveProps = (nextProps: NotificationProps) => {
    if (nextProps.message && nextProps.timestamp > this.props.timestamp) {
      this.setState({
        open: true,
      });
    }
  };

  close = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    return (
      <Snackbar
        open={this.state.open}
        message={this.props.message}
        action="Close"
        autoHideDuration={4000}
        onActionClick={this.close}
        onRequestClose={this.close}
      />
    );
  }
}

export default Notification;
