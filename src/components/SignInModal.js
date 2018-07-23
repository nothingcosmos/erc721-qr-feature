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

//for react-fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
library.add(fab);

type Props = {
  modal: boolean,
  toggle: () => void,
  accountAddress: ?string,
  handleSignIn(provider:string) : any,
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
          <ModalHeader toggle={this.props.toggle}>SignIn</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="from">Address</Label>
                <Input type="text" id="from" disabled value={this.props.from} />
              </FormGroup>

              <FormGroup>
                <FontAwesomeIcon icon="twitter-square" />
                <Button outline onClick={ e => {this.props.handleSignIn("twitter")}}>Sign in with Twitter</Button>
              </FormGroup>

              <FormGroup>
                <FontAwesomeIcon icon="github-square" />
                <Button outline onClick={ e => {this.props.handleSignIn("github")}}>Sign in with GitHub</Button>
              </FormGroup>

              <FormGroup>
                <FontAwesomeIcon icon="google" />
                <Button outline onClick={ e => {this.props.handleSignIn("google")}}>Sign in with Google</Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}
