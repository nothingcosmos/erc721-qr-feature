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
import Footer from './Footer';

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
  handleSignIn(email: string, password: string, create: boolean): any,
  handleOAuth(provider: string): any,
  handleOpenTerms(): any,
  handleOpenPrivacy(): any,
};

type State = {
  email:string,
  password:string,
  create:boolean,
};

export default class extends React.Component<Props, State> {
  state = {
    email : "",
    password : "",
    create : false,
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
                <Label for="email">Email</Label>
                <Input type="email" name="email" id="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input type="password" name="password" id="password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input type="checkbox" onChange={e => this.setState({create: e.target.value })} />{' '}
                  CreateAccount
              </Label>
              </FormGroup>
              <FormGroup>
                <Button outline onClick={e => {
                  e.preventDefault();
                  this.props.handleSignIn(this.state.email, this.state.password, true)
                }}
                disabled={this.state.email.length === 0 || this.state.password.length === 0}
                >Sign in</Button>
              </FormGroup>

              <FormGroup>
                <Label>{' '}OR</Label>
              </FormGroup>
              <FormGroup>
                <FontAwesomeIcon icon="twitter-square" />
                <Button outline onClick={e => {
                  e.preventDefault();
                  this.props.handleOAuth("twitter")
                }}>Sign in with Twitter</Button>
              </FormGroup>

              <FormGroup>
                <FontAwesomeIcon icon="github-square" />
                <Button outline onClick={e => {
                  e.preventDefault();
                  this.props.handleOAuth("github")
                }}>Sign in with GitHub</Button>
              </FormGroup>

              <FormGroup>
                <FontAwesomeIcon icon="google" />
                <Button outline onClick={e => {
                  e.preventDefault();
                  this.props.handleOAuth("google")
                }}>Sign in with Google</Button>
              </FormGroup>
            </Form>
            <hr />
            <Footer
              handleOpenPrivacy={this.props.handleOpenPrivacy}
              handleOpenTerms={this.props.handleOpenTerms}
            />
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}
