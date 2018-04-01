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
  onSubmit: string => void,
};

type State = {
  message: string,
};

export default class extends React.Component<Props, State> {
  state = {
    message: '',
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.onSubmit(this.state.message);
    this.props.toggle();
  };

  render() {
    return (
      <Modal isOpen={this.props.modal}>
        <ModalHeader toggle={this.props.toggle}>Send Request</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="message">Message (required)</Label>
              <Input
                type="text"
                id="name"
                value={this.state.message}
                onChange={e => this.setState({ message: e.target.value })}
              />
            </FormGroup>
            <div className="float-right">
              <Button
                color="primary"
                outline
                onClick={e => this.handleSubmit(e)}
                disabled={this.state.message.length === 0}
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
