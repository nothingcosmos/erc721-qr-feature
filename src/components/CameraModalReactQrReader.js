// @flow
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import QrReader from 'react-qr-reader';

type Props = {
  modal: boolean,
  toggle: () => void,
};

type State = {
  result: string,
};

export default class CameraModal extends React.Component<Props, State> {
  state = {
    result: '',
  };
  handleScan = (result: string) => {
    if (result) {
      this.setState({
        result: result,
      });
    }
  };
  handleError = (err: Error) => {
    throw err;
  };
  render() {
    return (
      <Modal isOpen={this.props.modal} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>Modal title</ModalHeader>
        <ModalBody>
          <QrReader onScan={this.handleScan} onError={this.handleError} />
        </ModalBody>
        <ModalFooter>
          <p>{this.state.result}</p>
          <Button color="primary" onClick={this.props.toggle}>
            OK
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
