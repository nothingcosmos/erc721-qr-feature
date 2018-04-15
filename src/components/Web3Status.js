// @flow
import * as React from 'react';
import { Button } from 'reactstrap';
import ContractModal from './ContractModal';

const styles = {
  button: {
    padding: 0,
    verticalAlign: 'inherit',
  },
};

type Props = {
  isConnected: boolean,
  networkName: ?string,
  accountAddress: ?string,
  contractAddress: ?string,
  refreshNetworkName: () => any,
  refreshAccountAddress: () => any,
  updateContractAddress: (address: string) => any,
  isAddress: (address: string) => boolean,
};

type State = {
  openContractAddressDialog: boolean,
};

function maybeNull(s: ?string) {
  return s || 'Not Available';
}

export default class extends React.Component<Props, State> {
  state = {
    openContractAddressDialog: false,
  };
  toggleContractAddressDialog = () => {
    this.setState({
      openContractAddressDialog: !this.state.openContractAddressDialog,
    });
  };
  render = () => (
    <React.Fragment>
      <dl className="dl-horizontal">
        <dt>Web3</dt>
        <dd>{this.props.isConnected ? 'Available' : 'Not Available'}</dd>
        <dt>
          Account{' '}
          <Button
            color="link"
            onClick={this.props.refreshAccountAddress}
            style={styles.button}
          >
            Sync
          </Button>
        </dt>
        <dd>{maybeNull(this.props.accountAddress)}</dd>
        <dt>
          Network{' '}
          <Button
            color="link"
            onClick={this.props.refreshNetworkName}
            style={styles.button}
          >
            Sync
          </Button>
        </dt>
        <dd>{maybeNull(this.props.networkName)}</dd>
        <dt>
          Contract Address{' '}
          <Button
            color="link"
            onClick={() => this.toggleContractAddressDialog()}
            style={styles.button}
          >
            Change
          </Button>
        </dt>
        <dd>{maybeNull(this.props.contractAddress)}</dd>
      </dl>
      <ContractModal
        open={this.state.openContractAddressDialog}
        onSubmit={address => {
          this.toggleContractAddressDialog();
          this.props.updateContractAddress(address);
        }}
        onCancel={() => this.toggleContractAddressDialog()}
        isAddress={this.props.isAddress}
      />
    </React.Fragment>
  );
}
