// @flow
import * as React from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  CardImg,
} from 'reactstrap';
import type { AuthUser } from '../stores/authStore';

type Props = {
  modal: boolean,
  toggle: () => void,
  authUser: AuthUser,
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
          <ModalHeader toggle={this.props.toggle}>User Detail</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="accountAddress">AccountAddress</Label>
                <Input type="text" id="accountAddress" disabled value={this.props.authUser.accountAddress} />
              </FormGroup>
              <FormGroup>
                <Label for="uid">Uid</Label>
                <Input type="text" id="uid" disabled
                  value={this.props.authUser.uid}
                />
              </FormGroup>
              <FormGroup>
                <Label for="provider">Provider</Label>
                <Input type="text" id="provider" disabled
                  value={this.props.authUser.provider}
                />
              </FormGroup>
              <FormGroup>
                <Label for="displayName">DisplayName</Label>
                <Input type="text" id="displayName" disabled
                  value={this.props.authUser.displayName}
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input type="text" id="email" disabled
                  value={this.props.authUser.email}
                />
              </FormGroup>
            </Form>
            <CardImg
              top
              src={this.props.authUser.photoURL}
            />
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}
