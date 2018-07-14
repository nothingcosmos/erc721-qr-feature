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

type Props = {
  modal: boolean,
  toggle: () => void,
  from: string,
  tokenId: string,
  onSubmit: (tokenId: string) => void | Promise<void>,
};

type State = {

};

export default class extends React.Component<Props, State> {
  state = {
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.onSubmit(this.props.tokenId);
    this.props.toggle();
  };

  render() {
    return (
      <React.Fragment>
        <Modal isOpen={this.props.modal}>
          <ModalHeader toggle={this.props.toggle}>Remove Card</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="from">From</Label>
                <Input type="text" id="from" disabled value={this.props.from} />
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
                  color="danger"
                  outline
                  onClick={e => this.handleSubmit(e)}
                >
                  Remove
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}
