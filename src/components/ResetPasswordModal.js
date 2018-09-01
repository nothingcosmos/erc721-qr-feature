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
  onReset: (string) => void,
};

type State = {
  email: string,
};

export default class extends React.Component<Props, State> {
  state = {
    email: '',
  };

  handleReset = (e: any) => {
    e.preventDefault();
    this.props.onReset(this.state.email);
    this.props.toggle();
  };

  render() {
    return (
      <Modal isOpen={this.props.modal}>
        <ModalHeader toggle={this.props.toggle}>Reset your password</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="email">Email (required)</Label>
              <Input
                type="email"
                id="email"
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
              />
            </FormGroup>
            <div className="float-right">
              <Button
                color="primary"
                outline
                onClick={e => this.handleReset(e)}
                disabled={this.state.email.length === 0}
              >
                Reset
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    );
  }
}
