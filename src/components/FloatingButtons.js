// @flow
import * as React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconAddPhoto from 'material-ui/svg-icons/image/add-a-photo';
import CameraModal from './CameraModal';

const styles = {
  floatingButton: {
    right: 20,
    bottom: 20,
    position: 'fixed',
  },
};

type Props = {
  moveToRegister: () => void,
  moveToAccount: (address: string) => void,
  moveToToken: (tokenId: string) => void,
};

type State = {
  isCameraOpened: boolean,
};

export default class extends React.Component<Props, State> {
  state = {
    isCameraOpened: false,
  };
  openCamera = () => {
    this.setState({ isCameraOpened: true });
  };
  toggleModal = () => {
    this.setState({ isCameraOpened: !this.state.isCameraOpened });
  };
  onScan = (data: string) => {
    this.setState({
      isCameraOpened: false,
    });
    if (data.startsWith('ethereum')) {
      this.props.moveToAccount(data.substr('ethereum'.length));
      return;
    }
    if (data.startsWith('token')) {
      this.props.moveToToken(data.substr('token'.length));
      return;
    }
  };
  render = () => (
    <React.Fragment>
      <div style={styles.floatingButton}>
        <FloatingActionButton
          onClick={() => this.openCamera()}
          backgroundColor="#007bff"
        >
          <IconAddPhoto />
        </FloatingActionButton>
        <FloatingActionButton
          onClick={() => this.props.moveToRegister()}
          backgroundColor="#007bff"
          className="ml-2"
        >
          <IconAdd />
        </FloatingActionButton>
      </div>
      {this.state.isCameraOpened && (
        <CameraModal
          modal={this.state.isCameraOpened}
          toggle={this.toggleModal}
          onScan={this.onScan}
        />
      )}
    </React.Fragment>
  );
}
