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
import LoadingSpinner from './LoadingSpinner';
import { isNullOrUndefined } from 'util';

type Props = {
  modal: boolean,
  toggle: () => void,
  viewUser: AuthUser,
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
          {isNullOrUndefined(this.props.viewUser) ? (
            <LoadingSpinner />
          ) : (
              <ModalBody>
                <Form>
                  <FormGroup>
                    <Label for="accountAddress">AccountAddress</Label>
                    <Input type="text" id="accountAddress" disabled value={this.props.viewUser.accountAddress} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="uid">Uid</Label>
                    <Input type="text" id="uid" disabled
                      value={this.props.viewUser.uid}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="provider">Provider</Label>
                    <Input type="text" id="provider" disabled
                      value={this.props.viewUser.provider}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="displayName">DisplayName</Label>
                    <Input type="text" id="displayName" disabled
                      value={this.props.viewUser.displayName}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="text" id="email" disabled
                      value={this.props.viewUser.email}
                    />
                  </FormGroup>
                </Form>
                <CardImg
                  top
                  src={this.props.viewUser.photoURL}
                />
              </ModalBody>
            )
          }
        </Modal>
      </React.Fragment>
    );
  }
}
