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
  isAccountAvailable: boolean,
  moveToRegister: () => void,
  moveToAccount: (address: string) => void,
  moveToToken: (tokenId: string) => void,
  isAddress: (address: string) => boolean,
};

type State = {
  isCameraOpened: boolean,
};

export default class extends React.Component<Props, State> {
  state = {
    isCameraOpened: false,
  };
  onScan = (data: string) => {
    this.setState({
      isCameraOpened: false,
    });
    if (data.startsWith('token:')) {
      this.props.moveToToken(data.substr('token:'.length));
    } else if (data.startsWith('ethereum:')) {
      this.props.moveToAccount(data.substr('ethereum:'.length));
    } else if (this.props.isAddress(data)) {
      this.props.moveToAccount(data);
    }
  };
  toggleModal = () => {
    this.setState({ isCameraOpened: !this.state.isCameraOpened });
  };
  openCamera = async () => {
    if (
      window.web3 &&
      window.web3.currentProvider &&
      window.web3.currentProvider.scanQRCode
    ) {
      const data = await window.web3.currentProvider.scanQRCode(/.*/);
      this.onScan(data);
    } else {
      this.setState({ isCameraOpened: true });
    }
  };
  // FABにTooltipを使うにはv1が必要
  // https://material-ui-next.com/demos/tooltips/
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
          disabled={!this.props.isAccountAvailable}
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
