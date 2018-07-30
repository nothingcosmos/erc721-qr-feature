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
  modeTransfer: boolean,//transfer/lendと共通化フラグ
  onSubmit: (to: string) => void | Promise<void>,
  onSubmitLend: (to: string, afterDays: number) => void | Promise<void>,
  isAddress: (address: string) => boolean,
};

type State = {
  to: string,
  isCameraOpened: boolean,
  afterDays: number,
};

//transferとlendingの双方をサポートする
export default class extends React.Component<Props, State> {
  state = {
    to: '',
    isCameraOpened: false,
    afterDays: 30, //初期値
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

  handleSubmitLend = (e: any) => {
    e.preventDefault();
    this.props.onSubmitLend(this.state.to, this.state.afterDays);
    this.props.toggle();
  }

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
          {this.props.modeTransfer ? (
            <ModalHeader toggle={this.props.toggle}>Transfer Token</ModalHeader>
          ) : (            
            <ModalHeader toggle={this.props.toggle}>Lend Token</ModalHeader>
          )}
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
              {this.props.modeTransfer ? (
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
              ) : (
                  <div>
                    <FormGroup>
                      <Label for="afterDays">Lending period(days)</Label>
                      <Input
                        type="text"
                        id="afterDays"
                        value={this.state.afterDays}
                        onChange={e => this.setState({ afterDays: e.target.value })}
                      />
                    </FormGroup>
                    <div className="float-right">
                      <Button
                        color="primary"
                        outline
                        onClick={e => this.handleSubmitLend(e)}
                        disabled={!this.props.isAddress(this.state.to)}
                      >
                        Lend
                      </Button>
                    </div>
                  </div>
                )}
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
