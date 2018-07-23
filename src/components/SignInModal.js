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
//todo brandsアイコンが描画されない, brandsでないものは描画される。

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
                <Label for="accountAddress">Address</Label>
                <Input type="text" id="accountAddress" disabled value={this.props.accountAddress} />
              </FormGroup>

              <FormGroup>
                <FontAwesomeIcon icon="twitter-square" />
                <Button outline onClick={ e => {
                  e.preventDefault();
                  this.props.handleSignIn("twitter")}}>Sign in with Twitter</Button>
              </FormGroup>

              <FormGroup>
                <FontAwesomeIcon icon="github-square" />
                <Button outline onClick={ e => {                
                  e.preventDefault();
                  this.props.handleSignIn("github")}}>Sign in with GitHub</Button>
              </FormGroup>

              <FormGroup>
                <FontAwesomeIcon icon="google" />
                <Button outline onClick={ e => {               
                  e.preventDefault();
                  this.props.handleSignIn("google")}}>Sign in with Google</Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}
