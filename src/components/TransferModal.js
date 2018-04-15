// @flow
import * as React from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import CameraModal from './CameraModal';

type Props = {
  modal: boolean,
  toggle: () => void,
  from: string,
  tokenId: string,
  onSubmit: (to: string) => void | Promise<void>,
  isAddress: (address: string) => boolean,
};

type State = {
  to: string,
  isCameraOpened: boolean,
};

export default class extends React.Component<Props, State> {
  state = {
    to: '',
    isCameraOpened: false,
  };

  onScan = (data: string) => {
    const prefix = 'ethereum:';
    const address = data.startsWith(prefix) ? data.substr(prefix.length) : data;
    this.setState({
      to: address,
      isCameraOpened: false,
    });
  };

  toggleCameraModal = () => {
    this.setState({
      isCameraOpened: !this.state.isCameraOpened,
    });
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.onSubmit(this.state.to);
    this.props.toggle();
  };

  openQRScanner = async () => {
    if (
      window.web3 &&
      window.web3.currentProvider &&
      window.web3.currentProvider.scanQRCode
    ) {
      const data = await window.web3.currentProvider.scanQRCode(/.*/);
      this.onScan(data);
    } else {
      this.setState({
        isCameraOpened: true,
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        <Modal isOpen={this.props.modal}>
          <ModalHeader toggle={this.props.toggle}>Transfer Token</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="from">From</Label>
                <Input type="text" id="from" disabled value={this.props.from} />
              </FormGroup>

              <FormGroup>
                <Label for="to">To</Label>
                <InputGroup>
                  <Input
                    type="text"
                    id="to"
                    value={this.state.to}
                    onChange={e => this.setState({ to: e.target.value })}
                  />
                  <InputGroupAddon addonType="append">
                    <Button onClick={() => this.openQRScanner()}>
                      Scan QR
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label for="tokenId">Token ID</Label>
                <Input
                  type="text"
                  id="tokenId"
                  disabled
                  value={this.props.tokenId}
                />
              </FormGroup>
              <div className="float-right">
                <Button
                  color="primary"
                  outline
                  onClick={e => this.handleSubmit(e)}
                  disabled={!this.props.isAddress(this.state.to)}
                >
                  Transfer
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
        {this.state.isCameraOpened && (
          <CameraModal
            modal={this.state.isCameraOpened}
            toggle={this.toggleCameraModal}
            onScan={this.onScan}
          />
        )}
      </React.Fragment>
    );
  }
}
