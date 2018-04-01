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
  onSubmit: (to: string) => void,
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

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.onSubmit(this.state.to);
    this.props.toggle();
  };

  openQRScanner = () => {
    this.setState({
      isCameraOpened: true,
    });
  };

  toggleCameraModal = () => {
    this.setState({
      isCameraOpened: !this.state.isCameraOpened,
    });
  };

  onScan = (data: string) => {
    const prefix = 'ethereum:';
    if (data.startsWith(prefix)) {
      data = data.substr(prefix.length);
    }
    this.setState({
      to: data,
      isCameraOpened: false,
    });
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
                    <Button onClick={e => this.openQRScanner()}>Scan QR</Button>
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
