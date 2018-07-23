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
  accountAddress: string,
};

type State = {
};

export default class extends React.Component<Props, State> {
  state = {

  };

  render() {
    return (
      <React.Fragment>
        <Modal isOpen={this.props.modal}>
          <ModalHeader toggle={this.props.toggle}>Account Detail</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="accountAddress">Address</Label>
                <Input type="text" id="accountAddress" disabled value={this.props.accountAddress} />
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}
