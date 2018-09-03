// @flow
import * as React from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';

type Props = {
  modal: boolean,
  toggle: () => void,
  onSubmit: (accessToken:string, message:string, email:string) => void,
  //
  tokenId:string,
  requestId:string,
  uid:string,
};

type State = {
  email: string,
  message: string,
  accessToken: string,
};

export default class extends React.Component<Props, State> {
  state = {
    email: '',
    message: '',
    accessToken:'',
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.onSubmit(this.state.accessToken, this.state.message, this.state.email);
    this.props.toggle();
  };

  render() {
    return (
      <Modal isOpen={this.props.modal}>
        <ModalHeader toggle={this.props.toggle}>Send Request</ModalHeader>
        <ModalBody>
          <Form>
          <FormGroup>
              <Label for="accessToken">CloudSign AccessToken (required)</Label>
              <Input
                type="text"
                id="accessToken"
                value={this.state.accessToken}
                onChange={e => this.setState({ accessToken: e.target.value })}
              />
            </FormGroup>
            {/* @todo */}
            <FormGroup>
              <Label for="email">Email (required)</Label>
              <Input
                type="email"
                id="email"
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="message">Message (optional)</Label>
              <Input
                type="text"
                id="message"
                value={this.state.message}
                onChange={e => this.setState({ message: e.target.value })}
              />
            </FormGroup>
            <div className="float-right">
              <Button
                color="primary"
                outline
                onClick={e => this.handleSubmit(e)}
                disabled={this.state.accessToken.length === 0}
              >
                Submit
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    );
  }
}
