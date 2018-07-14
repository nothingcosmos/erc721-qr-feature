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
                <Label for="from">Address</Label>
                <Input type="text" id="from" disabled value={this.props.from} />
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}
